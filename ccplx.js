//alert("ccplx.js");

var _trigonometryPrecision = 15;

function getTrigonometryPrecision()
{
  return _trigonometryPrecision;
}
function setTrigonometryPrecision(p)
{
  _trigonometryPrecision = p;
}

function operationError(operation)
{
  throw "invalid operation " + operation.toString() + " with different types";
}

function Complex(r, i)
{
  this.re = r;
  this.im = i;
  this.toString = function()
  {
    return this.re.toString() + (this.im.isZero() ? "" : ("i" + this.im.toString()));
  };
  this.toFixedString = function(digits)
  {
    return this.re.toFixedString(digits) + (this.im.isZero() ? "" : ("i" + this.im.toFixedString(digits)));
  };
}

function parseComplex(value)
{
  var cs = value.split("i");
  if(cs.length < 1 || cs.length > 2)
    throw "invalid complex value: " + value;
  return new Complex(new Real(cs[0] ? cs[0] : 0),
                     new Real(cs[1] ? cs[1] : 0));
}

function addComplex(x1, x2)
{
  return new Complex(addReal(x1.re, x2.re), addReal(x1.im, x2.im));
}

function subComplex(x1, x2)
{
  return new Complex(subReal(x1.re, x2.re), subReal(x1.im, x2.im));
}

function mulComplex(x1, x2)
{
  if(x1.im.isZero() && x2.im.isZero())
    return new Complex(mulReal(x1.re, x2.re), new Real(0));
  else
    return new Complex(subReal(mulReal(x1.re, x2.re), mulReal(x1.im, x2.im)), 
                       addReal(mulReal(x1.re, x2.im), mulReal(x1.im, x2.re)));
}

function divComplex(x1, x2)
{
  if(x1.im.isZero() && x2.im.isZero())
    return new Complex(divReal(x1.re, x2.re), new Real(0));
  else
  {
    var divider = addReal(mulReal(x2.re, x2.re), mulReal(x2.im, x2.im));
    return new Complex(divReal(addReal(mulReal(x1.re, x2.re), mulReal(x1.im, x2.im)), divider),
                       divReal(subReal(mulReal(x1.im, x2.re), mulReal(x1.re, x2.im)), divider));
  }
}

function add(x1, x2)
{
  if(x1 instanceof Complex && x2 instanceof Complex)
    return addComplex(x1, x2);
  else if(x1 instanceof Real && x2 instanceof Real)
    return addReal(x1, x2);
  else
    operationError("add");
}

function sub(x1, x2)
{
  if(x1 instanceof Complex && x2 instanceof Complex)
    return subComplex(x1, x2);
  else if(x1 instanceof Real && x2 instanceof Real)
    return subReal(x1, x2);
  else
    operationError("sub");
}

function mul(x1, x2)
{
  if(x1 instanceof Complex && x2 instanceof Complex)
    return mulComplex(x1, x2);
  else if(x1 instanceof Real && x2 instanceof Real)
    return mulReal(x1, x2);
  else
    operationError("mul");
}

function div(x1, x2)
{
  if(x1 instanceof Complex && x2 instanceof Complex)
    return divComplex(x1, x2);
  else if(x1 instanceof Real && x2 instanceof Real)
    return divReal(x1, x2);
  else
    operationError("div");
}

function sinComplex(x, precision)
{
  if(!x.im.isZero())
  {
//sin (x + iy) = sin(x)*cosh(y) + i*cos(x)*sinh(y)
    return new Complex(mulReal(sinReal(x.re, precision), coshReal(x.im, precision)), mulReal(cosReal(x.re, precision), sinhReal(x.im, precision)));
  }
  else
    return new Complex(sinReal(x.re, precision), new Real(0));
}

function arcsinComplex(x, precision)
{
  if(!x.im.isZero())
  {
    throw "Not yet implemented";
  }
  else
    return new Complex(arcsinReal(x.re, precision), new Real(0));
}

