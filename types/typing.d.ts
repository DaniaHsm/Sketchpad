// typing def file that allows to have global access to types

type Draw = {
    ctx: CanvasRenderingContext2D 
    currentPoint: Point 
    prevPoint: Point | null
}

type Point = { x: number, y: number } //type of the point