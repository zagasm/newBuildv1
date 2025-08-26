import React, { useEffect, useRef, useCallback } from "react";
import SinglePostTemplate from "../../component/Posts/single";
import { usePost } from "../../component/Posts/PostContext";
import SinglePostLoader from "../../component/assets/Loader/SinglePostLoader";

const FollowingPost = ({ tab = "following" }) => {
  const {
    HomePostData,
    loadMorePosts,
    hasMore,
    isFetchingMore,
    error,
    changeTab,
    currentTab,
    loading,
    refreshPosts,
  } = usePost();

  const observer = useRef(null);
  const initialized = useRef(false);

  // Handle tab switch on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      changeTab(tab);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [tab, changeTab]);

  // Last post observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (isFetchingMore || !hasMore || loading || !currentTab) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMorePosts();
          }
        },
        {
          threshold: 1.0,
          rootMargin: "200px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingMore, hasMore, loadMorePosts, loading, currentTab]
  );

  // Initial loading state
  if (loading && !isFetchingMore && HomePostData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          {/* <p className="mt-2 text-gray-500">Loading posts...</p> */}
          <SinglePostLoader />
        </div>
      </div>
    );
  }

  // Error state
  if (error && HomePostData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Something went wrong</p>
          <button
            onClick={refreshPosts}
            className="px-3 py-2 bg-blue-500 text-white border-0 rounded hover:bg-blue-600"
            style={{ background: "rgba(143, 7, 231, 1)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {HomePostData.map((post, index) => (
        <div
          key={post?.id || index}
          ref={index === HomePostData.length - 1 ? lastPostRef : null}
        >
          <SinglePostTemplate data={post} />
        </div>
      ))}

      {isFetchingMore && !loading && (
        <div className="text-center py-6 text-gray-500 text-sm">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mb-2"></div>
          <SinglePostLoader />
        </div>
      )}
    </div>
  );
};

export default FollowingPost;
