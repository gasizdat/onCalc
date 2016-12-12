//alert("LongInt");
var _N;
var _k;
/*Рассчитывает целое число k, такое, что выполняется система уравнений (т.е. не теряется точность вычислений):
 ╓ N = 10^k
 ╢ n = N - 1
 ╙ 3 = n*N - (n*n+n-3)
*/
function calcComputationBase()
{
  _N = 1;
  _k = 0;
  var n = _N - 1;
  while((n*_N - (n*n+n-3)) == 3)
  {
    _k++;
    _N *= 10;
    n = _N - 1;
  }
  _k--;
  _N = 1;
  for(var i = 0; i < _k; i++)
    _N *= 10;
//  alert(_N.toString()+"\n"+_k);
}

calcComputationBase();

function longIntError(r)
{
  throw "invalid LongInt: " + r.toString();
}
function _maxIntCell()
{
  return _N; 
}
function _maxIntCellStrLength()
{
  return _k;
}


function LongInt(val)
{
  this.m = new Array();
  this._negative = false;
  this.isNegative = function()
  {
    return this._negative;
  }
  this.getAbs = function()
  {
    var ret = new LongInt(0);
    ret.m = this.m;
    return ret;
  }
  this.setSign = function(neg)
  {
    var ret = new LongInt(0);
    ret.m = this.m;
    ret._negative = neg;
    return ret;  
  }
  this.toAbsString = function()
  {
    if(this.m.length == 0)
      return "0";
    else
    {
      var ret = "";
      for(var i = this.m.length - 1; i >= 0; i--)
      {
        var chunk = this.m[i].toString();
        if(i != (this.m.length - 1))
        {
          while(chunk.length < _maxIntCellStrLength())
            chunk = "0" + chunk;
        }
        ret += chunk;
      }
      return ret;
    }
  }
  this.toString = function()
  {
    return (this._negative ? "-" : "") + this.toAbsString();
  }
  switch(typeof(val))
  {
    case "string":
      if(val.length <= _maxIntCellStrLength())
      {
        this.m[0] = parseInt(val);
        if(this.m[0] < 0)
        {
          this.m[0] = -this.m[0];
          this._negative = true;
        }
      }
      else
      {
        if(val.charAt(0) == '-')
        {
          this._negative = true;
          val = val.substring(1);
        }
        var j = Math.ceil(val.length / _maxIntCellStrLength());
        var b = val.length;
        var a = val.length - _maxIntCellStrLength();
        for(var i = 0; i < j; i++)
        {
          try
          {
            this.m[i] = parseFloat(val.substring(a, b));
            if(this.m[i] < 0 || this.m[i] != this.m[i].toFixed())
              longIntError(val);
            a -= _maxIntCellStrLength();
            if(a < 0)
              a = 0;
            b -= _maxIntCellStrLength();
          }
          catch(ex)
          {
            longIntError(val);
          }
        }
        _normalizeLongIntUpper(this);
      }
      break;
    case "number":
      var j = 0;
      this._negative = val < 0;
      val = Math.abs(val);
      while(val > _maxIntCell())
      {
        this.m[j++] = val % _maxIntCell();
        val = Math.floor(val / _maxIntCell());
      }
      this.m[j++] = val;
      break;
    default:
      longIntError(val);
  }
  //Если число == 0 - возвращает true, иначе - false
  this.isZero = function()
  {
    return this.m.length == 1 && this.m[0] == 0;
  }
  this.getExponent = function()
  {
    var k = 0;
    for(var n = this.m[this.m.length - 1]; n >= 1; k++, n /= 10);
    return (this.m.length - 1) * _maxIntCellStrLength() + k;
  }
  //Если число - степень 10 - возвращает показатель степени, иначе -1
  this.getPowOf10 = function()
  {
    var ret = 0; var i = 0;
    for(; i < this.m.length - 1; i++)
      if(this.m[i])
        return -1;
    var n = this.m[i];
    var k = 0;
    for(; n !=1; k++)
    {
      n /= 10;
      if(n%1)
        return -1;
    }
    return i * _maxIntCellStrLength() + k;
  }
  //Левый сдвиг по модулю 10
  this.shiftLeft10 = function(pow)
  {
    var n = Math.floor(pow/_maxIntCellStrLength());
    var k = pow%_maxIntCellStrLength();
    var tmp = new LongInt(0);
    for(var i = 0; i < n; i++)
      tmp.m[i] = 0;
    tmp.m[n] = 1;
    for(var i = 0; i < k; i++)
      tmp.m[n] *= 10;
    return mulLongInt(this, tmp);
  }
  //Правый сдвиг по модулю 10
  this.shiftRight10 = function(pow)
  {
    var n = Math.floor(pow/_maxIntCellStrLength());
    var k = pow%_maxIntCellStrLength();
    var tmp = new LongInt(0);
    for(var i = 0; i < n; i++)
      tmp.m[i] = 0;
    tmp.m[n] = 1;
    for(var i = 0; i < k; i++)
      tmp.m[n] *= 10;
    return divLongInt(this, tmp).quotient.setSign(this.isNegative());
  }
}

