HTMLSelectElement.prototype.autocompletejf = function (prop) {
  prop = prop || {};
  const element = this;
  let newElement = null;
  let divULID = "";
  let mouseInParent = false;
  let valueSelected;
  const elementParent = $(element).parent();
  element.listOptions = [];
  element.newGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  };
  element.hideSelect = function () {
    $(element).hide();
  };
  element.getOptionsInObject = function () {
    var listOptions = this.listOptions;
    let options = $(this).find("option") || [];
    if (options.length <= 0) console.error("No hay opciones");
    $.each(options, function (index, option) {
      let value = option.value;
      let text = option.innerHTML;
      listOptions.push({ value: value, text: text });
    });
    return options;
  };
  element.mouseDownDiv = function () {
    mouseInParent = true;
  };
  element.mouseOutDiv = function () {
    mouseInParent = false;
  };
  element.generateDiv = function () {
    var div = $(`#${divULID}`).get(0) || null;
    if (div === null) {
      div = document.createElement("DIV");
      div.id = divULID;
      div.style.maxHeight = "300px";
      div.style.overflow = "auto";
      div.style.position = "relative";
      div.style.width = `${newElement.clientWidth}px`;
      $("body").append(div);
      div.style.top = `${($(newElement).offset().top - $(div).offset().top) + newElement.offsetHeight}px`;
      div.style.left = `${$(newElement).offset().left}px`;
    }
  };
  element.destroy = function () {
    $(`#${divULID}`).remove();
  };
  element.mouseOverAndOut = function () {
    $(event.target).toggleClass("active");
  };
  element.click = function () {
    newElement.value = $(event.target).html();
    element.value = $(event.target).attr("data-value");
    if (typeof prop.onchange === "function" && valueSelected !== element.value)
      prop.onchange();
    valueSelected = $(element).find("option:selected").val();
    element.destroy();
  };
  element.generateULWithOptions = function (list) {
    var div = $(`#${divULID}`);
    $(div).empty();
    var ul = document.createElement("UL");
    ul.className = "list-group";
    $.each(list, function (index, option) {
      $("<li/>", {
        class: "list-group-item p-1",
        ["data-value"]: option.value
      })
        .css("cursor", "pointer")
        .on("mouseover mouseout", element.mouseOverAndOut)
        .on("mouseover", element.mouseDownDiv)
        .on("mouseout", element.mouseOutDiv)
        .on("click", element.click)
        .append(option.text)
        .appendTo(ul);
    });
    div.append(ul);
  };
  element.filter = function () {
    var optionFilter = [];
    $.each(this.listOptions, function (index, option) {
      if (option.text.toLowerCase().indexOf(newElement.value.toLowerCase().trim()) > -1)
        optionFilter.push(option);
    });
    return optionFilter;
  };
  element.keyUp = function () {
    var object = element.filter();
    element.generateDiv();
    element.generateULWithOptions(object);
  };
  element.generateInput = function () {
    $(`#${($(this).attr("id") || "id")}_autocompletejf`).remove();
    var input = $("<input/>", {
      id: `${($(this).attr("id") || "id")}_autocompletejf`,
      class: 'form-control',
      ["data-autocompletejf"]: true,
      placeholder: prop.placeholder ? $(element).find("option:selected").html() : ""
    })
      .attr("autocomplete", "off")
      .on("focus", element.keyUp)
      .on("blur", function () {
        if (!mouseInParent)
          element.destroy();
      })
      .appendTo(elementParent);
    newElement = input.get(0);
    $(newElement).on("keyup", element.keyUp);
  };
  element.start = function () {
    divULID = element.newGuid();
    element.hideSelect();
    element.getOptionsInObject();
    element.generateInput();
  };
  element.start();
};