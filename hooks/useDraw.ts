/*
Export custom hook that is just a function
**/

import { useEffect, useRef, useState } from "react"

// Define the type of the function (draw)   
export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw) => void) => { // drawing effect - hook runs function every render of the component (render : when the state changes on the page. This case mouse movement)
    
    const [mouseDown, setMouseDown] = useState(false) // state of the mouse, if mouse is down or not
    const canvasRef = useRef<HTMLCanvasElement>(null) // reference to the canvas element. Ref is similar to useState, persiste between renders but ref doesn't cause anything to re-update when it gets changed in here!!
    const prevPoint = useRef<null | Point>(null) // reference to the previous point of the mouse

    const onMouseDown = () => setMouseDown(true) // when mouse is down, set mouseDown to true

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

    useEffect(() => { // pass as an argument the function
        
        // handler is a function that takes an event as an argument every time we move the mouse
        // on mousemove, event takes coordinates of the mouse
        const handler = (e: MouseEvent) => {
            if (!mouseDown) return 
            const currentPoint = computePointsInCanvas(e) // get the current point of the mouse in the canvas and pass the e(vent)
            
            const ctx = canvasRef.current?.getContext('2d')
            if(!ctx || !currentPoint) return // if context or currentPoint doesn't exist, return

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current}) //using the function passed as an argument, draw the line
            prevPoint.current = currentPoint // set the previous point to the current point cuz current point will be the previous point in the next render

        }

        const computePointsInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current // reference to the canvas element
            if (!canvas) return // if canvas doesn't exist, return

            const rect = canvas.getBoundingClientRect()  // if canvas exists, get the rectangle of the canvas relative to the viewport
            const x = e.clientX - rect.left // get the x coordinate of the mouse : e.clientX is horizontal coordinate of the mouse viewport and rect.left is left pos of the canvas relative to the viewport
            const y = e.clientY - rect.top // get the y coordinate of the mouse

            return {x, y}
        }

        const mouseUpHandler = () => {
            setMouseDown(false) // when mouse is up, set mouseDown to false
            prevPoint.current = null 
        } 

        // Add event listener
        // ? : if this exists then we add event listener to it
        canvasRef.current?.addEventListener('mousemove', handler)
        window.addEventListener('mouseup', mouseUpHandler)

        // Remove event listener
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
 
    }, [onDraw]) // need to put into dependency array cuz we use it in the function

    return {canvasRef, onMouseDown, clear}
}

