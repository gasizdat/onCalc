//Real = Number;

var _globalCurSysDecSeparator = '.';//(1.1).toLocaleString().charAt(1);
var _globalE;
var _globalEPrecision = 0;

function getSeparator()
{
  return _globalCurSysDecSeparator;
}

function realError(r)
{
  throw "invalid real: " + r.toString();
}

var _gcdNormalization = true;
function _normalizeGcd(val)
{
  if(_gcdNormalization && !val.r.isZero())
  {
    var gcd = getLongIntGcd(val.r, val.d);
    if(compareLongInt(gcd, new LongInt(1)) != 0)
    {
      val.r = divLongInt(val.r, gcd).quotient.setSign(val.isNegative());
      val.d = divLongInt(val.d, gcd).quotient;
    }
  }
}

function _normalizeByPrecision(val, precision)
{
  var exp1 = val.r.getExponent();
  var exp2 = val.d.getExponent();
  if(exp1 > precision || exp2 > precision)
  {
    var shift_pow;
    if(exp2 > exp1)
    {
      shift_pow = exp2 - precision;
      while(shift_pow >= exp1)
        shift_pow--;
    }
    else
    {
      shift_pow = exp1 - precision;
      while(shift_pow >= exp2)
        shift_pow--;
    }
    val.r = val.r.shiftRight10(shift_pow);
    val.d = val.d.shiftRight10(shift_pow);
  }
}

function Real(r)
{
  this.d = new LongInt(1);
  switch(typeof(r))
  {
    case "string":
      var point_fraction = r.indexOf(":");
      if(point_fraction != -1)
      {
        var neg = false; 
        var start = 0;
        if(r.charAt(start) == '-')
        {
          neg = true;
          start++;
        }
        if(r.charAt(start) != '{' || lastChar(r) != '}')
          realError(r);
        else
        {
          this.r = new LongInt(r.substring(start + 1, point_fraction));
          this.r.negation = this.r.negation ? !neg : neg;
          this.d = new LongInt(r.substring(point_fraction + 1, r.length - 1));          
        }
      }
      else
      {
        var point_index = r.indexOf(getSeparator());
        var point_exp = r.indexOf('e');
        if(point_index == -1 && point_exp == -1)
          this.r = new LongInt(r);
        else
        {
          var exp = 0;
          if(point_exp != -1)
          {
            exp = parseInt(r.substr(point_exp+1));
            r = r.substring(0, point_exp);
          }
          if(point_index != -1)
          {
            var i = r.length - 1;
            for(; i >= point_index; i--)
              if(r.charAt(i) != '0')
                break;
            if(i != r.length - 1)
              r = r.substring(0, i+1); //убираем незначащие нули в конце
            exp -= r.length - point_index - 1;
            r = r.substring(0, point_index) + r.substr(point_index + 1);
            i = 0;
            for(; i < r.length; i++)
              if(r.charAt(i) != '0')
                break;
            if(i != 0)
              r = r.substring(i); //убираем незначащие нули в начале
          }
          this.r = new LongInt(r);
          if(exp > 0)
            this.r = this.r.shiftLeft10(exp);
          else if(exp < 0)
            this.d = this.d.shiftLeft10(-exp);        
        }
      }
      break;
    case "number":
      this.r = new LongInt(r);
      break;
    default:
      if(r.r)
      {
        this.r = r.r;
        if(r.d)
          this.d = r.d;
      }
      else
        realError(r);
      break;
  }
  this.setSign = function(neg)
  {
    var ret = new Real(0);
    ret.r = this.r.setSign(neg);
    ret.d = this.d.getAbs();
    return ret;
  }
  this.isNegative = function()
  {
    return this.r.isNegative() ? !this.d.isNegative() : this.d.isNegative();
  }
  this.toString = function()
  {
    var df = this.d.getPowOf10()
    var ret = this.r.toAbsString();
    if(df > 0)
    {
      if(df >= ret.length)
      {
        var point = "0"+getSeparator();
        for(df -= ret.length; df; df--)
          point += "0";
        ret = point + ret;
      }
      else
      {
        ret = ret.substring(0, ret.length - df) + getSeparator() + ret.substring(ret.length - df);
      }
    }
    else if(df < 0)
    {
      ret = "{" + ret + ":" + this.d.toAbsString() + "}";
    }
    return this.isNegative() ? "-" + ret : ret;
  };
  this.toFixedString = function(digits)
  {
    function getChunck(val, df)
    {
      var ret = val.toAbsString();
      df = ret.length - df - 1;
      var m = ret.length;
      ret = ret.charAt(0) + getSeparator() + ret.substring(1, Math.min(m, digits));
      if(digits < m)
        ret += "...";
      if(df != 0)
        ret += "e" + df.toString();
      return ret;
    }
    var df = this.d.getPowOf10()
    var ret;
    if(df >= 0)
      ret = getChunck(this.r, df);
    else if(df < 0)
    {
      if(digits != Infinity)
      {
        var exp = this.r.getExponent() - this.d.getExponent();
        var pow = digits-exp;
        var q = divLongInt(this.r.shiftLeft10(pow), this.d).quotient;
        ret = q.toString();
        if((exp == 0 && compareLongInt(this.r.setSign(false), this.d.setSign(false)) < 0) || q.getExponent() == digits)
          exp--;
        ret = ret.charAt(0) + getSeparator() + ret.substring(1);
        if(exp)
          ret += 'e'+exp.toString();
      }
      else
        ret = "{" + getChunck(this.r, 0) + ":" + getChunck(this.d, 0) + "}";
    }
    return this.isNegative() ? "-" + ret : ret;
  };
  this.isZero = function()
  {
    return this.r.isZero();
  }
}

