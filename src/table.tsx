/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { useTable, usePagination } from 'react-table'

export const Table: React.FC<any> = ({ columns, data }) => {
  // 配置
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )
  
    // Render
    return (
        <div>
          {/* <pre>
            <code>
              {JSON.stringify(
                {
                  pageIndex,
                  pageSize,
                  pageCount,
                  canNextPage,
                  canPreviousPage,
                },
                null,
                2
              )}
            </code>
          </pre> */}
          <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} style={{
                            background: 'aliceblue',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'solid 1px gray',
                            minWidth: '150px',
                        }}>{column.render('Header')}</th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return <td {...cell.getCellProps()} style={{
                                padding: '10px',
                                border: 'solid 1px gray',
                                background: 'papayawhip',
                            }}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                        )
                    })}
                </tbody>
                
            </table>

          <br />
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )
  }