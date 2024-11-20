import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Item, SortableList } from "./SortableList.tsx";

const items = [
  {
    id: "insurance_type",
    label: "Insurance Type",
  },
  {
    id: "referrer",
    label: "Referrer",
  },
  {
    id: "accounting",
    label: "Accounting",
  },
  {
    id: "birthdate",
    label: "Birthdate",
  },
  {
    id: "hospital_stay_type",
    label: "Hospital Stay Type",
  },
  {
    id: "import_identifier",
    label: "Import Identifier",
  },
  {
    id: "encounter_status",
    label: "Encounter Status",
  },
  {
    id: "encounter_external_id",
    label: "Encounter External ID",
  },
];

const onDrop = (items: Item[]) => {
  console.log("Items dropped", items);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ display: "flex" }}>
      <SortableList items={items} onDrop={onDrop} />
    </div>
  </StrictMode>
);
