//alert("chlp.js")

function lastChar(txt)
{
  if(txt.length > 0)
    return txt.charAt(txt.length - 1);
  else
    return '0';
}
function isDigit(txt)
{
  switch(txt)
  {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      return true;
    default:
      return false;
  }
}
function hasPoint(txt, point)
{
  var ret = false;
  for(var i = 0; i < txt.length; i++)
  {
    switch(txt[i])
    {
      case '-':
        if(i != 0 && txt[i-1] != 'e' && txt[i-1] != 'i')
          ret = false;
        break;
      case '+':
      case '*':
      case '/':
      case 'i':
        ret = false;
      default:
        if(txt[i] == point)
          ret = true;
        break;
    }
  }
  return ret;
}

function showError(err)
{
  alert("Error ocure: " + err.toString());
}

function setVisible(el, vizibility)
{
  try
  {
    var disp = vizibility ? "" : "none";
    switch(typeof(el))
    {
      case "string":
        document.getElementById(el).style.display = disp;
        break;
      default:
        el.style.display = disp;
        break;
    }
  }
  catch(err)
  {
    showError(err);
  }
}