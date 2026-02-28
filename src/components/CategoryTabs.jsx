// src/components/CategoryTabs.jsx

const CategoryTabs = ({ activeCategory, setCategory }) => {
  const categories = ['general', 'business', 'technology', 'sports', 'health'];

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          // Highlight the active tab
          className={activeCategory === cat ? 'active' : ''} 
          onClick={() => setCategory(cat)} 
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;