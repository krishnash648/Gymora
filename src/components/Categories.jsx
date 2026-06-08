import "../App.css";

function Categories(props) {
  const { categories, selectedCategory, setSelectedCategory } = props;

  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          className={selectedCategory === category ? "active-category" : ""}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Categories;
