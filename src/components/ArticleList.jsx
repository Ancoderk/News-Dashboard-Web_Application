// src/components/ArticleList.jsx
const ArticleList = ({ articles, onArticleClick }) => {
  return (
    <div className="article-grid">
      {articles.map((article, index) => (
        <div 
          key={index} 
          className="article-card" 
          onClick={() => onArticleClick(article)}
        >
          {/* Requirement: Article Thumbnail  */}
          <img 
            src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'} 
            alt={article.title} 
          />
          <div className="card-content">
            {/* Requirement: Title and Source  */}
            <h3>{article.title}</h3>
            <p className="source-name">{article.source.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;