function sinhComplex(x, precision)
{
  if(!x.im.isZero())
  {
//sinh(x + iy) = cos(y)*sinh(x) + i*sin(y)*cosh(x)  
    return new Complex(mulReal(cosReal(x.im, precision), sinhReal(x.re, precision)), mulReal(sinReal(x.im, precision), coshReal(x.re, precision)));
  }
  else
    return new Complex(sinhReal(x.re, precision), new Real(0));
}

function arcsinhComplex(x, precision)
{
  if(!x.im.isZero())
  {
    throw "Not yet implemented";
  }
  else
    return new Complex(arcsinhReal(x.re, precision), new Real(0));
}

function cosComplex(x, precision)
{
  if(!x.im.isZero())
  {
//cos (x + iy) = cos(x)*cosh(y) - i*sin(x)*sinh(y)
    var re = mulReal(cosReal(x.re, precision), coshReal(x.im, precision));
    var im = mulReal(sinReal(x.re, precision), sinhReal(x.im, precision));
    return new Complex(re, im.setSign(!im.isNegative()));
  }
  else
    return new Complex(cosReal(x.re, precision), new Real(0));
}

function coshComplex(x, precision)
{
  if(!x.im.isZero())
  {
//cosh(x+y*j) = cos(y)*cosh(x) + I*sin(y)*sinh(x)
    return new Complex(mulReal(cosReal(x.im, precision), coshReal(x.re, precision)), mulReal(sinReal(x.im, precision), sinhReal(x.re, precision)));
  }
  else
    return new Complex(coshReal(x.re, precision), new Real(0));
}

function tanComplex(x, precision)
{
  if(!x.im.isZero())
  {
    throw "tanComplex(x) is not yet implemented";
  }
  else
    return new Complex(tanReal(x.re, precision), new Real(0));
}

function tanhComplex(x, precision)
{
  if(!x.im.isZero())
  {
    throw "tanhComplex(x) is not yet implemented";
  }
  else
    return new Complex(tanhReal(x.re, precision), new Real(0));
}

function lnComplex(x, precision)
{
  if(!x.im.isZero())
  {
    throw "lnComplex(x) is not yet implemented";
  }
  else
    return new Complex(lnReal(x.re, precision), new Real(0));
}

function sin(x, precision)
{
  if(x instanceof Complex)
    return sinComplex(x, precision);
  else if(x instanceof Real)
    return sinReal(x, precision);
  else
    operationError("sin");
}

function arcsin(x, precision)
{
  if(x instanceof Complex)
    return arcsinComplex(x, precision);
  else if(x instanceof Real)
    return arcsinReal(x, precision);
  else
    operationError("arcsin");
}

function sinh(x, precision)
{
  if(x instanceof Complex)
    return sinhComplex(x, precision);
  else if(x instanceof Real)
    return sinhReal(x, precision);
  else
    operationError("sinh");
}

function arcsinh(x, precision)
{
  if(x instanceof Complex)
    return arcsinhComplex(x, precision);
  else if(x instanceof Real)
    return arcsinhReal(x, precision);
  else
    operationError("arcsinh");
}

function cos(x, precision)
{
  if(x instanceof Complex)
    return cosComplex(x, precision);
  else if(x instanceof Real)
    return cosReal(x, precision);
  else
    operationError("cos");
}

function cosh(x, precision)
{
  if(x instanceof Complex)
    return coshComplex(x, precision);
  else if(x instanceof Real)
    return coshReal(x, precision);
  else
    operationError("cosh");
}

function tan(x, precision)
{
  if(x instanceof Complex)
    return tanComplex(x, precision);
  else if(x instanceof Real)
    return tanReal(x, precision);
  else
    operationError("tan");
}

function tanh(x, precision)
{
  if(x instanceof Complex)
    return tanhComplex(x, precision);
  else if(x instanceof Real)
    return tanhReal(x, precision);
  else
    operationError("tanh");
}

