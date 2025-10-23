import { IPermission } from '@/schemas/PermissionSchema';
import clsx from 'clsx';
import React from 'react'

export enum Align
{
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}

export interface IColumn
{
    id: number | string,
    title: string,
    isSortable?: boolean,
    filterable?: boolean,
    styles?: StyleConfig,
    width?: string | number;
}

export interface StyleConfig
{
    headerCellBgColor?: string;
    bodyCellBgColor?: string;
    headerCellFontWeight?: string;
    bodyCellFontWeight?: string;
    textAlign?: Align;
    headerCellTextColor?: string
    bodyCellTextColor?: string;
    headerCellTextAlign?: string
    bodyCellTextAlign?: string
    headerCellPadding?: string
    rowCellPadding?: string
}

export interface ITable
{
    data: IPermission[],
    columns: IColumn[],
    alternateColors?: string[]

}
const Tbl = ({ data, columns, alternateColors }: ITable) =>
{
    return (
        <table className="min-w-full text-sm border-collapse">
            <thead className='bg-primary text-white '>
                <tr >
                    {columns.map((col) => (
                        <th key={col.id} className={clsx(
                            'select-none',
                            col.styles?.headerCellPadding ? col.styles?.headerCellPadding : 'px-4 py-3',
                            col.isSortable ? 'cursor-pointer' : 'default',
                            'uppercase text-xs border-b border-gray-200',
                            col.styles?.headerCellBgColor ? col.styles?.headerCellBgColor : 'bg-gray-100',
                            col.styles?.headerCellTextColor ? col.styles?.headerCellTextColor : 'text-gray-800',
                            col.styles?.headerCellFontWeight ? col.styles?.headerCellFontWeight : 'font-semibold',
                            col.styles?.headerCellTextAlign === Align.LEFT ? 'text-center' : col.styles?.headerCellTextAlign === Align.RIGHT
                                ? 'text-right'
                                : 'text-left')}
                            style={{ width: col.width || `${100 / columns.length}%` }}>{col.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((dataRow, rowIndex) =>
                (
                    <tr key={rowIndex} className={clsx(
                        (alternateColors && alternateColors.length > 1) && (rowIndex % 2 === 1 ? alternateColors[0] : alternateColors[1]),
                        'hover:bg-gray-100 transition')}>
                        {columns.map((item, colIndex) =>
                        (
                            <td key={colIndex} className={clsx(
                                item?.styles?.rowCellPadding ? item.styles.rowCellPadding : 'p-4 py-3', 'border-b border-gray-100',
                                item.styles?.bodyCellTextColor ?? 'text-gray-700',
                                item.styles?.bodyCellBgColor ?? 'text-gray-700',
                                item.styles?.bodyCellFontWeight ?? 'font-normal',
                                item.styles?.textAlign === Align.CENTER ? 'text-center'
                                    : item.styles?.textAlign === Align.RIGHT
                                        ? 'text-right'
                                        : 'text-left'

                            )}
                            >{dataRow[item.title as keyof typeof dataRow]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Tbl