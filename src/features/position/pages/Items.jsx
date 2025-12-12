import React from "react";
import ItemsTable from "../components/items/ItemsTable";


const Items = () => {


  return (
    <div className="space-y-5">
      <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Plantilla/Items</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Items</p>
      </div>

      <ItemsTable />
      
    </div>
  );
};

export default Items;
