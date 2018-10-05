function Progress() {

  this.onFail      = null;
  this.onProgress  = null;
  this.onFinishAll = null;
  this.needDone    = 0;

  this.oneDone = function() {
    this.needDone--;
    if (this.needDone <=0) {
      this.triggerFinishAll();
    }
  }

  this.triggerProgress = function(xhr) {
    if (!this.onProgress) return;
    this.onProgress(
      xhr.currentTarget.responseURL, 
      xhr.loaded / xhr.total * 100 
    );
  }

  this.triggerFinishAll = function() {
    if (!this.onFinishAll) return;
    this.onFinishAll();
  }

  this.triggerFail = function(error) {
    if (!this.onFail) return;
    this.onFail(error);
  }
}


export { Progress }
