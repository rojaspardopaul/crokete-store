import { Button } from "@components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/ui/select";
import useUtilsFunction from "@hooks/useUtilsFunction";

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  const handleChangeVariant = (v) => {
    setValue(v);
    setSelectVariant({
      ...selectVariant,
      [att]: v,
    });
    setSelectVa({ [att]: v });
  };

  // Unique variant values
  const uniqueVariants = [
    ...new Map(variants?.map((v) => [v[att], v]).filter(Boolean)).values(),
  ].filter(Boolean);

  // Resolve display name for a variant value
  const getVariantLabel = (variantValue) => {
    for (const vr of varTitle) {
      if (vr?._id !== att) continue;
      for (const el of vr?.variants || []) {
        if (el?._id === variantValue) {
          return showingTranslateValue(el.name);
        }
      }
    }
    return null;
  };

  return (
    <>
      {option === "Dropdown" ? (
        <Select
          onValueChange={handleChangeVariant}
          value={selectVariant[att] || ""}
        >
          <SelectTrigger className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-600 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-kachabazar-600 sm:text-sm/6">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {uniqueVariants.map((vl) => {
              const label = getVariantLabel(vl[att]);
              if (!label) return null;
              return (
                <SelectItem key={vl[att]} value={vl[att]}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ) : (
        <div className="w-full flex flex-wrap gap-2">
          {uniqueVariants.map((vl) => {
            const label = getVariantLabel(vl[att]);
            if (!label) return null;
            const isSelected = Object?.values(selectVariant).includes(vl[att]);
            return (
              <button
                key={vl[att]}
                onClick={() => handleChangeVariant(vl[att])}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border-2 transition-all duration-200 cursor-pointer min-w-[60px] ${
                  isSelected
                    ? "bg-kachabazar-500 text-white border-kachabazar-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-kachabazar-400 hover:bg-kachabazar-50 hover:text-kachabazar-700 hover:shadow-sm"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default VariantList;