function compareLongInt(x1, x2)
{
  if(x1.isNegative() != x2.isNegative())
  {
    if(x1.isNegative())
      return -1;
    else
      return 1;
  }
  else
  {
    if(x1.m.length < x2.m.length)
      return -1;
    else if(x1.m.length > x2.m.length)
      return 1;
    else
    {
      for(var i = x1.m.length-1; i >= 0; i--)
      {
        if(x1.m[i] < x2.m[i])
          return -1;
        else if(x1.m[i] > x2.m[i])
          return 1;
      }
      return 0;
    }
  }
}

function addLongInt(x1, x2)
{
  if(x1.isNegative() != x2.isNegative())
  {
    if(x1.isNegative()) //-x1 + x2 = x2 - x1
      return subLongInt(x2, x1.setSign(false));
    else //x1 - x2
      return subLongInt(x1, x2.setSign(false));
  }
  else
  {
    var ret = (new LongInt(0)).setSign(x1.isNegative());
    var l = Math.max(x1.m.length, x2.m.length);
    var a = 0; var i;
    for(i = 0; i < l; i++)
    {
      var n = ((x1.m.length > i) ? x1.m[i] : 0) + ((x2.m.length > i) ? x2.m[i] : 0) + a;
      if(n >= _maxIntCell())
      {
        a = Math.floor(n / _maxIntCell());
        n = n %  _maxIntCell();
      }
      else
        a = 0;
      ret.m[i] = n;
    }
    if(a > 0)
    {
      if(a >= _maxIntCell())
        throw "addLongInt internal error 1";
      ret.m[i] = a;      
    }
    return ret;
  }
}

function _normalizeLongIntUpper(x)
{
  var i = x.m.length - 1;
  for(; i > 0; i--)
  {
    if(x.m[i])
      break;
  }
  if(i != (x.m.length-1))
    x.m.splice(i+1, x.m.length - i - 1);
}

function subLongInt(x1, x2)
{
  if(x1.isNegative() && !x2.isNegative()) //-x1 - x2 = -x1 + -x2
    return addLongInt(x1, x2.setSign(true));
  else if(!x1.isNegative() && x2.isNegative())//x1 - -x2 = x1 + x2
    return addLongInt(x1, x2.setSign(false));
  else if(x1.isNegative() && x2.isNegative()) //-x1 - -x2 = x2 - x1
    return subLongInt(x2.setSign(false), x1.setSign(false));
  else if(compareLongInt(x1, x2) < 0) //x1 - x2 = -(x2 - x1), x1 < x2
    return subLongInt(x2, x1).setSign(true);
  else //x1 - x2, guaranted: x1 >= x2
  {
    var ret = new LongInt(0);
    var a = 0;
    for(var i = 0; i < x1.m.length; i++)
    {
      var n = x1.m[i] - ((x2.m.length > i) ? x2.m[i] : 0) - a;
      if(n < 0)
      {
        a = 1;
        n += _maxIntCell();
      }
      else
        a = 0;
      ret.m[i] = n;
    }
    if(a != 0) //case impossible, if asserted  x1 >= x2
        throw "subLongInt internal error 2";
    _normalizeLongIntUpper(ret);
    return ret;
  }
}

