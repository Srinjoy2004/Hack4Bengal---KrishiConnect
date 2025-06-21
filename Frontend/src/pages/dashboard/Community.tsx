import { useState } from 'react';

// Define user type
// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   role: string;
//   location: string;
// }

// Define post type
// interface Post {
//   id: string;
//   userId: string;
//   content: string;
//   images?: string[];
//   likes: number;
//   comments: number;
//   timestamp: Date;
//   tags: string[];
// }

// Sample users
const users = {
  "user1": {
    id: "user1",
    name: "John Smith",
    avatar: "JS",
    role: "Organic Farmer",
    location: "Iowa, USA"
  },
  "user2": {
    id: "user2",
    name: "Maria Rodriguez",
    avatar: "MR",
    role: "Vineyard Owner",
    location: "California, USA"
  },
  "user3": {
    id: "user3",
    name: "Rajiv Patel",
    avatar: "RP",
    role: "Sustainable Agriculture Expert",
    location: "Gujarat, India"
  },
  "user4": {
    id: "user4",
    name: "Emma Thompson",
    avatar: "ET",
    role: "Urban Farmer",
    location: "London, UK"
  }
};

// Sample posts
const samplePosts = [
  {
    id: "post1",
    userId: "user2",
    content: "Just harvested our first batch of organic grapes for the season! The drought-resistant varieties we planted last year are showing great promise with 30% less water consumption.",
    images: ["/api/placeholder/400/300"],
    likes: 45,
    comments: 12,
    timestamp: new Date(2025, 3, 16, 9, 30),
    tags: ["OrganicFarming", "Vineyard", "WaterConservation"]
  },
  {
    id: "post2",
    userId: "user3",
    content: "I'm testing a new companion planting technique with marigolds to repel pests naturally in my tomato fields. After 3 weeks, I'm seeing significantly fewer aphids. Has anyone else tried this combination?",
    likes: 32,
    comments: 24,
    timestamp: new Date(2025, 3, 17, 7, 15),
    tags: ["CompanionPlanting", "PestControl", "OrganicFarming"]
  },
  {
    id: "post3",
    userId: "user4",
    content: "My vertical hydroponic system is thriving on the rooftop! We've managed to grow 200kg of leafy greens in just 50 square meters. Urban farming is the future of sustainable food production in metropolitan areas.",
    images: ["/api/placeholder/400/300"],
    likes: 67,
    comments: 18,
    timestamp: new Date(2025, 3, 17, 12, 45),
    tags: ["UrbanFarming", "Hydroponics", "FoodSecurity"]
  },
  {
    id: "post4",
    userId: "user1",
    content: "Weather alert! Heavy rainfall expected in the Midwest next week. I'm preparing my fields by clearing drainage channels and delaying the fertilizer application. Stay safe, fellow farmers!",
    likes: 28,
    comments: 9,
    timestamp: new Date(2025, 3, 17, 15, 20),
    tags: ["WeatherAlert", "FarmManagement", "SoilConservation"]
  }
];

// Sample trending topics
const trendingTopics = [
  { id: "1", name: "DroughtResistantCrops", posts: 1243 },
  { id: "2", name: "RegenerativeAgriculture", posts: 856 },
  { id: "3", name: "SmartIrrigation", posts: 742 },
  { id: "4", name: "FarmTech2025", posts: 621 },
  { id: "5", name: "OrganicCertification", posts: 519 }
];

// Sample events
const upcomingEvents = [
  { id: "1", name: "Midwest Farming Expo", date: "Apr 25, 2025", location: "Chicago, IL" },
  { id: "2", name: "Sustainable Soil Workshop", date: "May 3, 2025", location: "Virtual Event" },
  { id: "3", name: "Organic Farmers Market", date: "May 10, 2025", location: "Denver, CO" }
];

