function setup_drawing_tool(canvas, N) {

    console.log("Drawing Tool\nd : to remove the last point\nz : to remove everything\np : to print the points list");

    var pointer_folower = null
    var drawings = []
    var recorded_points = []

    const folowerstyle = get_piece_coloration();

    canvas.addEventListener('mousemove', function(event) {
        //console.log(event);

        const c = get_canvas_data(canvas);
        const mouse = {X : event.clientX - c.X, Y : event.clientY - c.Y};
        const grid_pos = get_nearest_grid_point(canvas, N, mouse.X, mouse.Y);
        
        if (pointer_folower != null) {
            pointer_folower.remove();
        }
        // pointer_folower = draw_point(canvas, N, 'p', grid_pos.X, grid_pos.Y, {fill : '#ff0000', r : '4'});
        refresh();
        pointer_folower = draw_grid_clip_polygon_from_barrycentre(canvas, N, 'folower', mouse.X, mouse.Y, POLYS[1], folowerstyle);
    
    });

    canvas.addEventListener('mousedown', function(event) {
        //console.log(event);
        const c = get_canvas_data(canvas);
        const mouse = {X : event.clientX - c.X, Y : event.clientY - c.Y};
        const grid_pos = get_nearest_grid_point(canvas, N, mouse.X, mouse.Y);

        point_alredy_at_index = recorded_points.findIndex(function(value) {
            return value[0] == grid_pos.X && value[1] == grid_pos.Y;
        });
        if (point_alredy_at_index == -1) {
            recorded_points.push([grid_pos.X, grid_pos.Y]);
        }

        refresh();
    });

    document.addEventListener('keypress', function(event) {
        if (event.key == 'd') {
            recorded_points.pop();
            refresh();
        }
        if (event.key == 'p') {
            let out = '';
            recorded_points.forEach(p => {
                out += `[${p[0]},${p[1]}], `;
            });
            console.log(`[${out.substring(0, out.length-2)}]`);
        }
        if (event.key == 'z') {
            drawings.forEach(function (element) {
                element.remove();
            });
            recorded_points = []
        }


    });
    
    function refresh() {
        console.log(drawings)
        drawings.forEach(function (element) {
            element.remove();
        });

        recorded_points.forEach(function (coord, i) {
            drawings.push(draw_point(canvas, N, `p${i}`, coord[0], coord[1], {fill : '#0000ff', r : 2}));
        });

        drawings.push(draw_polygon(canvas, N, 'poly', 0, 0, recorded_points, get_piece_coloration()));
    }
}