function mulLongInt(x1, x2)
{
  var ret = (new LongInt(0)).setSign(x1.isNegative() ? !x2.isNegative() : x2.isNegative()); //x1.isNegative() XOR x2.isNegative()
  var a = 0;
  var i = 0;
  for(; i < x1.m.length; i++)
  {
    var m1 = x1.m[i];
    var j = 0;
    for(; j < x2.m.length; j++)
    {
      var n = m1 * x2.m[j] + a;
      if(n >= _maxIntCell())
      {
        a = Math.floor(n / _maxIntCell());
        n = n %  _maxIntCell();
      }
      else
        a = 0;
      var k = i + j;
      if(!ret.m[k])
        ret.m[k] = n;
      else
      {
        n += ret.m[k];
        if(n >= _maxIntCell())
        {
          a += Math.floor(n / _maxIntCell());
          n = n %  _maxIntCell();
        }
        ret.m[k] = n;
      }
    }
    if(a)
    {
      var k = i + j;
      if(!ret.m[k])
      {
        ret.m[k] = a;
        a = 0
      }
      else
      {
        throw "mulLongInt internal error 3";
      }
    }
  }  
  if(a)
  {
    var k = i + j;
    if(!ret.m[k])
    {
      ret.m[k] = a;
      a = 0
    }
    else
    {
      throw "mulLongInt internal error 4";
    }
  }
  _normalizeLongIntUpper(ret);
  return ret;
}

function divLongInt(x1, x2)
{
  var q = new LongInt(0);
  x1 = x1.setSign(false);
  x2 = x2.setSign(false);
  if(compareLongInt(x1, x2) >= 0)
  {
    var pow = x1.getExponent() - x2.getExponent();
    do
    {
      var _x2 = x2;
      if(pow > 1)
        _x2 = x2.shiftLeft10(pow - 1);//normalizing divider
      var r = 0;
      for(; compareLongInt(x1, _x2) >= 0; r++)
        x1 = subLongInt(x1, _x2);
      q = addLongInt(q, pow ? (new LongInt(r)).shiftLeft10(pow - 1) : new LongInt(r));
      pow--;
    }
    while(pow > 0 && !x1.isZero());
  }
  return {quotient:q, remainder:x1, toString:function(){ return "q:" + this.quotient + ", r:" + this.remainder; }};
}

function getLongIntGcd(x1, x2)
{
//Вычислим r - остаток от деления числа a на b, a = bq+r, 0 <= r < b. 
  var res = divLongInt(x1, x2);
  while(!res.remainder.isZero())
  {
    x1 = x2;
    x2 = res.remainder;
    res = divLongInt(x1, x2);
  }
  return x2.getAbs();
}
/*

var x1 = new LongInt(77966332255888855205); var x2 = new LongInt(17); alert(divLongInt(x1, x2));

7789*8799=68535411

mi = 100
89, 77 -> 7789
*
99, 87 -> 8799
-------------
99*89=8811->11[88]
99*77+88=7711->11, 77
11, 11, 77

87*89=7743->43[77]
87*77+77=6776->76, 67
43, 76, 67

11, 11, 77
+
00, 43, 76, 67
---------
11, 54, 53, 68->68535411

*/

//alert((new LongInt("-123456789123456700000056789123456789")).toString())
//var li = new LongInt("112233445566778899"); alert(addLongInt(li, li));
//var l1 = new LongInt("112233445566778899");var l2 = new LongInt("999888777666555444333222111000"); alert(subLongInt(addLongInt(l1, l2), l2));
//alert(mulLongInt(new LongInt("112233445566778899"), new LongInt("998877665544332211")))