function ln(x, precision)
{
  if(x instanceof Complex)
    return lnComplex(x, precision);
  else if(x instanceof Real)
    return lnReal(x, precision);
  else
    operationError("ln");
}

function innerEvalComplex(args)
{
  var accum;
  var cur_oper;
  var negative;
  for(args.i; args.i < args.array.length; args.i++)	
  {
    var m = args.array[args.i];
    switch(m)
    {
      case "sin":
        cur_oper = function(x) { return sin(x, getTrigonometryPrecision()); };
        break;
      case "sinh":
        cur_oper = function(x) { return sinh(x, getTrigonometryPrecision()); };
        break;
      case "cos":
        cur_oper = function(x) { return cos(x, getTrigonometryPrecision()); };
        break;
      case "cosh":
        cur_oper = function(x) { return cosh(x, getTrigonometryPrecision()); };
        break;
      case "tan":
        cur_oper = function(x) { return tan(x, getTrigonometryPrecision()); };
        break;
      case "tanh":
        cur_oper = function(x) { return tanh(x, getTrigonometryPrecision()); };
        break;
      case "arcsin":
        cur_oper = function(x) { return arcsin(x, getTrigonometryPrecision()); };
        break;
      case "arcsinh":
        cur_oper = function(x) { return arcsinh(x, getTrigonometryPrecision()); };
        break;
      case "arccos":
        cur_oper = function(x) { return arccos(x, getTrigonometryPrecision()); };
        break;
      case "arccosh":
        cur_oper = function(x) { return arccosh(x, getTrigonometryPrecision()); };
        break;
      case "arctan":
        cur_oper = function(x) { return arctan(x, getTrigonometryPrecision()); };
        break;
      case "arctanh":
        cur_oper = function(x) { return arctanh(x, getTrigonometryPrecision()); };
        break;
      case "ln":
        cur_oper = function(x) { return ln(x, getTrigonometryPrecision()); };
        break;
      case '(':
        args.i++;
        accum = innerEvalComplex(args);
        if(args.array[args.i] != ')')
          break;
      case ')':
        if(cur_oper)
        {
          args.i++;
          accum = cur_oper(accum);
        }
        return accum;
      case "+":
        cur_oper = add;
        break;
      case "-":
        if(!cur_oper)
           cur_oper = sub;
        else
          negative = true;
        break;
      case "*":
        cur_oper = mul;
        break;
      case "/":
        cur_oper = div;
        break;
      default:
        if(cur_oper)
        {
          if(accum)
          {
            var op = parseComplex(m);
            if(negative)
            {
              negative = false;
              op.re = op.re.setSign(true);
            }
            accum = cur_oper(accum, op);
          }
          else if(cur_oper == sub)
          {
            accum = parseComplex(m);
            accum.re = accum.re.setSign(true);
          }
          cur_oper = null;
        }
        else
          accum =  parseComplex(m);
        break;
    }
  }
  return accum;
}
function evalComplex(expression)
{
  if(expression instanceof Complex)
    return expression;
/*  var re = /\(|\)|sin|cos|\d+(\.\d+)?(e\-?\d+)?(\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})?i\-?\d+(\.\d+)?(e(\+|\-)?\d+)?(\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})?|\d+(\.\d+)?(e\-?\d+)?(\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})?|\*|\/|\+|\-/gi;*/
  var re = /\(|\)|arcsinh|arccosh|arctanh|arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|ln|((\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})|(\d+(\.\d+)?(e\-?\d+)?))i\-?((\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})|(\d+(\.\d+)?(e\-?\d+)?))|((\{\d+(\.\d+)?(e\-?\d+)?\:\d+(\.\d+)?(e\-?\d+)?\})|(\d+(\.\d+)?(e\-?\d+)?))|\*|\/|\+|\-/gi;
  var _array = expression.match(re);
  return innerEvalComplex({array:_array, i:0});
}
