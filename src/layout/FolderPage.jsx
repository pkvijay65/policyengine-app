import { useSearchParams } from "react-router-dom";
import { copySearchParams } from "../api/call";
import style from "../style";
import ResultsPanel from "./ResultsPanel";
import { motion } from "framer-motion";
import useMobile from "./Responsive";
import { capitalize } from "../api/language";
import getPolicyOutputTree from "../pages/policy/output/tree";
import Divider from "./Divider";

export default function FolderPage(props) {
  const { children } = props;
  const { metadata } = props;
  const POLICY_OUTPUT_TREE = getPolicyOutputTree(metadata.countryId);
  // Try to find the current focus in the tree.
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = searchParams.get("focus");
  let currentNode;
  const mobile = useMobile();

  if (focus && focus.startsWith("policyOutput")) {
    currentNode = { children: POLICY_OUTPUT_TREE };
  } else {
    currentNode = { children: [metadata.parameterTree] };
  }
  let breadcrumbs = [];
  try {
    let stem = "";
    for (let name of focus.split(".")) {
      stem += name;
      const fixedStem = stem;
      currentNode = currentNode.children.find(
        (node) => node.name === fixedStem
      );
      breadcrumbs.push({
        name: stem,
        label: currentNode.label,
      });
      stem += ".";
    }
  } catch (e) {
    currentNode = null;
  }

  return (
    <ResultsPanel>
      <h3>Policy parameter selection</h3>
      <h5>Build a tax-benefit reform by selecting parameters from the menu items below. Then when you&apos;re ready, click <i>Calculate economic impact</i> on the right to see how your reform would affect the economy.</h5>
      <Divider />
      {breadcrumbs.map((breadcrumb, i) => (
        <h5 
        onClick={() => {
          let newSearch = copySearchParams(searchParams);
          newSearch.set("focus", breadcrumb.name);
          setSearchParams(newSearch);
        }}
        key={breadcrumb.name} 
        style={{paddingLeft: i * 15, cursor: "pointer"}}>{(i > 0) && <>&#x2514;</>}  {capitalize(breadcrumb.label)}</h5>
      )
      )}
      <div
        style={{
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: mobile ? "center" : "left",
        }}
      >
        {children
          .filter((child) => !child.name.includes("pycache"))
          .map((child) => (
            <motion.div
              key={child.name}
              style={{
                width: mobile ? 100 : 150,
                height: mobile ? 100 : 100,
                backgroundColor: style.colors.LIGHT_GRAY,
                margin: 10,
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05, backgroundColor: style.colors.DARK_GRAY, color: "white" }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                let newSearch = copySearchParams(searchParams);
                newSearch.set("focus", child.name);
                setSearchParams(newSearch);
              }}
            >
              <h6 style={{ textAlign: "center", color: "inherit" }}>{capitalize(child.label)}</h6>
            </motion.div>
          ))}
      </div>
    </ResultsPanel>
  );
}
