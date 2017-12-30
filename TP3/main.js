//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}    

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 
             'MyGraphNode.js', 'MyGraphLeaf.js', 'MyInterface.js',
             'utils.js', 'primitives/MyTriangle.js', 'primitives/MyRectangle.js',
             'primitives/MySphere.js', 'primitives/MyCircle.js',
             'primitives/MyCaplessCylinder.js', 'primitives/MyCylinder.js',
             'primitives/MyPatch.js', 'animations/Animation.js', 
             'animations/LinearAnimation.js', 'animations/CircularAnimation.js',
             'animations/ComboAnimation.js', 'animations/BezierAnimation.js',
             'game/pieces/Piece.js', 'game/pieces/Worker.js', 'game/pieces/WhitePiece.js',
             'game/pieces/BlackPiece.js', 'game/BoardCell.js', 'game/Game.js',
             'game/Communication.js', "game/GameElements.js", 'SweetAlert2.js',
             'game/Alert.js', 'game/ObjectPool.js', 'game/Scoreboard.js',
             'animations/ArchAnimation.js', 'game/BoardHistory.js',
main=function()
{
    // Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);
    
    // XML's containing the different scenes
    // assumes files in subfolder "scenes", check MySceneGraph constructor
    var differentScenes = [
        "board.xml",
        "board2.xml"
    ];

    // create and load all the graphs, and associate them to the scene. 
    // Check console for loading errors
    var sceneGraphs = [];

    for (let i = 0; i < differentScenes.length; ++i)
        sceneGraphs.push(new MySceneGraph(differentScenes[i], myScene));
    
    // start
    app.run();
}

]);