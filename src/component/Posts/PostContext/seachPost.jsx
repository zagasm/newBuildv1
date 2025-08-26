import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "../../assets/projectOverlay.jsx";
import { v4 as uuidv4 } from "uuid";

const PostContext = createContext();
const API_DELAY_MS = 200;
const MAX_RETRIES = 8;
const LIMIT = 20;
const RATE_LIMIT_BACKOFF_FACTOR = 1;

const SearchPostProvider = ({ children, user, token }) => {
  const [HomePostData, setHomePostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentTab, setCurrentTab] = useState('foryou');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const lastRequestTime = useRef(0);
  const retryCount = useRef(0);
  const activeRequests = useRef(new Set());
  const abortControllers = useRef({});
  const loadingRef = useRef(false);
  const searchTimeoutRef = useRef(null);

  const getVisitorId = useCallback(() => {
    const stored = localStorage.getItem("visitor_id");
    if (stored) return stored;
    const id = "visitor_" + uuidv4();
    localStorage.setItem("visitor_id", id);
    return id;
  }, []);

  const userId = user?.id || getVisitorId();

  // Declare fetchPost first to avoid reference errors
  const fetchPost = useCallback(async (loadMore = false, tab = currentTab, passedOffset = offsetRef.current, search = '') => {
    if (!tab || search.trim()) {
      // Don't fetch regular posts if we're in search mode
      return;
    }

    const currentOffset = loadMore ? passedOffset : 0;
    const requestId = `${tab}-${currentOffset}-${search}`;

    if (activeRequests.current.has(requestId)) return;
    activeRequests.current.add(requestId);

    const controller = new AbortController();
    abortControllers.current[requestId] = controller;

    try {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < API_DELAY_MS) {
        await new Promise((res) =>
          setTimeout(res, API_DELAY_MS - timeSinceLastRequest)
        );
      }
      lastRequestTime.current = Date.now();

      const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/meme/${userId}/${tab}/${currentOffset}/${LIMIT}/${encodeURIComponent(search)}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        signal: controller.signal,
      });

      if (response.status === 429) {
        retryCount.current++;
        if (retryCount.current <= MAX_RETRIES) {
          const retryAfter =
            parseInt(response.headers.get("Retry-After")) ||
            RATE_LIMIT_BACKOFF_FACTOR ** retryCount.current;
          await new Promise((res) => setTimeout(res, retryAfter * 1000));
          return fetchPost(loadMore, tab, passedOffset, search);
        }
        throw new Error("Too many requests. Please try again later.");
      }

      retryCount.current = 0;
      const data = await response.json();

      if (data.status && Array.isArray(data.data)) {
        setHomePostData((prev) =>
          loadMore ? [...prev, ...data.data] : data.data
        );
        const newOffset = currentOffset + data.data.length;
        setOffset(newOffset);
        offsetRef.current = newOffset;

        setHasMore(data.data.length === LIMIT);
        setError(null);
      } else {
        if (!loadMore) setHomePostData([]);
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Error loading posts");
      }
    } finally {
      activeRequests.current.delete(requestId);
      delete abortControllers.current[requestId];
      loadMore ? setIsFetchingMore(false) : setLoading(false);
      loadingRef.current = false;
    }
  }, [userId, token, currentTab]);

  // Real-time search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setHomePostData([]);
      setLoading(false);
      setIsSearchMode(false);
      return;
    }

    // Cancel previous search request
    for (const id in abortControllers.current) {
      if (id.startsWith('search')) {
        abortControllers.current[id]?.abort();
        delete abortControllers.current[id];
      }
    }

    setLoading(true);
    setSearchQuery(query);
    setIsSearchMode(true);

    const requestId = `search-${query}-0`;
    
    if (activeRequests.current.has(requestId)) return;
    activeRequests.current.add(requestId);

    const controller = new AbortController();
    abortControllers.current[requestId] = controller;

    try {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < API_DELAY_MS) {
        await new Promise((res) =>
          setTimeout(res, API_DELAY_MS - timeSinceLastRequest)
        );
      }
      lastRequestTime.current = Date.now();

      const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/meme/${userId}/search/0/${LIMIT}/${encodeURIComponent(query)}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        signal: controller.signal,
      });

      if (response.status === 429) {
        retryCount.current++;
        if (retryCount.current <= MAX_RETRIES) {
          const retryAfter =
            parseInt(response.headers.get("Retry-After")) ||
            RATE_LIMIT_BACKOFF_FACTOR ** retryCount.current;
          await new Promise((res) => setTimeout(res, retryAfter * 1000));
          return performSearch(query);
        }
        throw new Error("Too many requests. Please try again later.");
      }

      retryCount.current = 0;
      const data = await response.json();

      if (data.status && Array.isArray(data.data)) {
        setHomePostData(data.data);
        setHasMore(data.data.length === LIMIT);
        setError(null);
      } else {
        setHomePostData([]);
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Error loading search results");
      }
    } finally {
      activeRequests.current.delete(requestId);
      delete abortControllers.current[requestId];
      setLoading(false);
    }
  }, [userId, token]);

  // Debounced search function - now fetchPost is defined before this
  const searchUsers = useCallback((query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setHomePostData([]);
      setSearchQuery('');
      setIsSearchMode(false);
      // When search is cleared, fetch regular tab content
      if (currentTab) {
        fetchPost(false, currentTab, 0, '');
      }
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce
  }, [performSearch, currentTab, fetchPost]);

  const loadMorePosts = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    
    if (isSearchMode && searchQuery) {
      // Load more search results
      setIsFetchingMore(true);
      fetchPost(true, currentTab, offsetRef.current, searchQuery);
    } else if (currentTab && !isSearchMode) {
      // Load more regular tab content
      setIsFetchingMore(true);
      fetchPost(true, currentTab, offsetRef.current, '');
    }
  }, [isFetchingMore, hasMore, isSearchMode, searchQuery, currentTab, fetchPost]);

  const changeTab = useCallback((newTab) => {
    if (newTab !== currentTab) {
      for (const id in abortControllers.current) {
        if (id.startsWith(currentTab)) {
          abortControllers.current[id]?.abort();
          delete abortControllers.current[id];
        }
      }
      activeRequests.current.clear();
      setOffset(0);
      offsetRef.current = 0;
      setHasMore(true);
      setHomePostData([]);
      setCurrentTab(newTab);
      setIsSearchMode(false);
      setSearchQuery('');
      setLoading(true);
      fetchPost(false, newTab, 0, '');
    }
  }, [currentTab, fetchPost]);

  const refreshPosts = useCallback(() => {
    if (isSearchMode && searchQuery) {
      // Refresh search results
      performSearch(searchQuery);
    } else if (currentTab && !isSearchMode) {
      // Refresh regular tab content
      for (const id in abortControllers.current) {
        abortControllers.current[id]?.abort();
        delete abortControllers.current[id];
      }
      activeRequests.current.clear();
      setOffset(0);
      offsetRef.current = 0;
      setHasMore(true);
      setLoading(true);
      fetchPost(false, currentTab, 0, '');
    }
  }, [isSearchMode, searchQuery, currentTab, performSearch, fetchPost]);

  const addNewPost = useCallback((newPost) => {
    setHomePostData((prev) => [newPost, ...prev]);
    setOffset((prev) => prev + 1);
    offsetRef.current += 1;
  }, []);

  // Load initial data - only if not in search mode
  useEffect(() => {
    if (currentTab && !isSearchMode && !searchQuery) {
      fetchPost(false, currentTab, 0, '');
    }
  }, [currentTab, isSearchMode, searchQuery, fetchPost]);

  useEffect(() => {
    return () => {
      for (const id in abortControllers.current) {
        abortControllers.current[id]?.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <PostContext.Provider
      value={{
        HomePostData,
        loading,
        error,
        isFetchingMore,
        hasMore,
        currentTab,
        searchQuery,
        isSearchMode,
        searchUsers,
        fetchPost,
        loadMorePosts,
        changeTab,
        addNewPost,
        refreshPosts,
      }}
    >
      {loading && <LoadingOverlay />}
      {children}
    </PostContext.Provider>
  );
};

const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a SearchPostProvider");
  }
  return context;
};

SearchPostProvider.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  token: PropTypes.string,
};

export { SearchPostProvider, usePost };
export default SearchPostProvider;