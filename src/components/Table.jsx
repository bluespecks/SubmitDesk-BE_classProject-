import React from 'react';
import '../styles/components/Table.css';

const Table = ({ columns, data, keyExtractor, renderEmpty, className = '' }) => {
    if (!data || data.length === 0) {
        return renderEmpty ? renderEmpty() : <div className="table-empty">No data available</div>;
    }

    return (
        <div className={`table-container ${className}`}>
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width, textAlign: col.align || 'left' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={keyExtractor ? keyExtractor(item) : rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{ textAlign: col.align || 'left' }}>
                                    {col.render ? col.render(item) : item[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