// SVG icons as components for cleaner code
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconNetwork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCrops = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconHeart = ({ filled }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function AgriGram() {
  const [currentUser] = useState(users.user1);
  const [posts, setPosts] = useState(samplePosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState({});

  // Function to handle posting new content
  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: `post${Date.now()}`,
      userId: currentUser.id,
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      tags: extractHashtags(newPostContent)
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };
  
  // Function to extract hashtags from content
  const extractHashtags = (content) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  // Function to handle liking a post
  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const wasLiked = prev[postId];
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: wasLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
      
      return { ...prev, [postId]: !wasLiked };
    });
  };

  // Function to format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Post component for better organization
  const PostCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">{users[post.userId].avatar}</span>
        </div>
        <div>
          <p className="font-medium text-green-800">{users[post.userId].name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {users[post.userId].role} • {formatTimestamp(post.timestamp)}
          </p>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mt-3">
            {post.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt="Post image" 
                className="rounded-lg max-h-64 w-full object-cover" 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-green-50 flex justify-between">
        <button 
          onClick={() => handleLike(post.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
            likedPosts[post.id] ? 'text-green-600 font-medium' : 'text-gray-600'
          }`}
        >
          <IconHeart filled={likedPosts[post.id]} />
          {post.likes}
        </button>
        <button className="flex items-center gap-1 text-gray-600 px-2 py-1 rounded-lg text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {post.comments}
        </button>
        <button className="flex items-center gap-1 text-gray-600 px-2 py-1 rounded-lg text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        <button className="flex items-center gap-1 text-gray-600 px-2 py-1 rounded-lg text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-green-50 overflow-hidden">
      {/* Header - Fixed at top */}
      <header className="bg-green-500 text-white px-5 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
            <path d="M16.5 3.5c1.5 1.5 1.5 4.5 0 6S13 6.5 13 5s2-3 3.5-1.5z" />
          </svg>
          <span className="font-bold text-lg">AgriGram</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-green-600 text-white placeholder-green-200 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-white"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-2 top-2 text-green-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex flex-1 h-full max-w-6xl mx-auto w-full p-4 gap-4 overflow-hidden">
        {/* Left Sidebar - Fixed Width */}
        <div className="hidden md:block w-60 bg-white rounded-xl p-4 shadow-sm h-fit sticky top-4">
          <div className="flex flex-col items-center mb-6 pb-4 border-b border-green-100">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-white text-xl font-semibold">{currentUser.avatar}</span>
            </div>
            <h2 className="font-medium text-green-800">{currentUser.name}</h2>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {currentUser.location}
            </p>
          </div>
          
          <h3 className="text-green-800 mb-2 text-sm font-medium">Navigation</h3>
          <ul className="space-y-1 mb-6">
            <li className="p-2 rounded-lg cursor-pointer flex items-center gap-2 text-green-800 bg-green-100 font-medium">
              <IconHome />
              Home
            </li>
            <li className="p-2 rounded-lg cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-green-50">
              <IconNetwork />
              My Network
            </li>
            <li className="p-2 rounded-lg cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-green-50">
              <IconCrops />
              My Crops
            </li>
            <li className="p-2 rounded-lg cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              AgriTips
            </li>
            <li className="p-2 rounded-lg cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Pest Alerts
            </li>
          </ul>
          
          <h3 className="text-green-800 mb-2 text-sm font-medium">My Communities</h3>
          <ul className="space-y-1">
            <li className="p-2 rounded-lg cursor-pointer text-xs text-gray-700 hover:bg-green-50">
              🌱 Regenerative Farming
            </li>
            <li className="p-2 rounded-lg cursor-pointer text-xs text-gray-700 hover:bg-green-50">
              🚜 Modern Farm Equipment
            </li>
            <li className="p-2 rounded-lg cursor-pointer text-xs text-gray-700 hover:bg-green-50">
              🌿 Organic Certification Group
            </li>
            <li className="p-2 rounded-lg cursor-pointer text-xs text-gray-700 hover:bg-green-50">
              💧 Irrigation Technology
            </li>
          </ul>
        </div>

        {/* Main Feed - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white rounded-t-xl overflow-hidden shadow-sm mb-4 sticky top-0 z-10">
            <div className="flex">
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'feed' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-green-50'}`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'trending' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-green-50'}`}
                onClick={() => setActiveTab('trending')}
              >
                Trending Topics
              </button>
              <button 
                className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'events' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-green-50'}`}
                onClick={() => setActiveTab('events')}
              >
                Events
              </button>
            </div>
          </div>
          
          {/* Content Area - Scrollable */}
          <div className="overflow-y-auto flex-1 pb-16 md:pb-4">
            {/* New Post Input */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">{currentUser.avatar}</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Share your farming updates, tips, or questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px] text-sm"
                  />
                  <div className="flex justify-between mt-2">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-green-700 hover:bg-green-50 px-2 py-1 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Photo
                      </button>
                      <button className="flex items-center gap-1 text-green-700 hover:bg-green-50 px-2 py-1 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Location
                      </button>
                      <button className="flex items-center gap-1 text-green-700 hover:bg-green-50 px-2 py-1 rounded-lg text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        Tag
                      </button>
                    </div>
                    <button
                      onClick={handlePost}
                      disabled={!newPostContent.trim()}
                      className={`px-4 py-1 rounded-lg ${
                        newPostContent.trim() 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      } transition-colors text-sm font-medium`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feed Content */}
            {activeTab === 'feed' && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
            
            {/* Trending Topics */}
            {activeTab === 'trending' && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-medium text-green-800 mb-4">Trending in Agriculture</h2>
                <div className="space-y-4">
                  {trendingTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 hover:bg-green-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-medium text-green-700">#{topic.name}</p>
                        <p className="text-xs text-gray-500">{topic.posts} posts</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-green-600 hover:underline text-sm">
                  View all trending topics
                </button>
              </div>
            )}
            
            {/* Events */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-green-800">Upcoming Agricultural Events</h2>
                  <button className="text-green-600 hover:bg-green-50 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-green-100 rounded-lg p-4 hover:bg-green-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-green-800">{event.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium h-fit">
                          {event.date}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors">
                          RSVP
                        </button>
                        <button className="border border-green-500 text-green-500 px-3 py-1 rounded-lg text-sm hover:bg-green-50 transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-green-600 hover:underline text-sm">
                    View all upcoming events
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Weather and Tips (Hidden on mobile) */}
        <div className="hidden lg:block w-72 space-y-4">
          {/* Weather Widget */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-green-800">Weather Forecast</h3>
              <span className="text-xs text-gray-500">Iowa, USA</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <div>
                  <p className="text-3xl font-semibold text-gray-800">75°F</p>
                  <p className="text-xs text-gray-500">Sunny</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Wind: 5 mph</p>
                <p className="text-sm">Humidity: 45%</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 pt-2 border-t border-green-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">Fri</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 10-7.894 0H4v8h16v-8h-4.053z" />
                </svg>
                <p className="text-xs">70°F</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Sat</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 15h.393a2 2 0 0 0 1.712-.971l.602-1.036a2 2 0 0 1 1.712-.971h.393" />
                  <path d="M8 15h.393a2 2 0 0 0 1.712-.971l.602-1.036a2 2 0 0 1 1.712-.971h.393" />
                  <path d="M13 15h.393a2 2 0 0 0 1.712-.971l.602-1.036a2 2 0 0 1 1.712-.971h.393" />
                  <path d="M18 15h.393a2 2 0 0 0 1.712-.971l.602-1.036a2 2 0 0 1 1.712-.971h.393" />
                </svg>
                <p className="text-xs">68°F</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Sun</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <p className="text-xs">78°F</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Mon</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="8" y1="20" x2="8.01" y2="20" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                  <line x1="12" y1="22" x2="12.01" y2="22" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                  <line x1="16" y1="20" x2="16.01" y2="20" />
                </svg>
                <p className="text-xs">62°F</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Tue</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v1M12 21v1M4.2 4.2l.8.8M19 19l.8.8M2 12h1M21 12h1M4.2 19.8l.8-.8M19 5l.8-.8M12 8a4 4 0 0 0-4 4v8h8v-8a4 4 0 0 0-4-4z" />
                </svg>
                <p className="text-xs">72°F</p>
              </div>
            </div>
          </div>

          {/* Agriculture Tips */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium text-green-800 mb-3">Today's AgriTips</h3>
            <ul className="space-y-3">
              <li className="text-sm flex gap-2">
                <span className="text-green-500 font-bold">•</span>
                <p>Consider applying mulch around your vegetable plants to retain soil moisture as temperatures rise this week.</p>
              </li>
              <li className="text-sm flex gap-2">
                <span className="text-green-500 font-bold">•</span>
                <p>Monitor for corn leaf aphids - they're being reported in neighboring counties.</p>
              </li>
              <li className="text-sm flex gap-2">
                <span className="text-green-500 font-bold">•</span>
                <p>Time to check soil pH levels as planting season approaches. Ideal range for most crops is 6.0-7.0.</p>
              </li>
            </ul>
            <button className="w-full mt-3 text-center text-green-600 hover:underline text-sm">
              View more tips
            </button>
          </div>

          {/* Who to Follow */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium text-green-800 mb-3">Connect with Farmers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">AB</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Brown</p>
                    <p className="text-xs text-gray-500">Dairy Farmer, WI</p>
                  </div>
                </div>
                <button className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600">
                  Connect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">KL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kim Lee</p>
                    <p className="text-xs text-gray-500">Apple Orchard, WA</p>
                  </div>
                </div>
                <button className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600">
                  Connect
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">James Davis</p>
                    <p className="text-xs text-gray-500">Hemp Grower, CO</p>
                  </div>
                </div>
                <button className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 px-2 py-2 flex justify-around items-center">
        <button className="p-1 rounded-full text-green-600">
          <IconHome />
        </button>
        <button className="p-1 rounded-full text-gray-400">
          <IconNetwork />
        </button>
        <button className="p-3 rounded-full bg-green-500 text-white shadow-lg -mt-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button className="p-1 rounded-full text-gray-400">
          <IconCrops />
        </button>
        <button className="p-1 rounded-full text-gray-400">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-800 font-semibold text-xs">{currentUser.avatar}</span>
          </div>
        </button>
      </div>
    </div>
  );
}