function compareReal(x1, x2)
{
  if(x1.isNegative() == x2.isNegative())
  {
    if(compareLongInt(x1.d, x2.d) == 0)
      return compareLongInt(x1.r, x2.r);
    else
      return compareLongInt(mulLongInt(x1.r, x2.d), mulLongInt(x2.r, x1.d));
  }
  else
  {
    return x1.isNegative() ? -1 : 1;
  }
}

function subReal(x1, x2)
{
  var ret;
  if(compareLongInt(x1.d, x2.d) == 0)
    ret = new Real({r:subLongInt(x1.r, x2.r), d:x1.d});
  else
  {
    var ret = new Real(
    {
      r:subLongInt(mulLongInt(x1.r, x2.d), mulLongInt(x2.r, x1.d)), 
      d:mulLongInt(x1.d, x2.d)
    });
  }
  _normalizeGcd(ret);
  return ret;
}

function addReal(x1, x2)
{
  var ret;
  if(compareLongInt(x1.d, x2.d) == 0)
    ret = new Real({r:addLongInt(x1.r, x2.r), d:x1.d});
  else
   ret = new Real(
   {
      r:addLongInt(mulLongInt(x1.r, x2.d), mulLongInt(x2.r, x1.d)), 
      d:mulLongInt(x1.d, x2.d)
   });
  _normalizeGcd(ret);
  return ret;
}

function mulReal(x1, x2)
{
  var ret = new Real(
  {
    r:mulLongInt(x1.r, x2.r), 
    d:mulLongInt(x1.d, x2.d)
  });
  _normalizeGcd(ret);
  return ret; 
}

function divReal(x1, x2)
{
  var ret = new Real(
  {
    r:mulLongInt(x1.r, x2.d), 
    d:mulLongInt(x2.r, x1.d)
  });
  _normalizeGcd(ret);
  return ret; 
}

function _sinReal(x, precision, hyperbolic)
{
  if(!precision)
    throw "precision mus be defined";

  var add = false;
  var one = new Real(1);
  var x2 = mulReal(x, x);
  var p = mulReal(x2, x); //x^3
  var d = new Real("6"); //3!
  var _d = new Real("4");
  var ret = x;
  _gcdNormalization = false;
  for(;;)
  {
    var prec = d.r.getExponent() - d.d.getExponent() -
                     p.r.getExponent() + p.d.getExponent();
    if(prec > precision)
      break;
    else if(!add && !hyperbolic)
    {
      ret = subReal(ret, divReal(p, d));
    }
    else
    {
      ret = addReal(ret, divReal(p, d));
    }
    add = !add;
    p = mulReal(p, x2);
    d = mulReal(d, _d);
    _d = addReal(_d, one);
    d = mulReal(d, _d);
    _d = addReal(_d, one);
  }
  _gcdNormalization = true;

  _normalizeByPrecision(ret, precision);
  _normalizeGcd(ret);
  return ret; 
}

function _cosReal(x, precision, hyperbolic)
{
  if(!precision)
    throw "precision mus be defined";

  var add = false;
  var one = new Real(1);
  var x2 = mulReal(x, x);
  var p = x2; //x^2
  var d = new Real("2"); //2!
  var _d = new Real("3");
  var ret = one;
  _gcdNormalization = false;
  for(;;)
  {
    var prec = d.r.getExponent() - d.d.getExponent() -
                     p.r.getExponent() + p.d.getExponent();
    if(prec > precision)
      break;
    else if(!add && !hyperbolic)
    {
      ret = subReal(ret, divReal(p, d));
    }
    else
    {
      ret = addReal(ret, divReal(p, d));
    }
    add = !add;
    p = mulReal(p, x2);
    d = mulReal(d, _d);
    _d = addReal(_d, one);
    d = mulReal(d, _d);
    _d = addReal(_d, one);
  }
  _gcdNormalization = true;

  _normalizeByPrecision(ret, precision);
  _normalizeGcd(ret);
  return ret; 
}

