import React from 'react';
import MenuCard from './MenuCard';

function MenuSection({ category, items }) {
  const sectionId = category.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={sectionId} className="menu-section">
      <h2 className="menu-type">{category}</h2>
      <div className="menu-items">
        {items.map((dish) => (
          <MenuCard key={dish.dish_id || dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;

