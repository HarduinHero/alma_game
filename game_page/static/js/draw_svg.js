const SVGNS = "http://www.w3.org/2000/svg"

function create_canvas(id, w, h) {
    let new_svg = document.createElementNS(SVGNS,'svg');
    new_svg.id = id;
    new_svg.style.width = `${w}px`;
    new_svg.style.height = `${h}px`;
    let conteneur = document.getElementById("main_play_area");
    conteneur.appendChild(new_svg);
    return new_svg
}

function draw_line(canvas, id, x1, y1, x2, y2, attrs) {
    let new_line = document.createElementNS(SVGNS, 'line');
    new_line.id = id;
    new_line.setAttribute('x1', `${x1}px`);
    new_line.setAttribute('y1', `${y1}px`);
    new_line.setAttribute('x2', `${x2}px`);
    new_line.setAttribute('y2', `${y2}px`);
    for (const key in attrs) {
        const value = attrs[key];
        new_line.setAttribute(key, value);
    }
    canvas.appendChild(new_line);
    return new_line;
}

function draw_polygon(canvas, n, id, x, y, grid_points, attrs) {
    const c = get_canvas_data(canvas, n)
    let new_polygon = document.createElementNS(SVGNS, 'polygon');
    new_polygon.id = id;
    let points = '';
    grid_points.forEach(p => {
        points += `${(p[0]+x)*c.grid.CELL_WIDTH},${(p[1]+y)*c.grid.CELL_HEIGHT} `
    });
    new_polygon.setAttribute('points', `${points}px`);
    for (const key in attrs) {
        const value = attrs[key];
        new_polygon.setAttribute(key, value);
    }
    canvas.appendChild(new_polygon);
    return new_polygon;
}

function draw_grid_clip_polygon_from_barrycentre(canvas, n, id, x, y, grid_points, attrs) {
    
    const c = get_canvas_data(canvas, n)
    
    const shape_barry_local  = barycentre(grid_points);
    const origin_global_R    = [x-(shape_barry_local[0]*c.grid.CELL_WIDTH), y-(shape_barry_local[1]*c.grid.CELL_WIDTH)];
    const origin_global_N    = get_nearest_grid_point(canvas, n, origin_global_R[0], origin_global_R[1]);
    
    draw_polygon(canvas, n, id, origin_global_N.X, origin_global_N.Y, grid_points, attrs);
    
    console.log(c);
    console.log(x, y)
    console.log(shape_barry_local)
    console.log(c.grid.CELL_WIDTH*shape_barry_local.X);
    console.log(origin_global_R)
    console.log(origin_global_N);
}

function draw_point(canvas, n, id, x, y, attrs) {
    const c = get_canvas_data(canvas, n)
    let new_point = document.createElementNS(SVGNS, 'circle');
    new_point.id = id;
    new_point.setAttribute('cx', `${x*c.grid.CELL_WIDTH}px`);
    new_point.setAttribute('cy', `${y*c.grid.CELL_HEIGHT}px`);
    new_point.setAttribute('r',  `2px`);
    for (const key in attrs) {
        const value = attrs[key];
        new_point.setAttribute(key, value);
    }
    canvas.appendChild(new_point);
    return new_point;
}

function draw_grid(canvas, n) {
    const c = get_canvas_data(canvas, n)
    for(let i=0; i<n; i++) {
        draw_line(main_canvas, `vLine_${i}`, i*c.grid.CELL_WIDTH, 0, i*c.grid.CELL_WIDTH, c.HEIGHT, {'stroke' : 'lightgrey'});
        draw_line(main_canvas, `hLine_${i}`, 0, i*c.grid.CELL_HEIGHT, c.WIDTH, i*c.grid.CELL_HEIGHT, {'stroke' : 'lightgrey'});
    }
}

function get_canvas_data(canvas, n=null) {
    pos_data = canvas.getBoundingClientRect();
    if (n!==null) {
        grid = {'CELL_HEIGHT' : pos_data.height/n,
                'CELL_WIDTH'  : pos_data.width /n}
    } else {
        grid = null;
    }
    return {
        'grid'   : grid,
        'HEIGHT' : pos_data.height,
        'WIDTH'  : pos_data.width,
        'X'      : pos_data.x,
        'Y'      : pos_data.y
    };
}

function get_piece_coloration() {
    const PIECE_COLOR = [
        '#fe51ba',
        '#d7ff51',
        '#4afeff',
        '#72ff49',
        '#fdb54e',
        '#cb4fce',
        '#5b5ef2',
        '#fdea4f',
        '#fe504b',
        '#d459eb',
        '#fa8852',
        '#ff4c88',
        '#a750ff',
        '#74d38e',
    ];
    const PIECE_OUTLINE_COLOR = '#505050';
    return {
        fill : PIECE_COLOR[Math.round(Math.random()*(PIECE_COLOR.length))],
        stroke : PIECE_OUTLINE_COLOR
    };
}

function get_nearest_grid_point(canvas, n, x, y) {
    const c = get_canvas_data(canvas, n);
    let grid_max_X = null;
    let grid_max_Y = null;
    for(let i=0; i<=n; i++) {
        if (x <= (i*c.grid.CELL_WIDTH)  && grid_max_X == null) { grid_max_X = i; }
        if (y <= (i*c.grid.CELL_HEIGHT) && grid_max_Y == null) { grid_max_Y = i; }
        if (grid_max_X != null && grid_max_Y != null) { break; }
    }
    cell = [
        {p : {X : grid_max_X-1, Y : grid_max_Y-1}, d : dist([x, y], [(grid_max_X-1)*c.grid.CELL_WIDTH, (grid_max_Y-1)*c.grid.CELL_HEIGHT])},
        {p : {X : grid_max_X-1, Y : grid_max_Y},   d : dist([x, y], [(grid_max_X-1)*c.grid.CELL_WIDTH,  grid_max_Y*c.grid.CELL_HEIGHT])},
        {p : {X : grid_max_X,   Y : grid_max_Y-1}, d : dist([x, y], [grid_max_X*c.grid.CELL_WIDTH,     (grid_max_Y-1)*c.grid.CELL_HEIGHT])},
        {p : {X : grid_max_X,   Y : grid_max_Y},   d : dist([x, y], [grid_max_X*c.grid.CELL_WIDTH,      grid_max_Y*c.grid.CELL_HEIGHT])},
    ];
    nearest_point = cell.reduce(function (prev, curr) {
        return prev.d < curr.d ? prev : curr
    })
    return nearest_point.p
}

function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2))
}

function barycentre(points) {
    let sum_x = 0;
    let sum_y = 0;
    points.forEach(function(p) {
        sum_x += p[0];
        sum_y += p[1];
    });
    return [sum_x/points.length, sum_y/points.length]
}