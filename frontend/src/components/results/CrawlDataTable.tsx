import React from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { CrawlResult } from "../../store/crawl/crawlSlice.ts";
import type { TableStyles } from "react-data-table-component";

interface Props {
  data: CrawlResult[];
  title: string;
}

export const CrawlDataTable: React.FC<Props> = ({ data, title }) => {
  const columns: TableColumn<CrawlResult>[] = [
    {
      name: "Domain",
      selector: (row) => row.domain,
      cell: (row) => <div className="w-full text-center">{row.domain}</div>,
      sortable: true,
    },
    {
      name: "Pages Checked",
      selector: (row) => row.pages_checked,
      cell: (row) => (
        <div className="w-full text-center">{row.pages_checked}</div>
      ),
      sortable: true,
    },
    {
      name: "Available Pages",
      selector: (row) => row.available_pages,
      cell: (row) => (
        <div className="w-full text-center">{row.available_pages}</div>
      ),
      sortable: true,
    },
    {
      name: "Streams Detected",
      selector: (row) => row.streaming_count,
      cell: (row) => (
        <div className="w-full text-center">
          {row.streaming_count}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Ads Detected",
      selector: (row) => row.ads_count,
      cell: (row) => (
        <div className="w-full text-center">
          {row.ads_count}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Errors",
      cell: (row) => (
        <div className="w-full text-center">
          {row.errors.length > 0 ? row.errors.join(", ") : "-"}
        </div>
      ),
    },
  ];

  //  Internally, customStyles will deep merges your customStyles with the default styling.
  const customStyles: TableStyles = {
    headCells: {
      style: {
        justifyContent: "center", // centers the header text
        textAlign: "center",
        padding: "0px",
      },
    },
  };
  return (
    <div className="flex flex-col justify-center items-center shadow rounded-xl p-2">
              <h4 className="text-center mb-4">
        {title}
      </h4>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
        />
    </div>
  );
};
