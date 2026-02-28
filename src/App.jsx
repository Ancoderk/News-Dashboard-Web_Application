import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import CategoryTabs from './components/CategoryTabs';
import ArticleList from './components/ArticleList';
import './App.css';

function App() {
  const [category, setCategory] = useState('technology');
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- PT 1: AI STATES ---
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // --- PT 2: AI LOGIC ---
  const handleSummarize = async (text) => {
    if (!text) return alert("No content to summarize.");
    setSummaryLoading(true);
    setSummary("");
    try {
      const apiKey = import.meta.env.VITE_GEMINI_KEY;
      const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
      
      const response = await axios.post(endpoint, {
        contents: [{ parts: [{ text: `Summarize this in 3 short bullet points: ${text}` }] }]
      });

      const aiResult = response.data.candidates[0].content.parts[0].text;
      setSummary(aiResult);
    } catch (err) {
      console.error("Gemini Error:", err);
      alert("AI Summary failed. Check your API key.");
    }
    setSummaryLoading(false);
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_NEWS_KEY;
        
        // FIX: Removed the 'env' reference that was causing errors
        if (!apiKey) {
          console.error("VITE_NEWS_KEY is missing from .env.local");
          return;
        }

        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
        const res = await axios.get(url);

        if (res.data.articles.length === 0) {
          setError("No articles found for this category.");
        } else {
          setArticles(res.data.articles);
        }
      } catch (err) {
        setError("Failed to fetch news.");
      }
      setLoading(false);
    };
    fetchNews();
  }, [category]);

  return (
    <div className="App">
      <Navbar />
      
      <main style={{ marginTop: '110px', padding: '0 5%' }}>
        <CategoryTabs activeCategory={category} setCategory={setCategory} />

        <div className="content-area">
          {selectedArticle ? (
            
            <div className="article-detail-container">
              <div className="article-detail-card">
                <button className="back-btn" onClick={() => {
                  setSelectedArticle(null);
                  setSummary(""); // Reset AI text
                }}>
                  ← Back to News
                </button>
                
                <div className="detail-image-wrapper">
                  <img src={selectedArticle.urlToImage} alt={selectedArticle.title} />
                </div>
                
                <h2 className="detail-title">{selectedArticle.title}</h2>
                
                <div className="detail-meta">
                  <strong>Source:</strong> {selectedArticle.source.name} | 
                  <strong>Date:</strong> {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                </div>

               
                <div className="summary-container">
                  <h3 style={{ marginTop: 0, color: '#2563eb' }}> AI Flash Summary</h3>
                  {summaryLoading ? (
                    <p className="ai-loader">Generating artistic summary...</p> 
                  ) : (
                    <div className="summary-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {summary || "Click below for an AI summary."}
                    </div>
                  )}
                </div>

                <div className="detail-actions">
                  <button 
                    className="read-full-btn" 
                    onClick={() => handleSummarize(selectedArticle.description || selectedArticle.title)}
                  >
                    Summarise with AI
                  </button>
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                    <button className="save-btn">Read Original</button>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="section-title">Top {category.charAt(0).toUpperCase() + category.slice(1)} News</h2>
              <ArticleList articles={articles} onArticleClick={setSelectedArticle} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;