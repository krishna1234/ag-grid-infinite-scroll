import React, { useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { InfiniteRowModelModule, ValidationModule } from "ag-grid-community";
import { fetchUserData } from "../services/api";

// Register the InfiniteRowModelModule
ModuleRegistry.registerModules([InfiniteRowModelModule, ValidationModule]);

const InfiniteScrollGrid = () => {
    const limit = 10;

    // Define column definitions
    const [columnDefs] = useState([
        { field: "id", headerName: "ID", sortable: true },
        { field: "name", headerName: "Name", sortable: true },
        { field: "username", headerName: "Username", sortable: true },
        { field: "email", headerName: "Email", sortable: true },
        { field: "city", headerName: "City", sortable: true },
    ]);
    const [loading, setLoading] = useState(false);

    const onGridReady = useCallback((params) => {
        const dataSource = {
            rowCount: undefined, // Unknown total row count for infinite scroll
            getRows: async (params) => {
                const { startRow, endRow } = params;
                const currentPage = Math.floor(startRow / limit) + 1;

                try {
                    setLoading(true);
                    const data = await fetchUserData(currentPage, limit);
                    const rows = data.map((item) => ({
                        id: item.id,
                        name: item.name,
                        username: item.username,
                        email: item.email,
                        city: item.address?.city || "N/A",
                    }));

                    const lastRow =
                        rows.length < limit
                            ? startRow + rows.length
                            : undefined;
                    params.successCallback(rows, lastRow);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    params.failCallback();
                    setLoading(false);
                }
            },
        };

        params.api.setGridOption("datasource", dataSource); // Correct method to set the datasource
    }, []);

    return (
        <div
            className="ag-theme-alpine"
            style={{
                height: 500,
                width: "100%",
            }}
        >
            <AgGridReact
                columnDefs={columnDefs}
                loading={loading}
                rowModelType="infinite"
                cacheBlockSize={limit}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default InfiniteScrollGrid;
