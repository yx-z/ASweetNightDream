/*:
* @author 日月星辰
* @plugindesc 屏幕截图 & 模糊 工具
* @help
* 1. 在事件中显示图片 snap 即可获取全屏截图
* 2. 在事件中显示图片 blur 即可获取全屏截图并模糊
* 3. 在事件中使用插件指令： blurPart x y w h opacity id
*    即可获取屏幕区域(x, y, w, h)的截图并模糊，设置透明度opacity并保存至id号图片
*
* @param blurLevel
* @desc 本插件的模糊等级，越高越糊。推荐范围[1,5]，默认1
* @default 1
*/

(function() {
    var params = PluginManager.parameters('SnapBlur');
    var blurLevel = Number(params['blurLevel'] || 1);

    var x;
    var y;
    var w;
    var h;

    Sprite_Picture.prototype.loadBitmap = function() {
      if (this._pictureName === "snap") {
        this.bitmap = SceneManager.snap();
      } else if (this._pictureName === "blur" ){
        this.bitmap = SceneManager.snap();
        for (var i = 0; i < blurLevel; i++)
          this.bitmap.blur();
      } else if (this._pictureName === "blurPart") {
        this.bitmap = SceneManager.snapArea(x, y, w, h);
        for (var i = 0; i < blurLevel; i++)
          this.bitmap.blur();
      } else {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
      }
    };

    var alias_command = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
      if (command === 'blurPart') {
        x = parseInt(args[0]);
        y = parseInt(args[1]);
        w = parseInt(args[2]);
        h = parseInt(args[3]);

        $gameScreen.showPicture(parseInt(args[5]), "blurPart" ,0, x, y, 100, 100, parseInt(args[4]), 0);
      }
      alias_command.call(this, command, args);
      return true;
    };

    SceneManager.snapArea = function(x, y, w, h) {
        return Bitmap.snapArea(this._scene, x, y, w, h);
    };

    Bitmap.snapArea = function(stage, x, y, w, h) {
      var width = Graphics.width;
      var height = Graphics.height;
      var bitmap = new Bitmap(w, h);
      var context = bitmap._context;
      var renderTexture = new PIXI.RenderTexture(width, height);

      if (stage) {
          renderTexture.render(stage);
          stage.worldTransform.identity();
      }

      if (Graphics.isWebGL()) {
          var gl =  renderTexture.renderer.gl;
          var webGLPixels = new Uint8Array(4 * width * height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture.textureBuffer.frameBuffer);
          gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          var canvasData = context.getImageData(0, 0, width, height);
          canvasData.data.set(webGLPixels);
          context.putImageData(canvasData, 0, 0);
      } else {
          context.drawImage(renderTexture.textureBuffer.canvas, -x, -y);
      }

      bitmap._setDirty();
      return bitmap;
    }
})();
