import { useEffect, useState, memo, FC } from "react";
import axios from "axios";
import { NodeProps, NodeResizer } from "reactflow";
import ModuleItem from "../molecules/module-item";
import SearchBar from "../atoms/search-bar/search-bar";
import classes from "./modules.module.css";

const CustomNode: FC<NodeProps> = () => {
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 300;
  const [loadedModules, setLoadedModules] = useState<any[]>([]);
  const [displayedModules, setDisplayedModules] = useState<any[]>([]);
  const [, setFilteredModules] = useState<any[]>([]);

  useEffect(() => {
    const filtered = searchString
      ? loadedModules.filter((module) =>
          module.id.toLowerCase().includes(searchString.toLowerCase())
        )
      : loadedModules;
    setFilteredModules(filtered);
    if (searchString) {
      setCurrentPage(1);
      updateDisplayedModules(filtered, 1);
    } else {
      updateDisplayedModules(filtered, currentPage);
    }
  }, [searchString, loadedModules]);

  useEffect(() => {
    async function fetchModules() {
      const response = await axios.get(
        "https://huggingface.co/api/spaces?full=full&direction=-1&sort=likes&limit=5000"
      );
      setLoadedModules(response.data);
      updateDisplayedModules(response.data, currentPage);
    }

    fetchModules();
  }, []);

  const updateDisplayedModules = (modules: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedModules(modules.slice(startIndex, endIndex));
  };

  return (
    <>
      <NodeResizer />
      {/* <Handle type="target" position={Position.Top} /> */}
      <SearchBar
        setSearchString={setSearchString}
        searchString={searchString}
      />
      {displayedModules && displayedModules.length > 0 ? (
        <ul className={classes.modulesList}>
          {displayedModules.map((item, idx) => (
            <ModuleItem key={idx} id={item.id} cardData={item.cardData} />
          ))}
        </ul>
      ) : (
        <span className="dark: text-white" style={{ height: "1500px" }}>
          There is no data to display
        </span>
      )}
    </>
  );
};

export default memo(CustomNode);
