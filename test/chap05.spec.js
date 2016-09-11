"use strict";

// プログラムをコントロールする仕組み
// ============================

var expect = require('expect.js');


// ## 条文分岐の種類と特徴
describe('条文分岐の種類と特徴', () => {
  // ### 条文分岐としてのif文
  describe('条件分岐としてのif文', () => {
    // 偶数かどうかを判定する
    it('偶数かどうかを判定する', (next) => {
      /* ##@range_begin(even_function)*/
      var even = (n) => {
        if((n % 2) === 0) { // 2で割った余りが0の場合
          return true;
        } else {            // 2で割った余りが0でない場合
          return false;
        }
      };
      /* ##@range_end(even_function)*/
      expect(
        even(2)
      ).to.eql(
        true
      );
      expect(
        even(3)
      ).to.eql(
        false
      );
      next();
    });
    // ネストされたif文
    it("ネストされたif文", (next) => {
      /* #@range_begin(compare) */
      var compare =  (n,m) => {
        if (n > m) {     // nがmよりも大きなケース
          return 1;
        } else {
          if(n === m) {  // ネストされたif文
            return 0;
          } else {
            return -1;
          }
        }
      };
      /* テスト */
      /* 3 は 2 よりも大きい */
      expect(
        compare(3,2)
      ).to.eql(
        1
      );
      /* 2 は 3 よりも小さい */
      expect(
        compare(2,3)
      ).to.eql(
          -1
      );
      /* #@range_end(compare) */
      /* 1 と 1 は等しい */
      expect(
        compare(1,1)
      ).to.eql(
        0
      );
      next();
    });
    // else if文による3つ以上の条件分岐
    it("else if文による3つ以上の条件分岐", (next) => {
      /* #@range_begin(elseif) */
      var compare =  (n,m) => {
        if (n > m) {
          return 1;
        } else if (n === m) { // elseにif文を続ける
          return 0;
        } else  {
          return -1;
        }
      };
      /* #@range_end(elseif) */
      /* テスト */
      /* 3 は 2 よりも大きい */
      expect(
        compare(3,2)
      ).to.eql(
        1
      );
      /* 1 と 1 は等しい */
      expect(
        compare(1,1)
      ).to.eql(
        0
      );
      /* 2 は 3 よりも小さい */
      expect(
        compare(2,3)
      ).to.eql(
          -1
      );
      next();
    });
    // #### if文の問題点
    describe('if文の問題点', () => {
      // returnで関数を抜ける
      it('returnで関数を抜ける', (next) => {
        /* ##@range_begin(even_function_again) */
        var even = (n) => {
          if((n % 2) === 0) {
            /* returnでeven関数を抜けてtrueを返す */
            return true;       
          } else {
            /* returnでeven関数を抜けてfalseを返す */
            return false;      
          }
        };
        /* ##@range_end(even_function_again) */
        next();
      });
    });
  });
  // ### 条件分岐としてのswitch文
  describe('条件分岐としてのswitch文', () => {
    // #### switch文の問題点
    it("switch文の問題点", (next) => {
      // 可変なデータとのマッチング
      /* #@range_begin(switch_for_mutable) */
      var match_for_mutable = (array) => {
        switch(array){
        case [1,2,3]: // [1,2,3] とマッチさせたい
          return true;   // マッチすれば、trueを返す
          break;
        default:
          return false;  // マッチしなければ、falseを返す
        }
      };
      /* テスト */
      expect(
        match_for_mutable([1,2,3])
      ).to.eql(
        false  // case [1,2,3] にはマッチしない
      );
      /* #@range_end(switch_for_mutable) */
      next();
    });
  });
  // #### 代数的データ型とパターンマッチ
  describe('代数的データ型とパターンマッチ', () => {
    var match = (data, pattern) => {
      return data.call(pattern, pattern);
    };
    // 代数的データ構造によるリスト
    it('代数的データ構造によるリスト', (next) => {
      /* #@range_begin(list_in_algebraic_datatype) */
      /* リストの代数的データ型 */
      var empty = () => { // 空のリスト
        return (pattern) => {
          return pattern.empty();
        };
      };
      var cons = (value, list) => { // 空でないリスト
        return (pattern) => {
          return pattern.cons(value, list);
        };
      };
      /* #@range_end(list_in_algebraic_datatype) */

      // 代数的データ構造のmatch関数
      /* #@range_begin(match_in_algebraic_datatype) */
      /* 代数的データ型に対してパターンマッチを実現する関数 */
      var match = (data, pattern) => {
        return data(pattern);
      };
      /* #@range_end(match_in_algebraic_datatype) */

      // リストの関数定義
      /* #@range_begin(list_function_using_algebraic_datatype) */
      /* isEmpty関数は、引数alistに渡されたリストが空のリストかどうかを
         判定する */
      var isEmpty = (alist) => {
        /* match関数で分岐する */
        return match(alist, { 
          /* emptyにマッチするケース */
          empty: (_) => {          
            return true;
          },
          /* consにマッチするケース */
          cons: (head, tail) => {  // headとtailにそれぞれ先頭と後尾が入る
            return false;
          }
        });
      };
      /* head関数は、引数alistに渡されたリストの先頭の要素を返す */
      var head = (alist) => {
        return match(alist, {
          /* 空のリストに先頭要素はない */
          empty: (_) => {
            return null; 
          },
          cons: (head, tail) => {
            return head;
          }
        });
      };
      /* tail関数は、引数alistに渡されたリストの後尾のリストを返す */
      var tail = (alist) => {
        return match(alist, {
          /* 空のリストに後尾はない */
          empty: (_) => {
            return null;  
          },
          cons: (head, tail) => {
            return tail;
          }
        });
      };
      /* #@range_end(list_function_using_algebraic_datatype) */

      // 代数的データ構造のリストの関数のテスト
      /* #@range_begin(list_in_algebraic_datatype_test) */
      /* emptyは空のリストか */
      expect(
        isEmpty(empty())                    
      ).to.eql(
        true
      );
      /* cons(1,empty())は空のリストか */
      expect(
        isEmpty(cons(1,empty()))            
      ).to.eql(
        false
      );
      /* cons(1,empty())の先頭要素は1である */
      expect(
        head(cons(1,empty()))               
      ).to.eql(
        1
      );
      /* cons(1,cons(2,empty()))の2番目の要素は2である */
      expect(
        head(tail(cons(1,cons(2,empty())))) 
      ).to.eql(
        2
      );
      /* #@range_end(list_in_algebraic_datatype_test) */
      expect(
        isEmpty(tail(cons(1,empty())))     // [1]の末尾要素は空のリストである
      ).to.be(
        true
      );
      next();
    });
  });
});
// ## 反復処理の種類と特徴
describe("反復処理の種類と特徴", () => {
  describe("while文", () => {
    // while文の例
    it("while文の例", (next) => {
      /* #@range_begin(while_counter) */
      var counter = 0;         // 変数の初期化
      while (counter < 10) {   // 反復の条件
        counter = counter + 1; // 変数の更新
      }
      /* テスト */
      expect(
        counter
      ).to.eql(
        10
      );
      /* #@range_end(while_counter) */
      next();
    });
  });
  it("for文", (next) => {
    // for文の例
    /* #@range_begin(for_example) */
    for (var counter = 0; counter < 10; counter += 1) {
      ;
    }
    /* テスト */
    expect(
      counter
    ).to.eql(
      10
    );
    /* #@range_end(for_example) */
    next();
  });
  describe('forEach文', () => {
    // forEachメソッドの例
    it("forEach文によるlength", (next) => {
      /* #@range_begin(forEach_length) */
      var length = (array) => {
        var result = 0;
        array.forEach((element) => {
          result += 1;
        });
        return result;
      };
      /* テスト */
      expect(
        length([1,2,3,4,5])
      ).to.eql(
        5
      );
      /* #@range_end(forEach_length) */
      next();
    });
  });
});

