import { FiCheck } from "react-icons/fi";

const ProductHighlightsList = ({ highlights }) => {
  if (!highlights?.length) return null;

  return (
    <div className="mb-4">
      <ul className="space-y-1.5">
        {highlights.slice(0, 4).map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <FiCheck className="text-kachabazar-500 mt-0.5 flex-shrink-0" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductHighlightsList;