function _arcsinReal(x, precision, hyperbolic)
{
//TODO: Возможно имеет смысл выражать арк-функции через натуральный логарифм
  var one = new Real(1);
  if(compareReal(x.setSign(false), one) > 0)
    throw (hyperbolic ? "arcsinhReal" : "arcsinReal") + " defined at range [-1; 1]";
  var add = false;
  var two = new Real(2);
  var x2 = mulReal(x, x);
  var ret = x;
  var dd = one;
  var dp1 = two;
  var dp2 = new Real(3);
  var d = mulReal(x, x2);
  var p = dp1;
  _gcdNormalization = false;
  for(;;)
  {
    var chunk = divReal(d, mulReal(p, dp2));
    var prec = chunk.d.getExponent() - chunk.r.getExponent();
    if(prec > precision)
      break;

    if(!hyperbolic || add)
      ret = addReal(ret, chunk);
    else
      ret = subReal(ret, chunk);
    
    add = !add;
    
    dd = addReal(dd, two);
    dp1 = addReal(dp1, two);
    dp2 = addReal(dp2, two);

    d = mulReal(d, x2);
    d = mulReal(d, dd);
    p = mulReal(p, dp1);
  }
  _gcdNormalization = true;
  
  _normalizeByPrecision(ret, precision);
  _normalizeGcd(ret);
  return ret;
}

function _tanReal(x, precision, hyperbolic)
{
  return divReal(_sinReal(x, precision, hyperbolic), _cosReal(x, precision, hyperbolic));
}

function sinReal(x, precision)
{
  return _sinReal(x, precision, false);
}

function arcsinReal(x, precision)
{
  return _arcsinReal(x, precision, false);
}

function sinhReal(x, precision)
{
  return _sinReal(x, precision, true);
}

function arcsinhReal(x, precision)
{
  return _arcsinReal(x, precision, true);
}

function cosReal(x, precision)
{
  return _cosReal(x, precision, false);
}

function coshReal(x, precision)
{
  return _cosReal(x, precision, true);
}

function tanReal(x, precision)
{
  return _tanReal(x, precision, false);
}

function tanhReal(x, precision)
{
  return _tanReal(x, precision, true);
}

function getE(precision)
{
  if(_globalEPrecision < precision)
  {
    var one = new Real(1);
     var d = one;
     var n = one;
     _globalE = new Real(0);
     _gcdNormalization = false;
     for(;;)
     {
       var chunk = divReal(one, n);
       var prec = chunk.d.getExponent() - chunk.r.getExponent();
       if(prec > precision)
         break;
   
      _globalE = addReal(_globalE, chunk);
       n = mulReal(n, d);
       d = addReal(d, one);
     }
     _gcdNormalization = true;
  
     _normalizeByPrecision(_globalE, precision);
     _normalizeGcd(_globalE);
  }
  return _globalE;
}

function lnReal_v1(x, precision)
{
  var zero = new Real(0);
  var one = new Real(1);
  var two = new Real(2);
  var e = getE(precision);
  var n = zero;
  for(; ; n = addReal(n, one))
  {
    var _x = divReal(x, e);
    if(compareReal(_x, one) < 0)
      break;
    else
      x = _x;
  }
  _normalizeByPrecision(x, precision);

  var x = subReal(x, one);
  var ret = zero;
  var r = x;
  var d = one;
  var add = true;
  _gcdNormalization = true;
  for(;;)
  {
    var chunk = divReal(r, d);
    var prec = chunk.d.getExponent() - chunk.r.getExponent();
    if(prec > precision)
      break;
    if(add)
      ret = addReal(ret, chunk);
    else
      ret = subReal(ret, chunk);
    add = !add;
    r = mulReal(r, x);
    d = addReal(d, one);
  }
  _gcdNormalization = true;
  _normalizeByPrecision(ret, precision);
  _normalizeGcd(ret);
  return addReal(ret, n);
}

function lnReal(x, precision)
{
  var zero = new Real(0);
  var one = new Real(1);
  var two = new Real(2);
  var e = getE(precision);
  var n = zero;
  for(; ; n = addReal(n, one))
  {
    var _x = divReal(x, e);
    if(compareReal(_x, one) < 0)
      break;
    else
      x = _x;
  }
  _normalizeByPrecision(x, precision);

  x = divReal(x, subReal(x, one));
  var ret = zero;
  var d1 = one;
  var d2 = x;
  _gcdNormalization = false;
  for(;;)
  {
    var chunk = divReal(one, mulReal(d1, d2));
    var prec = chunk.d.getExponent() - chunk.r.getExponent();
    if(prec > precision)
      break;
    
    ret = addReal(ret, chunk);
    
    d1 = addReal(d1, one);
    d2 = mulReal(d2, x);
  }
  
  _gcdNormalization = true;
  _normalizeByPrecision(ret, precision);
  _normalizeGcd(ret);
  return addReal(ret, n);
}
//alert(lnReal(new Real(205), 5).toFixedString(10))