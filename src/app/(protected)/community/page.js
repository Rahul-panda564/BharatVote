"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";

const FORUM_CATEGORIES_DATA = [
  { id: "trending", name: "Trending", icon: "🔥" },
  { id: "expert", name: "Expert Q&A", icon: "✅" },
  { id: "mock", name: "Mock Elections", icon: "🗳️" },
  { id: "volunteer", name: "Volunteer", icon: "🤝" },
];

const INITIAL_POSTS = [
  // TRENDING
  {
    id: 1, category: "trending", sortBy: ["hot", "new", "top"],
    tag: "First-Time Voter", tagColor: "bg-saffron/10 text-saffron border-saffron/20",
    author: "u/civic_minded", time: "2 hours ago",
    title: "What documents do I absolutely need to bring to the polling booth?",
    body: "I have my EPIC card, but my name on the Aadhar card is spelled slightly differently. Will this be an issue?",
    votes: "1.2k", comments: 245, avatar: "CM"
  },
  {
    id: 5, category: "trending", sortBy: ["hot"],
    tag: "Breaking", tagColor: "bg-danger/10 text-danger border-danger/20",
    author: "u/news_bot", time: "15m ago",
    title: "Voter turnout crosses 60% in Phase 3 by 3:00 PM.",
    body: "Massive participation seen in rural areas. Long queues reported at booths in Lucknow and Varanasi.",
    votes: "8.5k", comments: 1200, avatar: "NB"
  },
  {
    id: 2, category: "expert", sortBy: ["hot", "new", "top"],
    tag: "Expert Q&A", tagColor: "bg-success/10 text-success border-success/20",
    author: "S. Y. Quraishi", authorTitle: "Former CEC", time: "Live Now",
    title: "AMA: Understanding the EVM VVPAT counting process.",
    body: "I'm here to demystify the technical safeguards we have in place for EVM-VVPAT counting.",
    votes: "856", comments: 89, isExpert: true, avatar: "SQ"
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [sortBy, setSortBy] = useState("hot");
  const [activeCategory, setActiveCategory] = useState("trending");
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.category === activeCategory && (post.isUserPost || post.sortBy.includes(sortBy))
    );
  }, [activeCategory, sortBy, posts]);

  const handlePost = () => {
    if (!postText.trim() && !selectedImage) return;
    setIsPosting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        category: activeCategory,
        sortBy: ["new", "hot"],
        tag: "User Post",
        tagColor: "bg-navy text-white",
        author: "You (Verified)",
        time: "Just Now",
        title: postTitle || "Community Update",
        body: postText,
        votes: "1",
        comments: 0,
        avatar: "ME",
        image: selectedImage,
        isUserPost: true
      };

      setPosts([newPost, ...posts]);
      setPostText("");
      setPostTitle("");
      setSelectedImage(null);
      setIsPosting(false);
      setSortBy("new"); // Switch to 'new' to see the post
    }, 800);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Dynamic Header */}
      <section className="bg-navy text-white pt-16 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-saffron text-xs font-black tracking-widest uppercase mb-6 border border-white/10">
            Civic Town Hall
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter">
            Where India <span className="text-saffron">Discusses</span> Democracy
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium opacity-80 pb-10">
            Your voice matters in the world's largest democracy.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Left */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6 border-0 shadow-xl bg-white/90 backdrop-blur-md">
              <h2 className="text-sm font-black text-navy uppercase tracking-widest mb-6 border-b border-cream pb-4">Categories</h2>
              <ul className="space-y-2">
                {FORUM_CATEGORIES_DATA.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                        activeCategory === cat.id ? "bg-navy text-white shadow-lg" : "hover:bg-cream text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{cat.icon}</span>
                        <span className="text-sm font-bold">{cat.name}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-6 space-y-6">
            <div className="card p-6 border-0 shadow-xl bg-white">
               <input 
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Thread Title (Optional)"
                className="w-full bg-transparent text-lg font-black text-navy mb-2 border-0 focus:ring-0 placeholder:opacity-30"
               />
               <textarea 
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share your story or ask a question..."
                className="w-full bg-cream rounded-2xl p-4 text-sm font-medium border-0 min-h-[100px] resize-none focus:ring-2 focus:ring-saffron/10 transition-all"
               />
               
               {selectedImage && (
                 <div className="mt-4 relative inline-block group">
                    <img src={selectedImage} alt="Preview" className="max-h-48 rounded-xl shadow-lg border-4 border-white" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-danger text-white rounded-full font-black shadow-xl scale-0 group-hover:scale-100 transition-transform">✕</button>
                 </div>
               )}

               <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    <button onClick={() => fileInputRef.current.click()} className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center hover:bg-saffron/10 hover:text-saffron transition-all" title="Upload Media">📸</button>
                    <button className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center hover:bg-saffron/10 hover:text-saffron transition-all" title="Create Poll">📊</button>
                  </div>
                  <button 
                    onClick={handlePost} 
                    disabled={isPosting || (!postText.trim() && !selectedImage)} 
                    className="px-10 py-3 rounded-xl bg-navy text-white font-black text-sm shadow-xl disabled:opacity-50 hover:-translate-y-0.5 transition-all"
                  >
                    {isPosting ? "PUBLISHING..." : "POST TO COMMUNITY"}
                  </button>
               </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-6 px-4 py-2 bg-white rounded-2xl shadow-sm border border-border/40">
              {["hot", "new", "top"].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setSortBy(s)}
                  className={`text-[11px] font-black uppercase tracking-widest relative py-2 ${
                    sortBy === s ? "text-navy" : "text-text-muted hover:text-navy"
                  }`}
                >
                  {s}
                  {sortBy === s && <span className="absolute bottom-0 left-0 w-full h-1 bg-saffron rounded-full" />}
                </button>
              ))}
            </div>

            {/* Render Posts */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article key={post.id} className="card p-8 border-0 shadow-xl bg-white group hover:shadow-2xl transition-all duration-500 animate-fade-in">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center gap-3">
                        <button className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-lg hover:bg-saffron hover:text-white transition-all">▲</button>
                        <span className="text-sm font-black text-navy">{post.votes}</span>
                        <button className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-lg hover:bg-info hover:text-white transition-all">▼</button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs">{post.avatar}</div>
                             <p className="text-xs font-black text-navy">{post.author}</p>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${post.tagColor}`}>
                             {post.tag}
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-navy mb-4 group-hover:text-saffron transition-colors leading-tight">{post.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6 opacity-80">{post.body}</p>
                        
                        {post.image && (
                          <div className="mb-6 rounded-2xl overflow-hidden border border-cream shadow-sm">
                            <img src={post.image} alt="User Post Media" className="w-full h-auto object-cover max-h-[400px]" />
                          </div>
                        )}

                        <div className="flex items-center gap-6 pt-4 border-t border-cream">
                           <button className="text-[10px] font-bold text-text-muted hover:text-navy transition-colors">💬 {post.comments} COMMENTS</button>
                           <button className="text-[10px] font-bold text-text-muted hover:text-navy transition-colors">↗ SHARE</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="card p-12 text-center bg-white border-2 border-dashed border-cream">
                   <p className="text-3xl mb-4">📭</p>
                   <h4 className="text-lg font-black text-navy">No posts yet!</h4>
                   <p className="text-sm text-text-muted">Be the first to spark a discussion in the {activeCategory} forum.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
             <div className="card p-8 border-0 shadow-xl bg-gradient-to-br from-saffron to-orange-500 text-navy">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                  <span className="animate-bounce">⚡</span> Live Event
                </h3>
                <p className="text-sm font-bold opacity-90 mb-6">Youth Mock Election is starting soon!</p>
                <button className="w-full py-3 bg-navy text-white rounded-2xl font-black text-xs shadow-xl">
                   RESERVE MY SPOT
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
