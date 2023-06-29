import { useState } from "react";
import { useEffect } from "react";
import { RiFileAddFill } from "react-icons/ri";

const Fileinput = ({
  label,
  name,
  color,
  rounded,
  multiple,
  value,
  onChange,
}) => {
  const [url, setUrl] = useState();
  useEffect(() => {
      if (value && typeof value === 'string'){
          setUrl(value)
      }
  }, [value])


  return (
    <div className="flex flex-wrap gap-2 items-start">
      <label
        htmlFor="fileinput"
        className={`px-4 py-3 my-5  flex items-center gap-2 text-white text-sm font-medium ${
          rounded && rounded
        } ${color ? color : "bg-blue-500"} cursor-pointer`}
      >
        <RiFileAddFill className="w-4 h-4 fill-white" />
        <span>{label}</span>
      </label>

      <input
        id="fileinput"
        type="file"
        multiple={multiple}
        name={name}
        onChange={(e) => {
          onChange(e);
          console.log(e.target.files);
          const reader = new FileReader();
          reader.onload = () => {
            setUrl(reader.result);
          };
          reader.readAsDataURL(e.target.files[0]);
        }}
        className="hidden"
      />
      {url && <img className="h-10 flex  my-6" src={url} />}
    </div>
  );
};

export default Fileinput;
