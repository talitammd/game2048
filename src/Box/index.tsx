import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

enum COLOR {
    "rgb(235, 235, 235)",
    "rgb(247, 244, 217)",
    "rgb(254, 247, 186)",
    "rgb(250, 238, 130)",
    "rgb(252, 235, 81) ",
    "rgb(252, 226, 81) ",
    "rgb(252, 218, 23) ",
    "rgb(251, 204, 65) ",
    "rgb(255, 198, 27) ",
    "rgb(247, 138, 30) ",
}
export default function Box() {
    const navigate = useNavigate();
    const [box, setBox] = useState<number[][]>(
        Array.from({ length: 4 }, () => Array(4).fill(0))
    );
    const copy2DArray = useCallback((arr) => {
        return arr.map((row: number[]) => [...row]);
    }, []);
    const matrix = useCallback((arr: number[][]) => {
        let matrix = arr.map((_, index) => arr.map((row) => row[index]));
        return matrix;
    }, []);
    const createBoxIndex = useCallback((box) => {
        const arr = copy2DArray(box);
        const nullArr = checkNull(arr);
        const index = Math.floor(Math.random() * nullArr.length);
        if (nullArr.length) {
            const [row, col] = nullArr[index];
            arr[row][col] = 1;
        }
        return arr;
    }, []);
    const checkNull = useCallback((arr: number[][]) => {
        const res: number[][] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] === 0) {
                    res.push([i, j]);
                }
                if (arr[i][j] === 9) {
                    navigate("/success");
                }
            }
        }
        if (res.length === 0) {
            navigate("/fail");
        }
        return res;
    }, []);

    const moveLeft = useCallback(
        (arr: number[][]) =>
            arr.map((row) => {
                let filteredRow = row.filter((item) => item !== 0); // 移除所有0
                if (filteredRow.length === 0) {
                    return [0, 0, 0, 0];
                }
                if (filteredRow.length === 1) {
                    return [...filteredRow, ...Array(3).fill(0)];
                }
                for (let i = 0; i < filteredRow.length - 1; i++) {
                    if (filteredRow[i] === filteredRow[i + 1]) {
                        filteredRow[i] += 1;
                        filteredRow[i + 1] = 0;
                    }
                }
                // 合并完之后，会产生0值，需要重新压缩
                filteredRow = filteredRow.filter((item) => item !== 0);
                return [...filteredRow, ...Array(4 - filteredRow.length).fill(0)]; // 补齐长度为4，未占用的格子设为0
            }),
        []
    );

    const moveRight = useCallback(
        (arr: number[][]) =>
            arr.map((row) => {
                let filteredRow = row.filter((item) => item !== 0); // 移除所有0
                if (filteredRow.length === 0) {
                    return [0, 0, 0, 0];
                }
                if (filteredRow.length === 1) {
                    return [...Array(3).fill(0), ...filteredRow];
                }
                // 只合并一次，所以从后向前遍历，如果从前往后遍历的话，会把合并的数再合并
                for (let i = filteredRow.length - 1; i > 0; i--) {
                    if (filteredRow[i] === filteredRow[i - 1]) {
                        filteredRow[i] += 1;
                        filteredRow[i - 1] = 0;
                    }
                }
                // 合并完之后，会产生0值，需要重新压缩
                filteredRow = filteredRow.filter((item) => item !== 0);
                return [...Array(4 - filteredRow.length).fill(0), ...filteredRow]; // 补齐长度为4，未占用的格子设为0
            }),
        []
    );

    const handleKeydown = useCallback(
        (event) => {
            event.preventDefault();
            try {
                switch (event.key) {
                    case "ArrowLeft":
                        setBox((arr) => createBoxIndex(moveLeft(arr)));
                        break;
                    case "ArrowRight":
                        setBox((arr) => createBoxIndex(moveRight(arr)));
                        break;
                    case "ArrowUp":
                        setBox(arr => {
                            return createBoxIndex(matrix(moveLeft(matrix(arr))));
                        })
                        break;
                    case "ArrowDown":
                        setBox(arr => {
                            return createBoxIndex(matrix(moveRight(matrix(arr))));
                        })
                        break;
                    default:
                        break;
                }
            } catch (e) {
                throw new Error("error");
            }
        },
        [moveLeft, moveRight, matrix, createBoxIndex]
    );

    useEffect(() => {
        setBox(createBoxIndex(box));
        // 添加事件监听器
        document.addEventListener("keydown", handleKeydown);

        // 返回一个函数来清理资源（移除事件监听器）
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);
    return (
        <div className="box-outside">
            <div className="box-inside">
                {box.map((row,rowIndex) =>
                    row.map((item,colIndex) => (
                        <div className="block-box" key={`${rowIndex}-${colIndex}`} style={{ backgroundColor: COLOR[item] }}>
                            {item ? 2 << (item - 1) : null}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
