
## Documentation

imgm is an **image map game maker**. It allows you to create simple point and click games that use the html image map technology.

Here is a basic example of a game made with imgm : [The Pink Panther](https://leonlenclos.itch.io/pinkpanther)

An imgm game contains **scenes**, each scene is an image. On that image you define **gates**, gates are regions of the image that take the player to another scene when he click on it.

imgm does not helps you creating your game's images. Before making an imgm game, you must first gather pictures, drawings, screenshots or any images. The ideal size for images is 800x600 but imgm lets you crop and resize images when you import them.

imgm export a game as an easy-to-share single html file. An imgm game contains only html, css and image data (no javscript).

### imgm window layout

The imgm window is divided into three parts. from top to bottom :
- The frame
- The tools panel
- The status bar

#### The frame

The frame is a rectangle which is the size of the game (800x600 px). It is used to edit and preview the game.

#### The tools panel

The tools panel contain buttons and other inputs that are used to modify the game and navigate between imgm modes.

#### The status bar

The status bar contain information about imgm state :
- mode: In which mode is imgm
- scene: What is the current selected scene
- mood: How does imgm feel

### Modes

imgm has 6 modes :
- home
- import image
- edit scene
- edit gate
- play game

Each mode uses the frame differently and has its own tools in the tool panel.

#### Home

From **home** you can start a new game or continue a previously started game.

#### Import Image

**import image**  mode allows you to import an image for the current scene.

You can crop the image by moving it on the frame and resize it in the tools panel.

When you're done, click **Ok**.

#### Edit Scene

**edit scene**  mode allows you to navigate through the different scenes

From this mode you can also add a gate (edit gate mode) change the scene image (import image mode) and play the game (play game mode), if the scene already contain gates, you can edit them by clicking on them on the frame.

#### Edit Gate

In the **edit gate** mode, you can define the region of the image that corresponds to the current gate. To do this, click on the frame, each click adds a point to the gate polygon.

If you are not satisfied, you can reset the polygon. You can also completely remove the gate.

Select the scene to which the gate leads and when you're done, click **Ok**.

#### Play Game

The **play game** mode allows you to test and export your game.

### Mood

The mood of imgm is displayed in the status bar, it is important to keep imgm happy. To make him feel good, pet him by moving the mouse.

### Autosaving

imgm use local storage to save the project every ~ 10 seconds.

## Related tools

imgm is not what you're looking for ?

- You just want a tool to create html image maps ? try this : [Online Image Map Editor](http://maschek.hu/imagemap/imgmap/)
- You want an easier and funnier way to make point and click games ? try that : [flickgame](http://www.flickgame.org)

## Author/Source/License

imgm was made by [Léon](http://leonlenclos.net) for [The Tool Jam](https://itch.io/jam/the-tool-jam) in 2021.

Made with [p5.js](https://p5js.org), [p5.collide2D](https://github.com/bmoren/p5.collide2D) and [p5.SceneManager](https://github.com/mveteanu/p5.SceneManager) 

imgm is free (MIT) and open source. [github](https://github.com/LeonLenclos/imgm)
