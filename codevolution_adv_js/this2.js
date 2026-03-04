class Test {
  value = 10;

  normal() {
    setTimeout(function () {
      console.log(this.value);
    }, 0);
  }

  arrow() {
    setTimeout(() => {
      console.log(this.value);
    }, 0);
  }
}

const t = new Test();

t.normal();
t.arrow();