// ## 再帰による反復処理
describe('再帰による反復処理', () => {
  describe('複利法の例', () => {
    it("複利の計算", (next) => {
      // 複利の計算
      /* #@range_begin(compound_interest) */
      var compoundInterest = (a, r, n) => {
        if (n === 0) { // 初年度は利率がつかないので元金がそのまま返る
          return a;
        } else {
          /* compoundInterestの再帰呼び出し */
          return compoundInterest(a, r, n - 1) * (1 + r); 
        }
      };
      /* #@range_end(compound_interest) */
      expect(
        compoundInterest(100000, 0.02, 1)
      ).to.eql(
        102000
      );
      expect(
        compoundInterest(100000, 0.02, 2)
      ).to.eql(
        104040  // 10万円を預けてから2年後には10万4040円が銀行口座に入っている
      );
      expect(
        compoundInterest(100000, 0.02, 25)
      ).to.eql(
        164060.59944647306
      );
      next();
    });
  });
  // ### 再帰呼び出しの条件
  describe('再帰呼び出しの条件', () => {
    // infiniteLoop関数
    /* ##@range_begin(infiniteLoop) */
    var infiniteLoop = (_) => {
      return infiniteLoop(_);
    };
    /* ##@range_end(infiniteLoop) */
    it('ifの非正格性', (next) => {
      /* ##@range_begin(if_nonstrict) */
      var infiniteLoop = (_) => {
        return infiniteLoop(_);     /* 同じ関数を実行するので無限ループになります */
      };
      var lessThanFive = (n) => {
        if(n < 5) {
          return true;
        } else {
          return infiniteLoop(); // ここが実行されると無限ループになります
        }
      };
      /* テスト */
      expect(
        lessThanFive(1)
      ).to.eql(
        true
      );
      /* このテストは実行されると無限ループになるのでコメントアウトしています
         expect(
         lessThanFive(10)
         ).to.eql(
         false // 無限ループ
         );
      */
      /* ##@range_end(if_nonstrict) */
      next();
    });
    it('再帰によるmap関数', (next) => {
      /* 第5章で紹介したリスト型 */
      var match = (exp, pattern) => {
        return exp.call(pattern, pattern);
      };
      var empty = (_) => {
        return (pattern) => {
          return pattern.empty(_);
        };
      };
      var cons = (x, xs) => {
        return (pattern) => {
          return pattern.cons(x, xs);
        };
      };
      // 再帰によるmap関数
      /* #@range_begin(recursive_map) */
      var map = (alist,transform) => {
        return match(alist,{
          empty: (_) => { return empty(); },  // 終了条件で再帰を抜ける
          cons: (head,tail) => {
            return cons(transform(head),
                        map(tail,transform)); // map関数の再帰呼び出し
          }
        });
      };
      /* #@range_end(recursive_map) */
      // 再帰によるtoArray関数
      /* #@range_begin(recursive_toArray) */
      var toArray = (alist) => {
        /* 補助関数 toArrayHelper */
        var toArrayHelper = (alist,accumulator) => {
          return match(alist, {
            empty: (_) => { return accumulator; },  // 空のリストの場合は終了
            cons: (head, tail) => {
              return toArrayHelper(tail,accumulator.concat(head));
            }
          });
        };
        return toArrayHelper(alist,[]);
      };
      /* #@range_end(recursive_toArray) */
      var succ = (n) => {
        return n + 1;
      };
      expect(
        toArray(map(cons(1,cons(2,cons(3,empty()))),succ))
      ).to.eql(
        [2,3,4]
      );
      next();
    });
  });
  // ### 再帰処理の利点
  describe('再帰処理の利点', () => {
    var match = (exp, pattern) => {
      return exp.call(pattern, pattern);
    };
    var empty = (_) => {
      return (pattern) => {
        return pattern.empty(_);
      };
    };
    var cons = (x, xs) => {
      return (pattern) => {
        return pattern.cons(x, xs);
      };
    };
    var isEmpty = (list) => {
      return match(list, {
        empty: (_) => {
          return true;
        },
        cons: (head, tail) => {
          return false;
        }
      });
    };
    var head = (list) => {
      return match(list, {
        empty: (_) => {
          return null;
        },
        cons: (head, tail) => {
          return head;
        }
      });
    };
    var tail = (list) => {
      return match(list, {
        empty: (_) => {
          return null;
        },
        cons: (head, tail) => {
          return tail;
        }
      });
    };
    // #### 再帰処理と再帰的データ構造
    describe('再帰処理と再帰的データ構造', () => {

      describe('再帰的データ構造としてのリスト', () => {
        // 再帰によるlength関数
        it('再帰によるlength関数', (next) => {
          /* #@range_begin(recursive_length_without_accumulator) */
          var length = (list) => {
            return match(list, {
              /* emptyの場合は、終了条件となる */
              empty: (_) => {    
                return 0;
              },
              /* consの場合は、length関数を再帰的に呼び出す */
              cons: (head, tail) => { 
                return 1 + length(tail);
              }
            });
          };
          /* #@range_end(recursive_length_without_accumulator) */
          /************************ テスト ************************/
          expect(
            length(cons(1,cons(2,cons(3,empty())))) // [1,2,3]の長さは 3
          ).to.eql(
            3
          );
          next();
        });
        // 再帰によるappend関数
        it('再帰によるappend関数', (next) => {
          var cons = (x, xs) => {
            return (pattern) => {
              return pattern.cons(x, xs);
            };
          };
          var toArray = (seq,callback) => {
            var toArrayAux = (seq,accumulator) => {
              return match(seq, {
                empty: (_) => {
                  return accumulator;
                },
                cons: (head, tail) => {
                  return toArrayAux(tail, accumulator.concat(head));
                }
              });
            };
            return toArrayAux(seq, []);
          };
          /* append :: (LIST[T], LIST[T]) -> LIST[T] */
          /* #@range_begin(list_append) */
          var append = (xs, ys) => {
            return match(xs,{
              /* emptyの場合は、終了条件 */
              empty: (_) => { 
                return ys; // xsが空の場合は、ysを返す
              },
              /* consの場合は、append関数を再帰的に呼び出す */
              cons: (head, tail) => { 
                /* xsとysを連結させる */
                return cons(head, append(tail,ys));
              }
            });
          };
          /* #@range_end(list_append) */
          
          /* #@range_begin(list_append_test) */
          var xs = cons(1,
                        cons(2,
                             empty()));
          var ys = cons(3,
                        cons(4,
                             empty()));
          expect(
            toArray(append(xs,ys)) // toArray関数でリストを配列に変換する
          ).to.eql(
            [1,2,3,4]
          );
          /* #@range_end(list_append_test) */
          next();
        });
        // 再帰によるreverse関数
        it('再帰によるreverse関数', (next) => {
          var empty = (_) => {
            return (pattern) => {
              return pattern.empty(_);
            };
          };
          var cons = (x, xs) => {
            return (pattern) => {
              return pattern.cons(x, xs);
            };
          };
          /* #@range_begin(list_reverse) */
          var reverse = (list) => {
            var reverseHelper = (list, accumulator) => {
              return match(list, {
                empty: (_) => {  // emptyの場合は、終了条件
                  return accumulator;
                },
                cons: (head, tail) => { // consの場合は、reverse関数を再帰的に呼び出す
                  return reverseHelper(tail, cons(head, accumulator));
                }
              });
            };
            return reverseHelper(list, empty());
          };
          /* #@range_end(list_reverse) */
          next();
        });
      });
      describe('再帰的データ構造としての数式', () => {
        // 代数的データ構造による数式
        /* #@range_begin(expression_algebraic_datatype) */
        var num = (n) => {
          return (pattern) => {
            return pattern.num(n);
          };
        };
        var add = (exp1, exp2) => {
          return (pattern) => {
            return pattern.add(exp1, exp2);
          };
        };
        var mul = (exp1, exp2) => {
          return (pattern) => {
            return pattern.mul(exp1, exp2);
          };
        };
        /* #@range_end(expression_algebraic_datatype) */
        // 数式を再帰的に計算する
        /* #@range_begin(expression_algebraic_datatype_recursion) */
        var calculate = (exp) => {
          return match(exp, { // パターンマッチを実行する
            num: (n) => {
              return n;
            },
            add: (expL, expR) => {
              /* calculateを再帰的に呼び出して足し算を実行する */
              return calculate(expL) + calculate(expR); 
            },
            mul: (expL, expR) => {
              /* calculateを再帰的に呼び出してかけ算を実行する */
              return calculate(expL) * calculate(expR); 
            }
          });
        };
        /**** テスト ****/
        /* 1 + (2 * 3) を計算する */
        var expression = add(num(1),
                             mul(num(2),
                                 num(3)));
        expect(
          calculate(expression)
        ).to.eql(
          7
        );
      });
      /* #@range_end(expression_algebraic_datatype_recursion) */
    });
  });
  // #### 再帰処理と帰納法
  describe('再帰処理と帰納法', () => {
    var match = (data, pattern) => {
      return data.call(pattern, pattern);
    };
    var cons = (head, tail) => {
      return (pattern) => {
        return pattern.cons(head, tail);
      };
    };
    var length = (list) => {
      return match(list, {
        empty: (_) => {    // リストが空のときが終了条件となる
          return 0;
        },
        cons: (head, tail) => {
          return 1 + length(tail);
        }
      });
    };
    var append = (xs, ys) => {
      return match(xs,{
        empty: (_) => {
          return ys;
        },
        cons: (head, tail) => {
          return cons(head,
                      append(tail,ys));
        }
      });
    };
    // ~~~
    // 命題P  length(append(xs, ys)) === length(xs) + length(ys)
    // ~~~
    it('リストの長さに関する命題P', (next) => {
      var empty = (_) => {
        return (pattern) => {
          return pattern.empty(_);
        };
      };
      var cons = (x, xs) => {
        return (pattern) => {
          return pattern.cons(x, xs);
        };
      };
      // 命題Pの単体テスト
      /* #@range_begin(statement_p_test) */
      var xs = cons(1,
                    cons(2,
                         empty()));
      var ys = cons(3,
                    cons(4,
                         empty()));
      expect(
        length(append(xs, ys))  // 命題Pの左辺
      ).to.eql(
        length(xs) + length(ys) // 命題Pの右辺
      );
      /* #@range_end(statement_p_test) */
      next();
    });
  });
}); 

// [目次に戻る](http://akimichi.github.io/functionaljs/) [次章に移る](http://akimichi.github.io/functionaljs/chap06.spec.html) 
