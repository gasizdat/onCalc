//alert("cui.js");

var mem = new Array();
var _in = "in";
var _out = "out";
var _m1Marker = "m1_marker";
var _hypMarker = "hyp_marker";
var _invMarker = "inv_marker";
var _helpMarker = "help_marker";

function setNeedClear()
{
  var output = document.getElementById(_out);
  output.needClear = true;
}

function setNeedHelp()
{
  var output = document.getElementById(_out);
  output.needHelp = true;
  setVisible(_helpMarker, output.needHelp);
}

function setNeedHyp()
{
  var output = document.getElementById(_out);
  output.needHyp = true;
  setVisible(_hypMarker, output.needHyp);
}

function getNeedHyp()
{
  var output = document.getElementById(_out);
  var ret = !!output.needHyp;
  output.needHyp = false;
  setVisible(_hypMarker, output.needHyp);
  return ret;
}

function setNeedInv()
{
  var output = document.getElementById(_out);
  output.needInv = true;
  setVisible(_invMarker, output.needInv);
}

function getNeedInv()
{
  var output = document.getElementById(_out);
  var ret = !!output.needInv;
  output.needInv = false;
  setVisible(_invMarker, output.needInv);
  return ret;
}

function help(el)
{
  var output = document.getElementById(_out);
  if(output.needHelp)
  {
    output.needHelp = false;
    alert(el.attributes["hint"].value);
    setVisible(_helpMarker, output.needHelp);
    return true;
  }
  return false;
}

function getOutputString()
{
  var output = document.getElementById(_out);
  if(output.needClear)
    return "";
  else
    return output.expression ? output.expression : "0";
}

function setDigits(digits)
{
  var output = document.getElementById(_out);
  output.digits = digits;
  setOutputString(output.expression);
}

function setTP(p)
{
  var output = document.getElementById(_out);
  setTrigonometryPrecision(p);
  setOutputString(output.expression);
}

function setOutputString(expression)
{
  var output = document.getElementById(_out);
  var display_str;
  if(expression instanceof Complex)
  {
    output.expression = expression;
    display_str = output.innerHTML + "<br>______________________________<br>";
    if(typeof(output.digits) == "number") 
      display_str += expression.toFixedString(output.digits);
    else
      display_str += expression.toString();
  }
  else
    display_str = output.expression = expression;
  output.innerHTML = display_str.replace(/(\d|\.|\}|\))[i|e|\+|\-|\*|\/]/ig, 	function (str, p1, p2, offset, s)
	{
	  var c = str.charAt(1);
    switch(c)
    {
      case 'e':
      case 'i':
        return str.replace(c, "<b style='color: red'>" + c + "</b>");
      default:
        return str.replace(c, "<br><b style='color: white'>" + c + "</b><br>");
    }
	});
  output.scrollTop = 100000000;
  output.needClear = null;
}

function getFromMem(index)
{
  if(null === mem[index])
    return "0";
  else
    return mem[index].toString();
}

function resetMem(index)
{
  mem[index] = null;
}

function addToMem(value, index)
{
  if(null == mem[index])
    mem[index] = value;
  else
    mem[index] = addComplex(mem[index], value);
}

function backSpace(val)
{
  var ret;
  if(lastChar(val) != ')')
  {
    ret = val.substring(0, val.length-1);
  }
  else
  {
    var pc = 0
    for(var i = val.length - 1; i >= 0; i--)
    {
      var c = val.charAt(i);
      if(c == ')')
        pc++;
      else if(c == '(')
        pc--;
      if(pc == 0)
      {
        var j = i;
        while(j > 0 && !isDigit(c))
        {
          j--;
          c = val.charAt(j);
        }
        ret = val.substring(0, j) + val.substring(i + 1, val.length - 1);
        break;
      }
    }
  }
  if(ret.length == 0)
    ret = "0";
  return ret;
}

function onSafeClick(el)
{
  try
  {
    onClick(el);
  }
  catch(ex)
  {
    showError(ex);
  }
}

function onEnterMode(m)
{
  var output = document.getElementById(_out);
  var input = document.getElementById(_in);
  if(m == true)
	{
	  input.value = getOutputString();
    setVisible(input.parentNode, true);	
    setVisible(output, false);
		input.parentNode.Width = output.clientWidth;
	}
	else
	{
	  setOutputString(input.value);
    setVisible(output, true);	
	  setVisible(input.parentNode, false);	
	}
}

function onEnter(event)
{
  if(event.type="keydown")
	{
	  switch(event.keyCode)
		{
		  case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
			  return true;
		  case 13:
			  onEnterMode(false);
			  break;
			default:
			  event.returnValue = false;
        event.stopPropagation();
	      event.preventDefault();
			  return false;
		}
	}
}

function onClick(el)
{
  if(help(el))
    return;
  var n = el.value.replace(/\s/g,"").toLowerCase();
  var div = getOutputString();
  switch(n)
  {
    case 'c':
      div = "0";
      break;
    case '.':
      if(!hasPoint(div, n) && 
         !hasPoint(div, 'e'))
      {
        if(isDigit(lastChar(div)))
          div += getSeparator();
        else
          div += "0" + getSeparator();
      }
      break;
    case '-':
      if(div == "0")
        div = n;
      else if(lastChar(div) != n)
        div += n;
      break;
    case '+':
    case '*':
    case '/':
      var c = lastChar(div);
      if(isDigit(c) || c == '}' || c == ')')
        div += n;
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      if(div == "0")
        div = "";
      div += n.toString();
      break;
    case "exp":
      if(div != "0" && 
          isDigit(lastChar(div)) &&
          !hasPoint(div, n))
        div += "e";
      break;
    case 'i':
      if(!hasPoint(div, n))
      {
        if(isDigit(lastChar(div)))
          div += "i";
        else
          div += "0i";
      }
      break;
    case "mc":
      resetMem("m1");
      return;
    case "mr":
      var value = getFromMem("m1");
      if(value)
      {
         if(!isDigit(lastChar(div)))
           div += value;
         else
           div = value;
         setNeedClear();
      }
      break;
    case "m+":
      addToMem(evalComplex(div), "m1");
      return;
    case "test":
      eval(document.getElementById("test").value);
      return;
    case "←":
      div = backSpace(div);
      break;
    case "in":
      var input = document.createElement("input");
      output.appendChild(input);
      break;
    case '?':
      setNeedHelp();
      return;
    case '=':
      div = evalComplex(div);
      break;
    case 'r':
      history.go(0);
      return;
    case "hyp":
      setNeedHyp();
      return;
    case "inv":
      setNeedInv();
      return;
    case "sin":
      div = (getNeedInv() ? "arc" : "") + "sin" + (getNeedHyp() ? "h" : "") + "(" + div + ")";
      break;
    case "cos":
      div = (getNeedInv() ? "arc" : "") + "cos" + (getNeedHyp() ? "h" : "") + "(" + div + ")";
      break;
    case "tan":
      div = (getNeedInv() ? "arc" : "") + "tan" + (getNeedHyp() ? "h" : "") + "(" + div + ")";
      break;
    case "ln":
      div ="ln(" + div + ")";
      break;
    case "1/x":
      div = "1/" + div + "";
      break;
    default:
      alert("not implemented: " + n.toString());
      break;
  }	
  if(getNeedHyp())
    alert(n + " don't compatible with HYP. HYP will be escaped!");
  setOutputString(div);
}