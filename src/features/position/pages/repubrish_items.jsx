import React from "react";
import RepubrishTable from "../components/items/RepubrishTable";


const repubrish_items = () => {


  return (
    <div className="space-y-5">
      <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">Repubrish Items</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Manage and Review Repubrish Items</p>
      </div>

      <RepubrishTable />
      
    </div>
  );
};

export default repubrish_items;
