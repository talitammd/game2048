import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate()
    const [box, setBox] = useState<number[][]>(Array.from({ length: 4 }, () => Array(4).fill(0)))
    const copy2DArray = useCallback(arr => {
        return arr.map((row: number[]) => [...row])
    }, [])
    const createBoxIndex = useCallback((box) => {
        const arr = copy2DArray(box);
        const nullArr = checkNull(arr)
        const index = Math.floor(Math.random() * nullArr.length)
        if (nullArr.length) {
            const [row, col] = nullArr[index]
            arr[row][col] = 1
        }
        return arr

    }, [])
    const checkNull = useCallback((arr: number[][]) => {
        const res: number[][] = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] === 0) {
                    res.push([i, j])
                }
            }
        }
        if (res.length === 0) {
            navigate('/fail')
        }
        return res
    }, [])

    const moveLeft = useCallback(() => {
        setBox(arr => {
            let newArr = arr.map(row => {
                let filteredRow = row.filter(item => item !== 0); // 移除所有0
                if (filteredRow.length === 0) {
                    return [0, 0, 0, 0]
                }
                if (filteredRow.length === 1) {
                    return [...filteredRow, ...Array(3).fill(0)]
                }
                for (let i = 0; i < filteredRow.length - 1; i++) {
                    if (filteredRow[i] === filteredRow[i + 1]) {
                        filteredRow[i] <<= 1;
                        filteredRow[i + 1] = 0;
                    }
                }
                return [...filteredRow, ...Array(4 - filteredRow.length).fill(0)]; // 补齐长度为4，未占用的格子设为0
            });
            return createBoxIndex(newArr);
        });
    }, []);

    const moveRight = useCallback(() => { }, [])
    const moveUp = useCallback(() => { }, [])
    const moveDown = useCallback(() => { }, [])
    const handleKeydown = useCallback((event) => {
        event.preventDefault()
        try {
            switch (event.key) {
                case 'ArrowLeft':
                    moveLeft()
                    break
                case 'ArrowRight':
                    moveRight()
                    break
                case 'ArrowUp':
                    moveUp()
                    break
                case 'ArrowDown':
                    moveDown()
                    break
                default:
                    break
            }

        } catch (e) {
            throw new Error("error")
        }
    }, [moveLeft, moveRight, moveUp, moveDown])
    // useEffect(() => {
    //     // 仅当 box 状态变化后调用 createBox
    //     createBox();
    // }, [box]); // 依赖于 box 的变化


    useEffect(() => {
        setBox(createBoxIndex(box))
        // 添加事件监听器      
        document.addEventListener('keydown', handleKeydown);

        // 返回一个函数来清理资源（移除事件监听器）  
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [])


    return <div className='box-outside'>
        <div className='box-inside'>

            {box.map(row => row.map(item => <div className='block-box' style={{ backgroundColor: COLOR[item] }}>{item ? 2 << (item - 1) : null}</div>))}
        </div>
    </div>
}