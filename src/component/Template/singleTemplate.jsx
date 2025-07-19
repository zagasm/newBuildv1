import React, { useEffect, useState } from 'react';
import './SingleTemplateComponent.css';

const allPosts = [
   {
      id: 1,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Modern Luxury Villa in Malibu',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      authorName: 'Michael Chen',
   },
   {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Downtown Retail Space',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      authorName: 'Sarah Johnson',
   },
   {
      id: 3,
      image: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Warehouse with Loading Docks',
      authorAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      authorName: 'David Wilson',
   },
   {
      id: 4,
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Downtown Luxury Loft',
      authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      authorName: 'Emily Rodriguez',
   },
   {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Suburban Family Home',
      authorAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      authorName: 'James Peterson'
   },
   {
      id: 6,
      image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Executive Office Suite',
      authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      authorName: 'Lisa Wong',
   },
   {
      id: 7,
      image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Mountain Retreat Cabin',
      authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      authorName: 'Robert Davis',
   },
   {
      id: 8,
      image: 'https://images.unsplash.com/photo-1600566752225-2202139c8b2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Turnkey Restaurant Space',
      authorAvatar: 'https://randomuser.me/api/portraits/women/51.jpg',
      authorName: 'Maria Garcia',
   },
   {
      id: 9,
      image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Beachfront Cottage',
      authorAvatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      authorName: 'Olivia Smith'
   },
   {
      id: 10,
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Modern Farmhouse',
      authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      authorName: 'William Brown',
   },
   {
      id: 11,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Studio in Arts District',
      authorAvatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      authorName: 'Sophia Martinez',
   },
   {
      id: 12,
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Co-Working Space',
      authorAvatar: 'https://randomuser.me/api/portraits/men/28.jpg',
      authorName: 'Daniel Lee',
   },
   // Auto-generate additional items up to 30
   ...Array.from({ length: 18 }, (_, i) => {
      const id = i + 13;
      return {
         id,
         image: `https://source.unsplash.com/random/1000x600?sig=${id}`,
         title: `Sample Listing ${id}`,
         authorAvatar: `https://randomuser.me/api/portraits/men/${10 + i}.jpg`,
         authorName: `Author ${id}`
      };
   })
];

export default function SingleTemplateComponent() {
   const [visiblePosts, setVisiblePosts] = useState([]);
   const [page, setPage] = useState(1);
   const postsPerPage = 8;

   useEffect(() => {
      loadPosts(page);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [page]);
   const loadPosts = (pageNumber) => {
      const start = (pageNumber - 1) * postsPerPage;
      const end = start + postsPerPage;
      const newPosts = allPosts.slice(start, end);
      setVisiblePosts((prev) => [...prev, ...newPosts]);
   };
   const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
         if (visiblePosts.length < allPosts.length) {
            setPage((prev) => prev + 1);
         }
      }
   };

   return (
      <div className="row">
         {visiblePosts.map(post => (
            <div key={post.id} className="col-xl-3 col-lg-4 col-md-6  col-sm-6 mb-5  pr-0 ">
               <h6 className="text-muted">{post.title}</h6>
               <div className="car shadow-s rounded  h-100 blog-card border-0 position-relative ">
                  <a href="#" className="text-decoration-none text-dark ">
                     <img
                        className="card-img-top"
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                     />
                     <div className="card-footer bg-transparen border-0 d-flex align-items-center">
                        <img
                           className="rounded-circle "
                           src={post.authorAvatar}
                           alt={post.authorName}
                           width="32"
                           height="32"
                        />
                        <div>
                           <small className="text-muted">{post.authorName}</small>
                        </div>
                     </div>
                     <div className='d-flex justify-content-center align-items-center w-100' >
                        <button>Use Template</button>
                     </div>
                  </a>
               </div>
            </div>
         ))}
         {visiblePosts.length < allPosts.length && (
            <div className="text-center mt-3">
               <span>Loading more templates...</span>
            </div>
         )}
      </div>
   );
}
