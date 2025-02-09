// import {useState} from "react";
// import CategoryPill from "./CategoryPill";

// export default function CategoriesInput({categories, onCategoryChange}) {
//   //   const [categories, setCategories] = useState(initialCategories);
//   const [newCategory, setNewCategory] = useState("");

//   const handleAddCategory = e => {
//     if (e.key === "Enter" && newCategory.trim()) {
//       setCategories([...categories, newCategory.trim()]);
//       setNewCategory("");
//       onCategoryChange([...categories, newCategory.trim()]);
//     }
//   };

//   const handleDeleteCategory = index => {
//     const updatedCategories = categories.filter((_, i) => i !== index);
//     setCategories(updatedCategories);
//     onCategoryChange(updatedCategories);
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-2">
//       {categories.map((category, index) => (
//         <CategoryPill
//           key={index}
//           category={category}
//           onDeleteCategory={() => handleDeleteCategory(index)}
//         />
//       ))}
//       <input
//         className="mx-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium focus:outline-none focus:bg-tennis-100 focus:text-shell-00"
//         type="text"
//         value={newCategory}
//         onChange={e => setNewCategory(e.target.value)}
//         onKeyDown={handleAddCategory}
//         placeholder="Add category..."
//       />
//     </div>
//   );
// }
