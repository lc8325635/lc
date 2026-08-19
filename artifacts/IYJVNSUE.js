import{b as Me,c as ve,d as Ne,f as Ft}from"./chunks/F7WQ4MB3.js";var Ce=class Y{static EOF="EOF";static EOL="EOL";static COMMENT="COMMENT";constructor(y,t,n){this.type=y,this.value=t,this.ref=n}isEof(){return this.type==Y.EOF}toString(){return`Token(${this.type}, "${this.value}", line ${this.lineno})`}};var St=class{constructor(y,t="<lexer>"){this.text=y,this.filename=t,this.index=0,this.lineno=1,this.lookahead=this.index<this.text.length?this.text[this.index]:null}isEof(){return this.lookahead===null}accept(){this.lookahead===`
`&&(this.lineno+=1);let y=this.lookahead;return this.index+=1,this.lookahead=this.index<this.text.length?this.text[this.index]:null,y}attempt(y){return this.lookahead!==y?!1:(this.accept(),!0)}expect(y){if(!this.attempt(y)){let t=new Me(this.filename,this.lineno);throw new ve(`Expected '${y}', but got ${this.lookahead}.`)}}skipWhitespace(){for(;!this.isEof()&&" 	".includes(this.lookahead);)this.accept()}};var gt=class{constructor(y,t){this.lexer=new St(y,t)}tokeniseAll(){let y=[];for(;;){let t=new Me(this.lexer.filename,this.lexer.lineno),n=this.tokenise(t);if(n.isEof()&&y.push(new Ce(Ce.EOL,"",t)),n.type!==Ce.COMMENT&&y.push(n),n.isEof())break}return y}tokenise(y){if(this.lexer.skipWhitespace(),this.lexer.isEof())return new Ce(Ce.EOF,"",y);let t=this.lexer.lookahead;return this.lexer.attempt(`
`)?new Ce(Ce.EOL,"",y):t==='"'?this.tokeniseString(y):t>="0"&&t<="9"?this.tokeniseNumber(y):/[a-zA-Z_]/.test(t)?this.tokeniseIdentifier(y):this.tokeniseOperator(y)}tokeniseOperator(y){let t=this.lexer.accept();if(t==="/"&&this.lexer.attempt("/")){let n="",a=this.lexer.lineno;for(;!this.lexer.isEof()&&!this.lexer.attempt(`
`);)n+=this.lexer.accept();return new Ce(Ce.COMMENT,n,a)}return"=-".includes(this.lexer.lookahead)&&(t+=this.lexer.accept()),new Ce(t,t,y)}tokeniseString(y){let t=this.lexer.accept(),n="";for(;this.lexer.lookahead!=t;)n+=this.lexer.accept();return this.lexer.expect(t),new Ce("STRING",n,y)}tokeniseIdentifier(y){let t="";for(;!this.lexer.isEof()&&/[a-zA-Z0-9_]/.test(this.lexer.lookahead);)t+=this.lexer.accept();return t.toUpperCase()===t?new Ce(t,t,y):new Ce("ID",t,y)}tokeniseNumber(y){let t="";for(;!this.lexer.isEof()&&/[0-9.]/.test(this.lexer.lookahead);)t+=this.lexer.accept();let n=parseFloat(t);return isNaN(n)?this.raiseError(`Invalid number: ${t}`,y):t.includes(".")?new Ce("REAL",n,y):new Ce("INT",n,y)}raiseError(y,t){throw new ve(y,t)}};var yt=class Y{static create(y){return new Y(y,0,y[0])}constructor(y,t,n){this.tokens=y,this.index=t,this.lookahead=n}clone(){return new Y(this.tokens,this.index,this.lookahead)}accept(){let y=this.lookahead;return this.lookahead.isEof()||(this.index+=1),this.lookahead=this.tokens[this.index],console.log(`Accepted ${y.type}... lookahead is ${this.lookahead.type}`),y}match(y){return this.lookahead.type===y}attempt(y){return this.lookahead.type!==y?!1:(this.lookahead!==Ce.EOF&&this.accept(),!0)}expect(y){if(!this.attempt(y))throw new ve(`Expected '${y}', but got ${this.lookahead}.`,this.lookahead.ref)}};function zt(Y,y){let n=new gt(Y,y).tokeniseAll();return yt.create(n)}var vt=class Y{constructor(y,t,n=null,a=null){if(this.ref=y,!(y instanceof Me))throw new Error(`Invalid ref: ${y}`);this.cmd=t,this.arg=n,this.children=a??[]}toLhs(y){let t=this.children.slice(0);if(t.push(y),this.cmd==="getLocal")return new Y(this.ref,"setLocal",this.arg,t);if(this.cmd==="getItem")return new Y(this.ref,"setItem",this.arg,t);if(this.cmd==="getAttribute")return new Y(this.ref,"setAttribute",this.arg,t);throw new UserCodeError("Invalid assignment",this.ref)}dump(y,t){let n=" ".repeat(t);this.arg!==null?n+=`${this.cmd} ${this.arg} (#${this.ref})`:n+=`${this.cmd} (#${this.ref})`,y.push(n);for(let a of this.children){if(!(a instanceof Y))throw new Error(`${a} is not a Node`);a.dump(y,t+1)}}toString(){let y=[];return this.dump(y,0),y.join(`
`)}};var Ke=class{isSubtypeOf(y){return this===y}initialise(){return null}format(y){return this.toString()}getItem(y,t){throw new UserCodeError("${this} is not indexable")}setItem(y,t,n){throw new UserCodeError("${this} is not indexable")}};var Be=class extends Ke{constructor(y,t=null){super(),this.name=y,this.parent=t}isSubtypeOf(y){return this===y?!0:this.parent!==null&&this.parent.isSubtypeOf(y)}format(y){switch(this.name){case"TYPE":return`TYPE ${y.name}`;case"VOID":return"VOID";case"NULL":return"NULL";case"BOOLEAN":return y?"TRUE":"FALSE";case"INTEGER":return y.toFixed(0);case"REAL":return y;case"CHAR":return`'${y}'`;case"STRING":return`"${y}"`;case"TUPLE":return`${y}`;case"CALLABLE":return`${y}`;default:throw new Error(`Unrecognised primitive type: ${this.name}.`)}}toString(){return`${this.name}`}};var $t=class extends Ke{constructor(y,t){super(),this.elementType=y,this.dimensions=t}initialise(){return{}}convertKey(y){let t=y.asTuple().map(a=>a.asInteger()),n=this.dimensions.length;if(t.length!==n)throw new ve(`Array has ${n} dimensions but index has ${y.length} dimensions`);for(let a=0;a<n;a+=1){let i=t[a],r=this.dimensions[a];if(i<r.min||i>r.max)throw new ve(`Dimension ${a} is out of range: ${i} is not between ${r.min} and ${r.max}`)}return t.join(",")}getItem(y,t){return t=this.convertKey(t),y[t]??null}setItem(y,t,n){if(!n.type.isSubtypeOf(this.elementType))throw new ve(`A value of type ${n.type} cannot be stored in an array of type ${this.elementType}`);t=this.convertKey(t),y[t]=n}toString(){return`ARRAY [${this.dimensions.map(t=>t.toString())}] OF ${this.elementType}`}};var wt=class{constructor(y,t){this.min=y,this.max=t}toString(){return`${this.min}:${this.max}`}};var xt=class extends Ke{constructor(y,t){super(),this.name=y,this.attributeMap=t}initialise(){return{}}convertKey(y){return y.asString()}getItem(y,t){let n=this.convertKey(t);if(!this.attributeMap[n])throw new ve(`${n} is not an attribute of the record type ${this}`);return y[n]??null}setItem(y,t,n){let a=this.convertKey(t),i=this.attributeMap[a];if(i){if(!n.type.isSubtypeOf(i))throw new ve(`Type ${n.type} cannot be stored in an attribute of type ${i}`)}else throw new ve(`${a} is not an attribute of the record type ${this}`);y[a]=n}toString(){return this.name}};var Qe=new Be("VOID"),jt=new Be("NULL"),rt=new Be("BOOLEAN"),Je=new Be("REAL"),nt=new Be("INTEGER",Je),st=new Be("CHAR"),at=new Be("STRING"),ot=new Be("CALLABLE"),lt=new Be("TYPE"),Et=new Be("TUPLE");function Pt(Y,y){let t=[];for(let n=1;n<y.length;n+=2){let a=y[n-1],i=y[n],r=new wt(a,i);t.push(r)}if(t.length===0)throw new UserCodeError("Arrays must have at least one dimension.");if(t.length>2)throw new UserCodeError("Arrays can have a maximum of two dimensions.");return new $t(Y,t)}function qt(Y,y){let t={};for(let n=1;n<y.length;n+=2){let a=y[n-1].asString(),i=y[n].asType();t[a]=i}return new xt(Y,t)}var pe=class Y{static fromJs(y){switch(typeof y){case"boolean":return Y.ofBoolean(y);case"string":return Y.ofString(y);case"number":return Y.ofNumber(y);case"function":return Y.ofCallable(y);default:return y!=null&&console.warn(`Value converted to null: ${y}`),Y.ofNull()}}static toJs(y){return y instanceof Y?y.value:y}static ofType(y){return new Y(lt,y)}static ofVoid(){return new Y(Qe,null)}static ofNull(){return new Y(jt,null)}static ofBoolean(y){return new Y(rt,y)}static ofInteger(y){return new Y(nt,y)}static ofReal(y){return new Y(Je,y)}static ofNumber(y){let t=(y|0)===y?nt:Je;return new Y(t,y)}static ofChar(y){return new Y(st,y)}static ofString(y){return new Y(at,y)}static ofTuple(y){return new Y(Et,y)}static ofUserType(y){return new Y(y,{})}static ofCallable(y){return new Y(ot,y)}constructor(y,t){if(y===void 0||t===void 0)throw new Error("Invalid value");this.type=y,this.value=t}isType(){return this.type===lt}isVoid(){return this.type===Qe}isNull(){return this.type===jt}isBoolean(){return this.type===rt}isInteger(){return this.type===nt}isReal(){return this.type===Je}isNumeric(){return this.isInteger()||this.isReal()}isChar(){return this.type===st}isString(){return this.type===at}isTuple(){return this.type===Et}isCallable(){return this.type===ot}as(y){if(this.type===y)return this.value;Ne(`${this} is not of type ${y}`)}asType(){return this.as(lt)}asBoolean(){return this.as(rt)}asInteger(){return this.as(nt)}asReal(){return this.as(Je)}asChar(){return this.as(st)}asString(){return this.as(at)}asTuple(){return this.as(Et)}asCallable(){return this.as(ot)}eq(y){return this.value===y.value}gt(y){return this.value>y.value}add(y){let t=Y.sharedNumericType(this,y);return new Y(t,this.value+y.value)}sub(y){let t=Y.sharedNumericType(this,y);return new Y(t,this.value-y.value)}mul(y){let t=Y.sharedNumericType(this,y);return new Y(t,this.value*y.value)}div(y){let t=Y.sharedNumericType(this,y);return y.value===0&&Ne("Division by zero."),new Y(t,this.value/y.value)}exp(y){let t=Y.sharedNumericType(this,y);return new Y(t,Math.pow(this.value,y.value))}neg(){return this.isNumeric()||Ne(`${this} is not a number.`),new Y(this.type,-this.value)}getItem(y){return this.type.getItem(this.value,y)}setItem(y,t){return this.type.setItem(this.value,y,t)}castString(){return this.isString()?this.asString():this.toString()}toString(){return this.type.format(this.value)}static sharedNumericType(y,t){return y.isNumeric()||Ne(`${y} is not a number.`),t.isNumeric()||Ne(`${t} is not a number.`),y.type===t.type?y.type:Je}};var it=class{constructor(y,t,n){if(this.ref=y,!(y instanceof Me))throw new Error(`Invalid ref: ${y}`);this.cmd=t,this.arg=n}toString(){return`${this.arg?`${this.cmd} ${this.arg}`:this.cmd} (${this.ref})`}};var mt=class Y{constructor(y,t=null,n=null,a=null,i=null){this.name=t??"Anonymous",this.returnType=n??Qe,this.parameterNames=a??[],this.parameterTypes=i??[],this.numParameters=this.parameterNames.length,this.instructions=y,this.length=y.length}isProcedure(){return this.returnType===Qe}prepare(y,t,n,a){return new Y(this.instructions,y,t,n,a)}validateCall(y){let t=this.parameterTypes,n=y.length;if(this.numParameters!==n)throw new UserCodeError(`${this.name} should be called with ${this.numParameters} arguments.`);for(let a=0;a<n;a+=1){let i=t[a],r=y[a].type;if(!r.isSubtypeOf(i)){let o=this.parameterNames[a];throw new UserCodeError(`Argument ${o} should be of type ${i} but you provided type ${r}.`)}}}validateReturn(y){y.type.isSubtypeOf(this.returnType)||Ne("Incorrect return type.")}getInstruction(y){return this.instructions[y]}dumpCode(){let y=[this.toString()];for(let t=0;t<this.instructions.length;t+=1){let n=`${t}`.padStart(4,"0"),a=this.instructions[t];y.push(`  ${n} ${a}`)}return y.push(this.isProcedure()?"ENDPROCEDURE":"ENDFUNCTION"),y.join(`
`)}toString(){let y=[];for(let n=0;n<this.numParameters;n+=1)y.push(`${this.parameterNames[n]} : ${this.parameterTypes[n]}`);let t=y.join(", ");return this.isProcedure()?`PROCEDURE ${this.name}(${t})`:`FUNCTION ${this.name}${t} RETURNS ${this.returnType}`}};var Tt=class{constructor(y,t,n=null){this.name=y,this.type=t,this.value=n,this.isConstant=!1}makeConstant(){return this.isConstant=!0,this}setValue(y){if(this.isConstant)throw new ve(`Cannot change the value of constant ${this.name}`);if(!y.type.isSubtypeOf(this.type))throw new ve(`${this} has type ${this.type} and cannot store type ${y.type}.`);return this.value=y,this}getValue(){if(this.value===null)throw new ve(`${this} has not been initialised with a value.`);return this.value}toString(){return this.name}};var bt=class Y{constructor(y,t=null){this.callable=y,this.parent=t,this.pc=0,this.stack=[],this.localVariables={}}run(){for(;;){let y=this.callable.getInstruction(this.pc),t=`op_${y.cmd}`,n=this[t];n||Ne(`'${t}' is not a valid instruction`);let a=this.stack.map(o=>o.toString()).join(" "),i=`${this.pc}`.padStart(4,"0");console.log(`${i}: ${y} [${a}]`);let r=n.call(this,y.arg);if(this.pc+=1,r!==void 0)return r}}push(y){this.stack.push(y)}pushNull(){this.stack.push(pe.ofNull())}pop(){let y=this.stack.pop();return y.isVoid()&&this.raiseVoidError(),y}raiseVoidError(){Ne("You must use CALL to call procedures.")}getLocalVariable(y){let t=this.localVariables[y];if(!t)throw new ve(`Variable ${y} not defined!`);return t}forceDeclareLocalVariable(y,t){let n=t.initialise(),a=n!==null?new pe(t,n):null,i=new Tt(y,t,a);return this.localVariables[y]=i,i}declareLocalVariable(y,t){if(this.localVariables[y])throw new ve(`Cannot declare ${y} as a prior definition exists!`);return this.forceDeclareLocalVariable(y,t)}setLocalVariable(y,t){let n=this.declareLocalVariable(y,t.type);return this.getLocalVariable(y).setValue(t),n}call(y,t){let n=new Y(y,this);y.validateCall(t);for(let a=0;a<y.numParameters;a+=1){let i=y.parameterNames[a],r=y.parameterTypes[a];n.declareLocalVariable(i,r).setValue(t[a])}return n}op_declareVariable(y){let t=this.pop().asType(),n=this.declareLocalVariable(y,t);this.pushNull()}op_declareConstant(y){let t=this.pop(),n=this.declareLocalVariable(y,t.type);n.setValue(t),n.makeConstant(),this.pushNull()}op_setLocal(y){let t=this.pop();this.getLocalVariable(y).setValue(t),this.pushNull()}op_autoSetLocal(y){let t=this.pop();this.forceDeclareLocalVariable(y,t.type).setValue(t),this.pushNull()}op_getLocal(y){let t=this.getLocalVariable(y);this.push(t.getValue())}op_newFunction(y){let t=this.pop().asTuple().map(o=>o.asType()),n=this.pop().asTuple().map(o=>o.asString()),a=this.pop().asType(),i=this.pop().asCallable().prepare(y,a,n,t);this.declareLocalVariable(y,ot).setValue(pe.ofCallable(i)),this.pushNull()}op_call(){let y=this.pop().asTuple(),t=this.pop().asCallable();return this.call(t,y)}op_convertVoid(){this.stack.pop().isVoid()||Ne("CALL must be used with procedures, not functions or expressions."),this.pushNull()}op_returnVoid(){let y=this.callable,t=pe.ofVoid();y.validateReturn(t);let n=this.parent;return n&&n.push(t),n}op_return(){let y=this.callable,t=this.pop();y.validateReturn(t);let n=this.parent;return n&&n.push(t),n}op_newRecord(y){let t=this.pop().asTuple(),n=qt(y,t),a=pe.ofType(n);this.declareLocalVariable(y,lt).setValue(a),this.push(a)}op_newArray(){let y=this.pop().asTuple().map(a=>a.asInteger()),t=this.pop().asType(),n=Pt(t,y);this.push(pe.ofType(n))}op_setItem(){let y=this.pop(),t=this.pop();this.pop().setItem(t,y),this.push(y)}op_setAttribute(y){let t=this.pop();this.pop().setItem(pe.ofString(y),t),this.push(t)}op_getItem(){let y=this.pop(),n=this.pop().getItem(y);n||Ne("Array location has not been initialised."),this.push(n)}op_getAttribute(y){let n=this.pop().getItem(pe.ofString(y));n||Ne(`No such attribute as ${y}.`),this.push(n)}op_output(){let t=this.pop().asTuple().map(n=>n.castString()).join(" ");return async function(n){return await n.rpc("output",t)}}op_input(){return async function(y){return await y.rpc("input")}}op_assert(){let y=this.pop();for(let t of y.asTuple())t.asBoolean()||Ne("Assert failed!");this.pushNull()}op_jt(y){this.pop().asBoolean()&&(this.pc=y-1)}op_jf(y){this.pop().asBoolean()||(this.pc=y-1)}op_jmp(y){return this.pc=y-1,this}op_push(y){this.push(y)}op_pop(){this.pop()}op_pack(y){let t=this.stack.splice(this.stack.length-y);for(let n of t)n.isVoid()&&this.raiseVoidError();this.push(pe.ofTuple(t))}op_within(){let y=this.pop().asInteger(),t=this.pop().asInteger(),n=this.pop().asInteger(),a=!1;y<t?a=n>=y&&n<=t:a=n>=t&&n<=y,this.push(pe.ofBoolean(a))}op_eq(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(t.eq(y)))}op_ne(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(!t.eq(y)))}op_ge(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(!y.gt(t)))}op_le(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(!t.gt(y)))}op_gt(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(t.gt(y)))}op_lt(){let y=this.pop(),t=this.pop();this.push(pe.ofBoolean(y.gt(t)))}op_add(){let y=this.pop(),t=this.pop();this.push(t.add(y))}op_sub(){let y=this.pop(),t=this.pop();this.push(t.sub(y))}op_mul(){let y=this.pop(),t=this.pop();this.push(t.mul(y))}op_div(){let y=this.pop(),t=this.pop();this.push(t.div(y))}op_exp(){let y=this.pop(),t=this.pop();this.push(t.exp(y))}op_neg(){let y=this.pop();this.push(y.neg())}op_booleanNot(){let y=this.pop().asBoolean();this.push(pe.ofBoolean(!y))}};var _t=class{constructor(y,t){this.config=y,this.rpc=t,this.scope=null}async run(y){this.scope=new bt(y);try{for(;this.scope!==null;){let t=this.scope.run();if(typeof t=="function"){let n=await t(this);this.scope.push(n)}else this.scope=t}}catch(t){if(console.log(t),!(this.scope&&t instanceof ve))throw t;let n=t.ref??this.scope.callable.getInstruction(this.scope.pc).ref;throw new ve(t.message,n)}}};var Ut=["EOF","ELSE","ENDIF","UNTIL","ENDWHILE","ENDCASE","NEXT","ENDPROCEDURE","ENDFUNCTION"],Nt=class{constructor(y){this.reader=y,this.uid=0}createVarName(y){return this.uid+=1,`${y}#${this.uid}`}parse(){let y=[];for(;!this.reader.lookahead.isEof();){let t=this.p_statement();y.push(t)}return this.mkBlk(...y)}p_block(){let y=[];for(;!Ut.includes(this.reader.lookahead.type);){let t=this.p_statement();y.push(t)}return this.mkBlk(...y)}p_statement(){let y=this.mkNop();if(this.match("DECLARE"))y=this.p_declare();else if(this.match("CONSTANT"))y=this.p_constant();else if(this.match("FUNCTION"))y=this.p_function();else if(this.match("PROCEDURE"))y=this.p_procedure();else if(this.match("TYPE"))y=this.p_defineRecord();else if(this.match("RETURN"))y=this.p_return();else if(this.match("IF"))y=this.p_if();else if(this.match("CASE"))y=this.p_case();else if(this.match("REPEAT"))y=this.p_repeat();else if(this.match("WHILE"))y=this.p_while();else if(this.match("FOR"))y=this.p_for();else if(this.match("OUTPUT"))y=this.p_output();else if(this.match("INPUT"))y=this.p_input();else if(this.match("ASSERT"))y=this.p_assert();else if(this.match("EOL"))y=this.mkNop();else if(this.match("CALL")){this.expect("CALL");let t=this.p_expr();y=this.mkENode("convertVoid",t)}else{y=this.p_expr(),this.expect("<-");let t=this.p_expr();y=y.toLhs(t)}return this.expect("EOL"),y}p_declare(){this.expect("DECLARE");let y=this.p_varName();this.expect(":");let t=this.p_type();return this.mkNode("declareVariable",y,t)}p_constant(){this.expect("CONSTANT");let y=this.p_varName();this.expect("=");let t=this.p_primitive();return this.mkNode("declareConstant",y,t)}p_defineRecord(){this.expect("TYPE"),this.attempt("EOL");let y=this.p_varName();this.expect("EOL");let t=[];for(;this.attempt("DECLARE");){let a=this.p_namedVariable();this.expect(":");let i=this.p_type();this.expect("EOL"),t.push(a,i)}this.expect("ENDTYPE","EOL");let n=this.mkENode("pack",...t);return this.mkNode("newRecord",y,n)}p_procedure(){this.expect("PROCEDURE");let y=this.p_varName(),{parameterNames:t,parameterTypes:n}=this.p_parameterList(),a=this.mkNode("push",pe.ofType(Qe));this.expect("EOL");let i=this.p_block();return this.expect("ENDPROCEDURE"),this.mkNode("newFunction",y,i,a,t,n)}p_function(){this.expect("FUNCTION");let y=this.p_varName(),{parameterNames:t,parameterTypes:n}=this.p_parameterList();this.expect("RETURNS");let a=this.p_type();this.expect("EOL");let i=this.p_block();return this.expect("ENDFUNCTION"),this.mkNode("newFunction",y,i,a,t,n)}p_return(){this.expect("RETURN");let y=this.p_expr();return this.mkENode("return",y)}p_output(){this.expect("OUTPUT");let y=this.p_bareExpressionList();return this.mkENode("output",y)}p_input(){this.expect("INPUT");let y=this.mkENode("input");return this.p_expr().toLhs(y)}p_assert(){this.expect("ASSERT");let y=this.p_bareExpressionList();return this.mkENode("assert",y)}p_if(){this.expect("IF");let y=this.p_expr();this.attempt("EOL"),this.expect("THEN","EOL");let t=this.p_block(),n=this.mkBlk();return this.attempt("ELSE")&&(this.expect("EOL"),n=this.p_block()),this.expect("ENDIF"),this.mkENode("ifelse",y,t,n)}p_case(){this.expect("CASE","OF");let y=this.createVarName("case"),t=this.p_expr(),n=this.autoSetLocal(y,t);this.expect("EOL");let a=[],i=this.mkNop();for(;!Ut.includes(this.reader.lookahead.type);)if(this.attempt("OTHERWISE")){this.attempt(":"),i=this.p_statement();break}else{let o=this.p_expr();this.expect(":");let p=this.p_statement(),w=this.mkENode("eq",this.getLocal(y),o);a.push({condition:w,block:p})}this.expect("ENDCASE");let r=i;for(;a.length>0;){let o=a.pop();r=this.mkENode("ifelse",o.condition,o.block,r)}return this.mkBlk(n,r)}p_repeat(){this.expect("REPEAT","EOL");let y=this.p_block();this.expect("UNTIL");let t=this.p_expr();return this.expect("EOL"),this.mkENode("repeat",y,t)}p_while(){this.expect("WHILE");let y=this.p_expr();this.expect("DO","EOL");let t=this.p_block();return this.expect("ENDWHILE","EOL"),this.mkENode("while",y,t)}p_for(){let y=[];this.expect("FOR");let t=this.p_varName();this.expect("<-");let n=this.p_expr();this.expect("TO");let a=this.p_expr(),i=this.mkNode("push",pe.ofInteger(1));this.attempt("STEP")&&(i=this.p_expr()),this.expect("EOL");let r=this.createVarName("start"),o=this.autoSetLocal(r,n),p=this.createVarName("limit"),w=this.autoSetLocal(p,a),T=this.createVarName("step"),A=this.autoSetLocal(T,i),S=this.setLocal(t,this.getLocal(r)),O=this.mkBlk(o,w,A,S),D=this.mkENode("within",this.getLocal(t),this.getLocal(r),this.getLocal(p)),B=this.setLocal(t,this.mkENode("add",this.getLocal(t),this.getLocal(T))),F=this.p_block(),s=this.mkENode("while",D,this.mkBlk(F,B)),v=this.mkBlk(O,s);this.expect("NEXT");let N=this.p_varName();if(this.expect("EOL"),t!==N)throw new UserCodeError(`FOR ${t} doesn't match with NEXT ${N}`);return v}p_parenthesisedExpressionList(){let y=[];if(this.expect("("),!this.match(")"))do y.push(this.p_expr());while(this.attempt(","));return this.expect(")"),this.mkENode("pack",...y)}p_bareExpressionList(){let y=[this.p_expr()];for(;this.attempt(",");){let t=this.p_expr();y.push(t)}return this.mkENode("pack",...y)}p_expr(){return this.p_relational()}p_relational(){let y=this.p_additive();for(;;)if(this.attempt("=")){let t=this.p_additive();y=this.mkENode("eq",y,t)}else if(this.attempt("<>")){let t=this.p_additive();y=this.mkENode("ne",y,t)}else if(this.attempt(">")){let t=this.p_additive();y=this.mkENode("gt",y,t)}else if(this.attempt("<")){let t=this.p_additive();y=this.mkENode("lt",y,t)}else if(this.attempt(">=")){let t=this.p_additive();y=this.mkENode("ge",y,t)}else if(this.attempt("<=")){let t=this.p_additive();y=this.mkENode("le",y,t)}else break;return y}p_additive(){let y=this.p_multiplicative();for(;;)if(this.attempt("+")){let t=this.p_multiplicative();y=this.mkENode("add",y,t)}else if(this.attempt("-")){let t=this.p_multiplicative();y=this.mkENode("sub",y,t)}else break;return y}p_multiplicative(){let y=this.p_postfix();for(;;)if(this.attempt("*")){let t=this.p_postfix();y=this.mkENode("mul",y,t)}else if(this.attempt("/")){let t=this.p_postfix();y=this.mkENode("div",y,t)}else break;return y}p_postfix(){let y=this.p_prefix();for(;;)if(this.match("(")){let t=this.p_parenthesisedExpressionList();y=this.mkENode("call",y,t)}else if(this.attempt("[")){let t=this.p_bareExpressionList();this.expect("]"),y=this.mkENode("getItem",y,t)}else if(this.attempt(".")){let t=this.p_varName();y=this.mkNode("getAttribute",t,y)}else if(this.attempt("^"))y=this.mkENode("exp",y,this.p_postfix());else break;return y}p_prefix(){return this.attempt("-")?this.mkENode("neg",this.p_prefix()):this.attempt("NOT")?this.mkENode("booleanNot",this.p_prefix()):this.p_primitive()}p_primitive(){if(this.attempt("(")){let y=this.p_expr();return this.expect(")"),y}else switch(this.reader.lookahead.type){case"STRING":return this.mkNode("push",pe.ofString(this.accept()));case"INT":return this.mkNode("push",pe.ofInteger(this.accept()));case"REAL":return this.mkNode("push",pe.ofReal(this.accept()));case"ID":return this.getLocal(this.p_varName())}Ne("Invalid primitive")}p_parameterList(){let y=[],t=[];if(this.reader.expect("("),!this.reader.match(")"))do y.push(this.p_namedVariable()),this.expect(":"),t.push(this.p_type());while(this.reader.attempt(","));return this.reader.expect(")"),{parameterNames:this.mkENode("pack",...y),parameterTypes:this.mkENode("pack",...t)}}p_namedVariable(){if(this.reader.match("ID"))return this.mkNode("push",pe.ofString(this.accept()));Ne("Invalid variable name")}p_varName(){if(this.reader.match("ID"))return this.accept();Ne("Invalid variable name")}p_type(){if(this.attempt("NULL"))return this.mkNode("push",pe.ofNull);if(this.attempt("BOOLEAN"))return this.mkNode("push",pe.ofType(rt));if(this.attempt("INTEGER"))return this.mkNode("push",pe.ofType(nt));if(this.attempt("REAL"))return this.mkNode("push",pe.ofType(Je));if(this.attempt("CHAR"))return this.mkNode("push",pe.ofType(st));if(this.attempt("STRING"))return this.mkNode("push",pe.ofType(at));if(this.attempt("ARRAY")){this.expect("[");let y=this.p_array_dimensions();this.expect("]"),this.expect("OF");let t=this.p_type();return this.mkENode("newArray",t,y)}else{if(this.match("ID"))return this.getLocal(this.p_varName());Ne("Invalid type name")}}p_array_dimensions(){let y=[];do{let t=this.p_primitive();this.expect(":");let n=this.p_primitive();y.push(t,n)}while(this.attempt(","));return this.mkENode("pack",...y)}getRef(){return this.reader.lookahead.ref}autoSetLocal(y,t){if(typeof y!="string")throw new Error;return this.mkNode("autoSetLocal",y,t)}setLocal(y,t){if(typeof y!="string")throw new Error;return this.mkNode("setLocal",y,t)}getLocal(y){if(typeof y!="string")throw new Error;return this.mkNode("getLocal",y)}mkBlk(...y){let t=y.filter(n=>n.cmd!=="nop");return this.mkNode("blk",null,...t)}mkNop(){return this.mkNode("nop")}mkENode(y,...t){return this.mkNode(y,null,...t)}mkNode(y,t=null,...n){return new vt(this.getRef(),y,t,n)}expect(...y){for(let t of y)this.reader.attempt(t)||Ne(`Expected ${t}`)}attempt(...y){for(let t of y)if(!this.reader.attempt(t))return!1;return!0}accept(){return this.reader.accept().value}match(y){return this.reader.match(y)}};function Gt(Y){return new Nt(Y).parse()}var It=class Y{constructor(y){this.ref=y,this.instructions=[],this.labels=new Map}build(){let y=this.patch();return new mt(y)}createLabel(){let y=`label${this.labels.size}`;return this.labels.set(y,null),y}setLabel(y){return this.labels.set(y,this.instructions.length),this}walkExprs(y){for(let t of y)this.walk(t);return this}walkStatements(y,t){if(t.length===0)this.emit(y,"push",pe.ofNull());else{this.walk(t[0]);for(let n of t.slice(1))this.emit(n.ref,"pop").walk(n)}return this}walk(y){let t=y.ref;switch(y.cmd){case"push":return this.emit(t,"push",y.arg);case"blk":return this.walkStatements(t,y.children);case"ifelse":{let i=this.createLabel(),r=this.createLabel();return this.walk(y.children[0]),this.emit(t,"jf",i).walk(y.children[1]).emit(t,"jmp",r),this.setLabel(i).walk(y.children[2]).setLabel(r)}case"repeat":{let i=this.createLabel();return this.setLabel(i).walk(y.children[0]),this.emit(t,"pop").walk(y.children[1]),this.emit(t,"jf",i).emit(t,"push",pe.ofNull())}case"while":{let i=this.createLabel(),r=this.createLabel();return this.setLabel(i).walk(y.children[0]),this.emit(t,"jf",r),this.walk(y.children[1]).emit(t,"pop").emit(t,"jmp",i),this.setLabel(r).emit(t,"push",pe.ofNull())}case"pack":return this.walkExprs(y.children).emit(t,"pack",y.children.length);case"newFunction":let n=new Y(t);n.walk(y.children[0]);let a=n.build();return this.emit(t,"push",pe.ofCallable(a)),this.walkExprs(y.children.slice(1)),this.emit(t,"newFunction",y.arg);default:return this.walkExprs(y.children).emit(t,y.cmd,y.arg)}}emit(y,t,n=null){return this.instructions.push(new it(y,t,n)),this}patch(){let y=["jt","jf","jmp"],t=[];for(let n of this.instructions)if(y.includes(n.cmd)){let a=this.labels.get(n.arg);t.push(new it(n.ref,n.cmd,a))}else t.push(n);return t.push(new it(this.ref,"returnVoid")),t}};function Vt(Y,y="main"){let t=new Me(y,1),n=new It(t);return n.walk(Y),n.build()}async function Ht(Y,y,t,n){let a=zt(y,Y),i=Gt(a);console.log(`TREE:
`),console.log(i.toString());let r=Vt(i);console.log(`
CODE:
`),console.log(r.toString());async function o(w,...T){w=pe.toJs(w),T=T.map(S=>pe.toJs(S));let A=await n(w,...T);return pe.fromJs(A)}await new _t(t,o).run(r)}(function(Y){var y={};function t(n){if(y[n])return y[n].exports;var a=y[n]={i:n,l:!1,exports:{}};return Y[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}return t.m=Y,t.c=y,t.d=function(n,a,i){t.o(n,a)||Object.defineProperty(n,a,{enumerable:!0,get:i})},t.r=function(n){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,a){if(a&1&&(n=t(n)),a&8||a&4&&typeof n=="object"&&n&&n.__esModule)return n;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:n}),a&2&&typeof n!="string")for(var r in n)t.d(i,r,function(o){return n[o]}.bind(null,r));return i},t.n=function(n){var a=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(a,"a",a),a},t.o=function(n,a){return Object.prototype.hasOwnProperty.call(n,a)},t.p="",t(t.s="./src/main.js")})({"./gen/astnodes.js":(function(Y,y){Sk.astnodes={},Sk.astnodes.Load=function(){},Sk.astnodes.Store=function(){},Sk.astnodes.Del=function(){},Sk.astnodes.AugLoad=function(){},Sk.astnodes.AugStore=function(){},Sk.astnodes.Param=function(){},Sk.astnodes.And=function(){},Sk.astnodes.Or=function(){},Sk.astnodes.Add=function(){},Sk.astnodes.Sub=function(){},Sk.astnodes.Mult=function(){},Sk.astnodes.MatMult=function(){},Sk.astnodes.Div=function(){},Sk.astnodes.Mod=function(){},Sk.astnodes.Pow=function(){},Sk.astnodes.LShift=function(){},Sk.astnodes.RShift=function(){},Sk.astnodes.BitOr=function(){},Sk.astnodes.BitXor=function(){},Sk.astnodes.BitAnd=function(){},Sk.astnodes.FloorDiv=function(){},Sk.astnodes.Invert=function(){},Sk.astnodes.Not=function(){},Sk.astnodes.UAdd=function(){},Sk.astnodes.USub=function(){},Sk.astnodes.Eq=function(){},Sk.astnodes.NotEq=function(){},Sk.astnodes.Lt=function(){},Sk.astnodes.LtE=function(){},Sk.astnodes.Gt=function(){},Sk.astnodes.GtE=function(){},Sk.astnodes.Is=function(){},Sk.astnodes.IsNot=function(){},Sk.astnodes.In=function(){},Sk.astnodes.NotIn=function(){},Sk.astnodes.Module=function(n,a){return this.body=n,this.docstring=a,this},Sk.astnodes.Interactive=function(n){return this.body=n,this},Sk.astnodes.Expression=function(n){return this.body=n,this},Sk.astnodes.Suite=function(n){return this.body=n,this},Sk.astnodes.FunctionDef=function(n,a,i,r,o,p,w,T){return Sk.asserts.assert(w!=null),Sk.asserts.assert(T!=null),this.name=n,this.args=a,this.body=i,this.decorator_list=r,this.returns=o,this.docstring=p,this.lineno=w,this.col_offset=T,this},Sk.astnodes.AsyncFunctionDef=function(n,a,i,r,o,p,w,T){return Sk.asserts.assert(w!=null),Sk.asserts.assert(T!=null),this.name=n,this.args=a,this.body=i,this.decorator_list=r,this.returns=o,this.docstring=p,this.lineno=w,this.col_offset=T,this},Sk.astnodes.ClassDef=function(n,a,i,r,o,p,w,T){return Sk.asserts.assert(w!=null),Sk.asserts.assert(T!=null),this.name=n,this.bases=a,this.keywords=i,this.body=r,this.decorator_list=o,this.docstring=p,this.lineno=w,this.col_offset=T,this},Sk.astnodes.Return=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Delete=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.targets=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Assign=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.targets=n,this.value=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.AugAssign=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.target=n,this.op=a,this.value=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.AnnAssign=function(n,a,i,r,o,p){return Sk.asserts.assert(o!=null),Sk.asserts.assert(p!=null),this.target=n,this.annotation=a,this.value=i,this.simple=r,this.lineno=o,this.col_offset=p,this},Sk.astnodes.For=function(n,a,i,r,o,p){return Sk.asserts.assert(o!=null),Sk.asserts.assert(p!=null),this.target=n,this.iter=a,this.body=i,this.orelse=r,this.lineno=o,this.col_offset=p,this},Sk.astnodes.AsyncFor=function(n,a,i,r,o,p){return Sk.asserts.assert(o!=null),Sk.asserts.assert(p!=null),this.target=n,this.iter=a,this.body=i,this.orelse=r,this.lineno=o,this.col_offset=p,this},Sk.astnodes.While=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.test=n,this.body=a,this.orelse=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.If=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.test=n,this.body=a,this.orelse=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.With=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.items=n,this.body=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.AsyncWith=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.items=n,this.body=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Raise=function(n,a,i,r,o,p){return Sk.asserts.assert(o!=null),Sk.asserts.assert(p!=null),this.exc=n,this.cause=a,this.inst=i,this.tback=r,this.lineno=o,this.col_offset=p,this},Sk.astnodes.Try=function(n,a,i,r,o,p){return Sk.asserts.assert(o!=null),Sk.asserts.assert(p!=null),this.body=n,this.handlers=a,this.orelse=i,this.finalbody=r,this.lineno=o,this.col_offset=p,this},Sk.astnodes.Assert=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.test=n,this.msg=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Import=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.names=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.ImportFrom=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.module=n,this.names=a,this.level=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Global=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.names=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Nonlocal=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.names=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Expr=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Pass=function(n,a){return Sk.asserts.assert(n!=null),Sk.asserts.assert(a!=null),this.lineno=n,this.col_offset=a,this},Sk.astnodes.Break=function(n,a){return Sk.asserts.assert(n!=null),Sk.asserts.assert(a!=null),this.lineno=n,this.col_offset=a,this},Sk.astnodes.Continue=function(n,a){return Sk.asserts.assert(n!=null),Sk.asserts.assert(a!=null),this.lineno=n,this.col_offset=a,this},Sk.astnodes.Print=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.dest=n,this.values=a,this.nl=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Debugger=function(n,a){return Sk.asserts.assert(n!=null),Sk.asserts.assert(a!=null),this.lineno=n,this.col_offset=a,this},Sk.astnodes.BoolOp=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.op=n,this.values=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.BinOp=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.left=n,this.op=a,this.right=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.UnaryOp=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.op=n,this.operand=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Lambda=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.args=n,this.body=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.IfExp=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.test=n,this.body=a,this.orelse=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Dict=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.keys=n,this.values=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Set=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.elts=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.ListComp=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.elt=n,this.generators=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.SetComp=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.elt=n,this.generators=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.DictComp=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.key=n,this.value=a,this.generators=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.GeneratorExp=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.elt=n,this.generators=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Await=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Yield=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.YieldFrom=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Compare=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.left=n,this.ops=a,this.comparators=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Call=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.func=n,this.args=a,this.keywords=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Num=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.n=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Str=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.s=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.FormattedValue=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.value=n,this.conversion=a,this.format_spec=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.JoinedStr=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.values=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Bytes=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.s=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.NameConstant=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Ellipsis=function(n,a){return Sk.asserts.assert(n!=null),Sk.asserts.assert(a!=null),this.lineno=n,this.col_offset=a,this},Sk.astnodes.Constant=function(n,a,i){return Sk.asserts.assert(a!=null),Sk.asserts.assert(i!=null),this.value=n,this.lineno=a,this.col_offset=i,this},Sk.astnodes.Attribute=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.value=n,this.attr=a,this.ctx=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Subscript=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.value=n,this.slice=a,this.ctx=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.Starred=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.value=n,this.ctx=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Name=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.id=n,this.ctx=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.List=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.elts=n,this.ctx=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Tuple=function(n,a,i,r){return Sk.asserts.assert(i!=null),Sk.asserts.assert(r!=null),this.elts=n,this.ctx=a,this.lineno=i,this.col_offset=r,this},Sk.astnodes.Slice=function(n,a,i){return this.lower=n,this.upper=a,this.step=i,this},Sk.astnodes.ExtSlice=function(n){return this.dims=n,this},Sk.astnodes.Index=function(n){return this.value=n,this},Sk.astnodes.comprehension=function(n,a,i,r){return this.target=n,this.iter=a,this.ifs=i,this.is_async=r,this},Sk.astnodes.ExceptHandler=function(n,a,i,r,o){return Sk.asserts.assert(r!=null),Sk.asserts.assert(o!=null),this.type=n,this.name=a,this.body=i,this.lineno=r,this.col_offset=o,this},Sk.astnodes.arguments_=function(n,a,i,r,o,p){return this.args=n,this.vararg=a,this.kwonlyargs=i,this.kw_defaults=r,this.kwarg=o,this.defaults=p,this},Sk.astnodes.arg=function(t,n){return this.arg=t,this.annotation=n,this},Sk.astnodes.keyword=function(n,a){return this.arg=n,this.value=a,this},Sk.astnodes.alias=function(n,a){return this.name=n,this.asname=a,this},Sk.astnodes.withitem=function(n,a){return this.context_expr=n,this.optional_vars=a,this},Sk.astnodes.Module.prototype._astname="Module",Sk.astnodes.Module.prototype._fields=["body",function(t){return t.body},"docstring",function(t){return t.docstring}],Sk.astnodes.Interactive.prototype._astname="Interactive",Sk.astnodes.Interactive.prototype._fields=["body",function(t){return t.body}],Sk.astnodes.Expression.prototype._astname="Expression",Sk.astnodes.Expression.prototype._fields=["body",function(t){return t.body}],Sk.astnodes.Suite.prototype._astname="Suite",Sk.astnodes.Suite.prototype._fields=["body",function(t){return t.body}],Sk.astnodes.FunctionDef.prototype._astname="FunctionDef",Sk.astnodes.FunctionDef.prototype._fields=["name",function(t){return t.name},"args",function(t){return t.args},"body",function(t){return t.body},"decorator_list",function(t){return t.decorator_list},"returns",function(t){return t.returns},"docstring",function(t){return t.docstring}],Sk.astnodes.AsyncFunctionDef.prototype._astname="AsyncFunctionDef",Sk.astnodes.AsyncFunctionDef.prototype._fields=["name",function(t){return t.name},"args",function(t){return t.args},"body",function(t){return t.body},"decorator_list",function(t){return t.decorator_list},"returns",function(t){return t.returns},"docstring",function(t){return t.docstring}],Sk.astnodes.ClassDef.prototype._astname="ClassDef",Sk.astnodes.ClassDef.prototype._fields=["name",function(t){return t.name},"bases",function(t){return t.bases},"keywords",function(t){return t.keywords},"body",function(t){return t.body},"decorator_list",function(t){return t.decorator_list},"docstring",function(t){return t.docstring}],Sk.astnodes.Return.prototype._astname="Return",Sk.astnodes.Return.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Delete.prototype._astname="Delete",Sk.astnodes.Delete.prototype._fields=["targets",function(t){return t.targets}],Sk.astnodes.Assign.prototype._astname="Assign",Sk.astnodes.Assign.prototype._fields=["targets",function(t){return t.targets},"value",function(t){return t.value}],Sk.astnodes.AugAssign.prototype._astname="AugAssign",Sk.astnodes.AugAssign.prototype._fields=["target",function(t){return t.target},"op",function(t){return t.op},"value",function(t){return t.value}],Sk.astnodes.AnnAssign.prototype._astname="AnnAssign",Sk.astnodes.AnnAssign.prototype._fields=["target",function(t){return t.target},"annotation",function(t){return t.annotation},"value",function(t){return t.value},"simple",function(t){return t.simple}],Sk.astnodes.For.prototype._astname="For",Sk.astnodes.For.prototype._fields=["target",function(t){return t.target},"iter",function(t){return t.iter},"body",function(t){return t.body},"orelse",function(t){return t.orelse}],Sk.astnodes.AsyncFor.prototype._astname="AsyncFor",Sk.astnodes.AsyncFor.prototype._fields=["target",function(t){return t.target},"iter",function(t){return t.iter},"body",function(t){return t.body},"orelse",function(t){return t.orelse}],Sk.astnodes.While.prototype._astname="While",Sk.astnodes.While.prototype._fields=["test",function(t){return t.test},"body",function(t){return t.body},"orelse",function(t){return t.orelse}],Sk.astnodes.If.prototype._astname="If",Sk.astnodes.If.prototype._fields=["test",function(t){return t.test},"body",function(t){return t.body},"orelse",function(t){return t.orelse}],Sk.astnodes.With.prototype._astname="With",Sk.astnodes.With.prototype._fields=["items",function(t){return t.items},"body",function(t){return t.body}],Sk.astnodes.AsyncWith.prototype._astname="AsyncWith",Sk.astnodes.AsyncWith.prototype._fields=["items",function(t){return t.items},"body",function(t){return t.body}],Sk.astnodes.Raise.prototype._astname="Raise",Sk.astnodes.Raise.prototype._fields=["exc",function(t){return t.exc},"cause",function(t){return t.cause},"inst",function(t){return t.inst},"tback",function(t){return t.tback}],Sk.astnodes.Try.prototype._astname="Try",Sk.astnodes.Try.prototype._fields=["body",function(t){return t.body},"handlers",function(t){return t.handlers},"orelse",function(t){return t.orelse},"finalbody",function(t){return t.finalbody}],Sk.astnodes.Assert.prototype._astname="Assert",Sk.astnodes.Assert.prototype._fields=["test",function(t){return t.test},"msg",function(t){return t.msg}],Sk.astnodes.Import.prototype._astname="Import",Sk.astnodes.Import.prototype._fields=["names",function(t){return t.names}],Sk.astnodes.ImportFrom.prototype._astname="ImportFrom",Sk.astnodes.ImportFrom.prototype._fields=["module",function(t){return t.module},"names",function(t){return t.names},"level",function(t){return t.level}],Sk.astnodes.Global.prototype._astname="Global",Sk.astnodes.Global.prototype._fields=["names",function(t){return t.names}],Sk.astnodes.Nonlocal.prototype._astname="Nonlocal",Sk.astnodes.Nonlocal.prototype._fields=["names",function(t){return t.names}],Sk.astnodes.Expr.prototype._astname="Expr",Sk.astnodes.Expr.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Pass.prototype._astname="Pass",Sk.astnodes.Pass.prototype._fields=[],Sk.astnodes.Break.prototype._astname="Break",Sk.astnodes.Break.prototype._fields=[],Sk.astnodes.Continue.prototype._astname="Continue",Sk.astnodes.Continue.prototype._fields=[],Sk.astnodes.Print.prototype._astname="Print",Sk.astnodes.Print.prototype._fields=["dest",function(t){return t.dest},"values",function(t){return t.values},"nl",function(t){return t.nl}],Sk.astnodes.Debugger.prototype._astname="Debugger",Sk.astnodes.Debugger.prototype._fields=[],Sk.astnodes.BoolOp.prototype._astname="BoolOp",Sk.astnodes.BoolOp.prototype._fields=["op",function(t){return t.op},"values",function(t){return t.values}],Sk.astnodes.BinOp.prototype._astname="BinOp",Sk.astnodes.BinOp.prototype._fields=["left",function(t){return t.left},"op",function(t){return t.op},"right",function(t){return t.right}],Sk.astnodes.UnaryOp.prototype._astname="UnaryOp",Sk.astnodes.UnaryOp.prototype._fields=["op",function(t){return t.op},"operand",function(t){return t.operand}],Sk.astnodes.Lambda.prototype._astname="Lambda",Sk.astnodes.Lambda.prototype._fields=["args",function(t){return t.args},"body",function(t){return t.body}],Sk.astnodes.IfExp.prototype._astname="IfExp",Sk.astnodes.IfExp.prototype._fields=["test",function(t){return t.test},"body",function(t){return t.body},"orelse",function(t){return t.orelse}],Sk.astnodes.Dict.prototype._astname="Dict",Sk.astnodes.Dict.prototype._fields=["keys",function(t){return t.keys},"values",function(t){return t.values}],Sk.astnodes.Set.prototype._astname="Set",Sk.astnodes.Set.prototype._fields=["elts",function(t){return t.elts}],Sk.astnodes.ListComp.prototype._astname="ListComp",Sk.astnodes.ListComp.prototype._fields=["elt",function(t){return t.elt},"generators",function(t){return t.generators}],Sk.astnodes.SetComp.prototype._astname="SetComp",Sk.astnodes.SetComp.prototype._fields=["elt",function(t){return t.elt},"generators",function(t){return t.generators}],Sk.astnodes.DictComp.prototype._astname="DictComp",Sk.astnodes.DictComp.prototype._fields=["key",function(t){return t.key},"value",function(t){return t.value},"generators",function(t){return t.generators}],Sk.astnodes.GeneratorExp.prototype._astname="GeneratorExp",Sk.astnodes.GeneratorExp.prototype._fields=["elt",function(t){return t.elt},"generators",function(t){return t.generators}],Sk.astnodes.Await.prototype._astname="Await",Sk.astnodes.Await.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Yield.prototype._astname="Yield",Sk.astnodes.Yield.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.YieldFrom.prototype._astname="YieldFrom",Sk.astnodes.YieldFrom.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Compare.prototype._astname="Compare",Sk.astnodes.Compare.prototype._fields=["left",function(t){return t.left},"ops",function(t){return t.ops},"comparators",function(t){return t.comparators}],Sk.astnodes.Call.prototype._astname="Call",Sk.astnodes.Call.prototype._fields=["func",function(t){return t.func},"args",function(t){return t.args},"keywords",function(t){return t.keywords}],Sk.astnodes.Num.prototype._astname="Num",Sk.astnodes.Num.prototype._fields=["n",function(t){return t.n}],Sk.astnodes.Str.prototype._astname="Str",Sk.astnodes.Str.prototype._fields=["s",function(t){return t.s}],Sk.astnodes.FormattedValue.prototype._astname="FormattedValue",Sk.astnodes.FormattedValue.prototype._fields=["value",function(t){return t.value},"conversion",function(t){return t.conversion},"format_spec",function(t){return t.format_spec}],Sk.astnodes.JoinedStr.prototype._astname="JoinedStr",Sk.astnodes.JoinedStr.prototype._fields=["values",function(t){return t.values}],Sk.astnodes.Bytes.prototype._astname="Bytes",Sk.astnodes.Bytes.prototype._fields=["s",function(t){return t.s}],Sk.astnodes.NameConstant.prototype._astname="NameConstant",Sk.astnodes.NameConstant.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Ellipsis.prototype._astname="Ellipsis",Sk.astnodes.Ellipsis.prototype._fields=[],Sk.astnodes.Constant.prototype._astname="Constant",Sk.astnodes.Constant.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.Attribute.prototype._astname="Attribute",Sk.astnodes.Attribute.prototype._fields=["value",function(t){return t.value},"attr",function(t){return t.attr},"ctx",function(t){return t.ctx}],Sk.astnodes.Subscript.prototype._astname="Subscript",Sk.astnodes.Subscript.prototype._fields=["value",function(t){return t.value},"slice",function(t){return t.slice},"ctx",function(t){return t.ctx}],Sk.astnodes.Starred.prototype._astname="Starred",Sk.astnodes.Starred.prototype._fields=["value",function(t){return t.value},"ctx",function(t){return t.ctx}],Sk.astnodes.Name.prototype._astname="Name",Sk.astnodes.Name.prototype._fields=["id",function(t){return t.id},"ctx",function(t){return t.ctx}],Sk.astnodes.List.prototype._astname="List",Sk.astnodes.List.prototype._fields=["elts",function(t){return t.elts},"ctx",function(t){return t.ctx}],Sk.astnodes.Tuple.prototype._astname="Tuple",Sk.astnodes.Tuple.prototype._fields=["elts",function(t){return t.elts},"ctx",function(t){return t.ctx}],Sk.astnodes.Load.prototype._astname="Load",Sk.astnodes.Load.prototype._isenum=!0,Sk.astnodes.Store.prototype._astname="Store",Sk.astnodes.Store.prototype._isenum=!0,Sk.astnodes.Del.prototype._astname="Del",Sk.astnodes.Del.prototype._isenum=!0,Sk.astnodes.AugLoad.prototype._astname="AugLoad",Sk.astnodes.AugLoad.prototype._isenum=!0,Sk.astnodes.AugStore.prototype._astname="AugStore",Sk.astnodes.AugStore.prototype._isenum=!0,Sk.astnodes.Param.prototype._astname="Param",Sk.astnodes.Param.prototype._isenum=!0,Sk.astnodes.Slice.prototype._astname="Slice",Sk.astnodes.Slice.prototype._fields=["lower",function(t){return t.lower},"upper",function(t){return t.upper},"step",function(t){return t.step}],Sk.astnodes.ExtSlice.prototype._astname="ExtSlice",Sk.astnodes.ExtSlice.prototype._fields=["dims",function(t){return t.dims}],Sk.astnodes.Index.prototype._astname="Index",Sk.astnodes.Index.prototype._fields=["value",function(t){return t.value}],Sk.astnodes.And.prototype._astname="And",Sk.astnodes.And.prototype._isenum=!0,Sk.astnodes.Or.prototype._astname="Or",Sk.astnodes.Or.prototype._isenum=!0,Sk.astnodes.Add.prototype._astname="Add",Sk.astnodes.Add.prototype._isenum=!0,Sk.astnodes.Sub.prototype._astname="Sub",Sk.astnodes.Sub.prototype._isenum=!0,Sk.astnodes.Mult.prototype._astname="Mult",Sk.astnodes.Mult.prototype._isenum=!0,Sk.astnodes.MatMult.prototype._astname="MatMult",Sk.astnodes.MatMult.prototype._isenum=!0,Sk.astnodes.Div.prototype._astname="Div",Sk.astnodes.Div.prototype._isenum=!0,Sk.astnodes.Mod.prototype._astname="Mod",Sk.astnodes.Mod.prototype._isenum=!0,Sk.astnodes.Pow.prototype._astname="Pow",Sk.astnodes.Pow.prototype._isenum=!0,Sk.astnodes.LShift.prototype._astname="LShift",Sk.astnodes.LShift.prototype._isenum=!0,Sk.astnodes.RShift.prototype._astname="RShift",Sk.astnodes.RShift.prototype._isenum=!0,Sk.astnodes.BitOr.prototype._astname="BitOr",Sk.astnodes.BitOr.prototype._isenum=!0,Sk.astnodes.BitXor.prototype._astname="BitXor",Sk.astnodes.BitXor.prototype._isenum=!0,Sk.astnodes.BitAnd.prototype._astname="BitAnd",Sk.astnodes.BitAnd.prototype._isenum=!0,Sk.astnodes.FloorDiv.prototype._astname="FloorDiv",Sk.astnodes.FloorDiv.prototype._isenum=!0,Sk.astnodes.Invert.prototype._astname="Invert",Sk.astnodes.Invert.prototype._isenum=!0,Sk.astnodes.Not.prototype._astname="Not",Sk.astnodes.Not.prototype._isenum=!0,Sk.astnodes.UAdd.prototype._astname="UAdd",Sk.astnodes.UAdd.prototype._isenum=!0,Sk.astnodes.USub.prototype._astname="USub",Sk.astnodes.USub.prototype._isenum=!0,Sk.astnodes.Eq.prototype._astname="Eq",Sk.astnodes.Eq.prototype._isenum=!0,Sk.astnodes.NotEq.prototype._astname="NotEq",Sk.astnodes.NotEq.prototype._isenum=!0,Sk.astnodes.Lt.prototype._astname="Lt",Sk.astnodes.Lt.prototype._isenum=!0,Sk.astnodes.LtE.prototype._astname="LtE",Sk.astnodes.LtE.prototype._isenum=!0,Sk.astnodes.Gt.prototype._astname="Gt",Sk.astnodes.Gt.prototype._isenum=!0,Sk.astnodes.GtE.prototype._astname="GtE",Sk.astnodes.GtE.prototype._isenum=!0,Sk.astnodes.Is.prototype._astname="Is",Sk.astnodes.Is.prototype._isenum=!0,Sk.astnodes.IsNot.prototype._astname="IsNot",Sk.astnodes.IsNot.prototype._isenum=!0,Sk.astnodes.In.prototype._astname="In",Sk.astnodes.In.prototype._isenum=!0,Sk.astnodes.NotIn.prototype._astname="NotIn",Sk.astnodes.NotIn.prototype._isenum=!0,Sk.astnodes.comprehension.prototype._astname="comprehension",Sk.astnodes.comprehension.prototype._fields=["target",function(t){return t.target},"iter",function(t){return t.iter},"ifs",function(t){return t.ifs},"is_async",function(t){return t.is_async}],Sk.astnodes.ExceptHandler.prototype._astname="ExceptHandler",Sk.astnodes.ExceptHandler.prototype._fields=["type",function(t){return t.type},"name",function(t){return t.name},"body",function(t){return t.body}],Sk.astnodes.arguments_.prototype._astname="arguments",Sk.astnodes.arguments_.prototype._fields=["args",function(t){return t.args},"vararg",function(t){return t.vararg},"kwonlyargs",function(t){return t.kwonlyargs},"kw_defaults",function(t){return t.kw_defaults},"kwarg",function(t){return t.kwarg},"defaults",function(t){return t.defaults}],Sk.astnodes.arg.prototype._astname="arg",Sk.astnodes.arg.prototype._fields=["arg",function(t){return t.arg},"annotation",function(t){return t.annotation}],Sk.astnodes.keyword.prototype._astname="keyword",Sk.astnodes.keyword.prototype._fields=["arg",function(t){return t.arg},"value",function(t){return t.value}],Sk.astnodes.alias.prototype._astname="alias",Sk.astnodes.alias.prototype._fields=["name",function(t){return t.name},"asname",function(t){return t.asname}],Sk.astnodes.withitem.prototype._astname="withitem",Sk.astnodes.withitem.prototype._fields=["context_expr",function(t){return t.context_expr},"optional_vars",function(t){return t.optional_vars}],Sk.exportSymbol("Sk.astnodes",Sk.astnodes)}),"./gen/parse_tables.js":(function(Y,y){Sk.OpMap={"(":Sk.token.tokens.T_LPAR,")":Sk.token.tokens.T_RPAR,"[":Sk.token.tokens.T_LSQB,"]":Sk.token.tokens.T_RSQB,":":Sk.token.tokens.T_COLON,",":Sk.token.tokens.T_COMMA,";":Sk.token.tokens.T_SEMI,"+":Sk.token.tokens.T_PLUS,"-":Sk.token.tokens.T_MINUS,"*":Sk.token.tokens.T_STAR,"/":Sk.token.tokens.T_SLASH,"|":Sk.token.tokens.T_VBAR,"&":Sk.token.tokens.T_AMPER,"<":Sk.token.tokens.T_LESS,">":Sk.token.tokens.T_GREATER,"=":Sk.token.tokens.T_EQUAL,".":Sk.token.tokens.T_DOT,"%":Sk.token.tokens.T_PERCENT,"`":Sk.token.tokens.T_BACKQUOTE,"{":Sk.token.tokens.T_LBRACE,"}":Sk.token.tokens.T_RBRACE,"@":Sk.token.tokens.T_AT,"@=":Sk.token.tokens.T_ATEQUAL,"==":Sk.token.tokens.T_EQEQUAL,"!=":Sk.token.tokens.T_NOTEQUAL,"<>":Sk.token.tokens.T_NOTEQUAL,"<=":Sk.token.tokens.T_LESSEQUAL,">=":Sk.token.tokens.T_GREATEREQUAL,"~":Sk.token.tokens.T_TILDE,"^":Sk.token.tokens.T_CIRCUMFLEX,"<<":Sk.token.tokens.T_LEFTSHIFT,">>":Sk.token.tokens.T_RIGHTSHIFT,"**":Sk.token.tokens.T_DOUBLESTAR,"+=":Sk.token.tokens.T_PLUSEQUAL,"-=":Sk.token.tokens.T_MINEQUAL,"*=":Sk.token.tokens.T_STAREQUAL,"/=":Sk.token.tokens.T_SLASHEQUAL,"%=":Sk.token.tokens.T_PERCENTEQUAL,"&=":Sk.token.tokens.T_AMPEREQUAL,"|=":Sk.token.tokens.T_VBAREQUAL,"^=":Sk.token.tokens.T_CIRCUMFLEXEQUAL,"<<=":Sk.token.tokens.T_LEFTSHIFTEQUAL,">>=":Sk.token.tokens.T_RIGHTSHIFTEQUAL,"**=":Sk.token.tokens.T_DOUBLESTAREQUAL,"//":Sk.token.tokens.T_DOUBLESLASH,"//=":Sk.token.tokens.T_DOUBLESLASHEQUAL,"->":Sk.token.tokens.T_RARROW,"...":Sk.token.tokens.T_ELLIPSIS},Sk.ParseTables={sym:{and_expr:257,and_test:258,annassign:259,arglist:260,argument:261,arith_expr:262,assert_stmt:263,async_funcdef:264,async_stmt:265,atom:266,atom_expr:267,augassign:268,break_stmt:269,classdef:270,comp_for:271,comp_if:272,comp_iter:273,comp_op:274,comparison:275,compound_stmt:276,continue_stmt:277,debugger_stmt:278,decorated:279,decorator:280,decorators:281,del_stmt:282,dictorsetmaker:283,dotted_as_name:284,dotted_as_names:285,dotted_name:286,encoding_decl:287,eval_input:288,except_clause:289,expr:290,expr_stmt:291,exprlist:292,factor:293,file_input:294,flow_stmt:295,for_stmt:296,funcdef:297,global_stmt:298,if_stmt:299,import_as_name:300,import_as_names:301,import_from:302,import_name:303,import_stmt:304,lambdef:305,lambdef_nocond:306,nonlocal_stmt:307,not_test:308,or_test:309,parameters:310,pass_stmt:311,power:312,print_stmt:313,raise_stmt:314,return_stmt:315,shift_expr:316,simple_stmt:317,single_input:256,sliceop:318,small_stmt:319,star_expr:320,stmt:321,subscript:322,subscriptlist:323,suite:324,term:325,test:326,test_nocond:327,testlist:328,testlist_comp:329,testlist_star_expr:330,tfpdef:331,trailer:332,try_stmt:333,typedargslist:334,varargslist:335,vfpdef:336,while_stmt:337,with_item:338,with_stmt:339,xor_expr:340,yield_arg:341,yield_expr:342,yield_stmt:343},number2symbol:{256:"single_input",257:"and_expr",258:"and_test",259:"annassign",260:"arglist",261:"argument",262:"arith_expr",263:"assert_stmt",264:"async_funcdef",265:"async_stmt",266:"atom",267:"atom_expr",268:"augassign",269:"break_stmt",270:"classdef",271:"comp_for",272:"comp_if",273:"comp_iter",274:"comp_op",275:"comparison",276:"compound_stmt",277:"continue_stmt",278:"debugger_stmt",279:"decorated",280:"decorator",281:"decorators",282:"del_stmt",283:"dictorsetmaker",284:"dotted_as_name",285:"dotted_as_names",286:"dotted_name",287:"encoding_decl",288:"eval_input",289:"except_clause",290:"expr",291:"expr_stmt",292:"exprlist",293:"factor",294:"file_input",295:"flow_stmt",296:"for_stmt",297:"funcdef",298:"global_stmt",299:"if_stmt",300:"import_as_name",301:"import_as_names",302:"import_from",303:"import_name",304:"import_stmt",305:"lambdef",306:"lambdef_nocond",307:"nonlocal_stmt",308:"not_test",309:"or_test",310:"parameters",311:"pass_stmt",312:"power",313:"print_stmt",314:"raise_stmt",315:"return_stmt",316:"shift_expr",317:"simple_stmt",318:"sliceop",319:"small_stmt",320:"star_expr",321:"stmt",322:"subscript",323:"subscriptlist",324:"suite",325:"term",326:"test",327:"test_nocond",328:"testlist",329:"testlist_comp",330:"testlist_star_expr",331:"tfpdef",332:"trailer",333:"try_stmt",334:"typedargslist",335:"varargslist",336:"vfpdef",337:"while_stmt",338:"with_item",339:"with_stmt",340:"xor_expr",341:"yield_arg",342:"yield_expr",343:"yield_stmt"},dfas:{256:[[[[1,1],[2,1],[3,2]],[[0,1]],[[2,1]]],{2:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1}],257:[[[[44,1]],[[45,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],258:[[[[46,1]],[[47,0],[0,1]]],{6:1,7:1,8:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],259:[[[[48,1]],[[49,2]],[[50,3],[0,2]],[[49,4]],[[0,4]]],{48:1}],260:[[[[51,1]],[[52,2],[0,1]],[[51,1],[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1,53:1}],261:[[[[49,1],[15,2],[53,2]],[[50,2],[54,3],[0,1]],[[49,3]],[[0,3]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1,53:1}],262:[[[[55,1]],[[30,0],[43,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],263:[[[[24,1]],[[49,2]],[[52,3],[0,2]],[[49,4]],[[0,4]]],{24:1}],264:[[[[10,1]],[[56,2]],[[0,2]]],{10:1}],265:[[[[10,1]],[[57,2],[56,2],[58,2]],[[0,2]]],{10:1}],266:[[[[6,1],[25,1],[33,1],[9,1],[11,1],[12,2],[35,3],[38,4],[19,1],[7,5]],[[0,1]],[[59,1],[60,6]],[[61,1],[62,7],[63,7]],[[64,1],[63,8]],[[7,5],[0,5]],[[59,1]],[[61,1]],[[64,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,25:1,33:1,35:1,38:1}],267:[[[[29,1],[65,2]],[[65,2]],[[66,2],[0,2]]],{6:1,7:1,9:1,11:1,12:1,19:1,25:1,29:1,33:1,35:1,38:1}],268:[[[[67,1],[68,1],[69,1],[70,1],[71,1],[72,1],[73,1],[74,1],[75,1],[76,1],[77,1],[78,1],[79,1]],[[0,1]]],{67:1,68:1,69:1,70:1,71:1,72:1,73:1,74:1,75:1,76:1,77:1,78:1,79:1}],269:[[[[39,1]],[[0,1]]],{39:1}],270:[[[[13,1]],[[25,2]],[[48,3],[35,4]],[[80,5]],[[61,6],[81,7]],[[0,5]],[[48,3]],[[61,6]]],{13:1}],271:[[[[10,1],[34,2]],[[34,2]],[[82,3]],[[83,4]],[[84,5]],[[85,6],[0,5]],[[0,6]]],{10:1,34:1}],272:[[[[37,1]],[[86,2]],[[85,3],[0,2]],[[0,3]]],{37:1}],273:[[[[87,1],[54,1]],[[0,1]]],{10:1,34:1,37:1}],274:[[[[88,1],[89,1],[8,2],[90,1],[88,1],[83,1],[91,1],[92,3],[93,1],[94,1]],[[0,1]],[[83,1]],[[8,1],[0,3]]],{8:1,83:1,88:1,89:1,90:1,91:1,92:1,93:1,94:1}],275:[[[[95,1]],[[96,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],276:[[[[97,1],[98,1],[58,1],[99,1],[57,1],[100,1],[56,1],[101,1],[102,1]],[[0,1]]],{4:1,10:1,13:1,20:1,21:1,34:1,37:1,41:1,42:1}],277:[[[[40,1]],[[0,1]]],{40:1}],278:[[[[17,1]],[[0,1]]],{17:1}],279:[[[[103,1]],[[56,2],[104,2],[99,2]],[[0,2]]],{41:1}],280:[[[[41,1]],[[105,2]],[[2,4],[35,3]],[[61,5],[81,6]],[[0,4]],[[2,4]],[[61,5]]],{41:1}],281:[[[[106,1]],[[106,1],[0,1]]],{41:1}],282:[[[[27,1]],[[82,2]],[[0,2]]],{27:1}],283:[[[[49,1],[107,2],[53,3]],[[48,4],[54,5],[52,6],[0,1]],[[54,5],[52,6],[0,2]],[[95,7]],[[49,7]],[[0,5]],[[49,8],[107,8],[0,6]],[[54,5],[52,9],[0,7]],[[52,6],[0,8]],[[49,10],[53,11],[0,9]],[[48,12]],[[95,13]],[[49,13]],[[52,9],[0,13]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1,53:1}],284:[[[[105,1]],[[108,2],[0,1]],[[25,3]],[[0,3]]],{25:1}],285:[[[[109,1]],[[52,0],[0,1]]],{25:1}],286:[[[[25,1]],[[110,0],[0,1]]],{25:1}],287:[[[[25,1]],[[0,1]]],{25:1}],288:[[[[111,1]],[[2,1],[112,2]],[[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],289:[[[[113,1]],[[49,2],[0,1]],[[108,3],[52,3],[0,2]],[[49,4]],[[0,4]]],{113:1}],290:[[[[114,1]],[[115,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],291:[[[[116,1]],[[117,2],[50,3],[118,4],[0,1]],[[111,4],[62,4]],[[116,5],[62,5]],[[0,4]],[[50,3],[0,5]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],292:[[[[95,1],[107,1]],[[52,2],[0,1]],[[95,1],[107,1],[0,2]]],{6:1,7:1,9:1,11:1,12:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],293:[[[[119,2],[30,1],[22,1],[43,1]],[[120,2]],[[0,2]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],294:[[[[2,0],[112,1],[121,0]],[[0,1]]],{2:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1,112:1}],295:[[[[122,1],[123,1],[124,1],[125,1],[126,1]],[[0,1]]],{5:1,23:1,31:1,39:1,40:1}],296:[[[[34,1]],[[82,2]],[[83,3]],[[111,4]],[[48,5]],[[80,6]],[[127,7],[0,6]],[[48,8]],[[80,9]],[[0,9]]],{34:1}],297:[[[[4,1]],[[25,2]],[[128,3]],[[48,4],[129,5]],[[80,6]],[[49,7]],[[0,6]],[[48,4]]],{4:1}],298:[[[[26,1]],[[25,2]],[[52,1],[0,2]]],{26:1}],299:[[[[37,1]],[[49,2]],[[48,3]],[[80,4]],[[127,5],[130,1],[0,4]],[[48,6]],[[80,7]],[[0,7]]],{37:1}],300:[[[[25,1]],[[108,2],[0,1]],[[25,3]],[[0,3]]],{25:1}],301:[[[[131,1]],[[52,2],[0,1]],[[131,1],[0,2]]],{25:1}],302:[[[[36,1]],[[105,2],[19,3],[110,3]],[[32,4]],[[105,2],[19,3],[32,4],[110,3]],[[132,5],[15,5],[35,6]],[[0,5]],[[132,7]],[[61,5]]],{36:1}],303:[[[[32,1]],[[133,2]],[[0,2]]],{32:1}],304:[[[[134,1],[135,1]],[[0,1]]],{32:1,36:1}],305:[[[[14,1]],[[48,2],[136,3]],[[49,4]],[[48,2]],[[0,4]]],{14:1}],306:[[[[14,1]],[[48,2],[136,3]],[[86,4]],[[48,2]],[[0,4]]],{14:1}],307:[[[[18,1]],[[25,2]],[[52,1],[0,2]]],{18:1}],308:[[[[8,1],[137,2]],[[46,2]],[[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],309:[[[[138,1]],[[139,0],[0,1]]],{6:1,7:1,8:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],310:[[[[35,1]],[[61,2],[140,3]],[[0,2]],[[61,2]]],{35:1}],311:[[[[28,1]],[[0,1]]],{28:1}],312:[[[[141,1]],[[53,2],[0,1]],[[120,3]],[[0,3]]],{6:1,7:1,9:1,11:1,12:1,19:1,25:1,29:1,33:1,35:1,38:1}],313:[[[[16,1]],[[49,2],[142,3],[0,1]],[[52,4],[0,2]],[[49,5]],[[49,2],[0,4]],[[52,6],[0,5]],[[49,7]],[[52,8],[0,7]],[[49,7],[0,8]]],{16:1}],314:[[[[5,1]],[[49,2],[0,1]],[[36,3],[52,3],[0,2]],[[49,4]],[[52,5],[0,4]],[[49,6]],[[0,6]]],{5:1}],315:[[[[23,1]],[[111,2],[0,1]],[[0,2]]],{23:1}],316:[[[[143,1]],[[144,0],[142,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],317:[[[[145,1]],[[2,2],[146,3]],[[0,2]],[[145,1],[2,2]]],{5:1,6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,16:1,17:1,18:1,19:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,35:1,36:1,38:1,39:1,40:1,43:1}],318:[[[[48,1]],[[49,2],[0,1]],[[0,2]]],{48:1}],319:[[[[147,1],[148,1],[149,1],[150,1],[151,1],[152,1],[153,1],[154,1],[155,1],[156,1]],[[0,1]]],{5:1,6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,16:1,17:1,18:1,19:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,35:1,36:1,38:1,39:1,40:1,43:1}],320:[[[[15,1]],[[95,2]],[[0,2]]],{15:1}],321:[[[[1,1],[3,1]],[[0,1]]],{4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,34:1,35:1,36:1,37:1,38:1,39:1,40:1,41:1,42:1,43:1}],322:[[[[49,1],[48,2]],[[48,2],[0,1]],[[49,3],[157,4],[0,2]],[[157,4],[0,3]],[[0,4]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1,48:1}],323:[[[[158,1]],[[52,2],[0,1]],[[158,1],[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1,48:1}],324:[[[[1,1],[2,2]],[[0,1]],[[159,3]],[[121,4]],[[160,1],[121,4]]],{2:1,5:1,6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,16:1,17:1,18:1,19:1,22:1,23:1,24:1,25:1,26:1,27:1,28:1,29:1,30:1,31:1,32:1,33:1,35:1,36:1,38:1,39:1,40:1,43:1}],325:[[[[120,1]],[[161,0],[15,0],[162,0],[41,0],[163,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],326:[[[[84,1],[164,2]],[[37,3],[0,1]],[[0,2]],[[84,4]],[[127,5]],[[49,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],327:[[[[165,1],[84,1]],[[0,1]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],328:[[[[49,1]],[[52,2],[0,1]],[[49,1],[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],329:[[[[49,1],[107,1]],[[54,2],[52,3],[0,1]],[[0,2]],[[49,4],[107,4],[0,3]],[[52,3],[0,4]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],330:[[[[49,1],[107,1]],[[52,2],[0,1]],[[49,1],[107,1],[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,15:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],331:[[[[25,1]],[[48,2],[0,1]],[[49,3]],[[0,3]]],{25:1}],332:[[[[35,1],[110,2],[38,3]],[[61,4],[81,5]],[[25,4]],[[166,6]],[[0,4]],[[61,4]],[[64,4]]],{35:1,38:1,110:1}],333:[[[[20,1]],[[48,2]],[[80,3]],[[167,4],[168,5]],[[48,6]],[[48,7]],[[80,8]],[[80,9]],[[167,4],[127,10],[168,5],[0,8]],[[0,9]],[[48,11]],[[80,12]],[[168,5],[0,12]]],{20:1}],334:[[[[15,1],[169,2],[53,3]],[[169,4],[52,5],[0,1]],[[50,6],[52,7],[0,2]],[[169,8]],[[52,5],[0,4]],[[169,9],[53,3],[0,5]],[[49,10]],[[15,11],[169,2],[53,3],[0,7]],[[52,12],[0,8]],[[50,13],[52,5],[0,9]],[[52,7],[0,10]],[[169,14],[52,15],[0,11]],[[0,12]],[[49,4]],[[52,15],[0,14]],[[169,16],[53,3],[0,15]],[[50,17],[52,15],[0,16]],[[49,14]]],{15:1,25:1,53:1}],335:[[[[15,1],[53,2],[170,3]],[[170,5],[52,4],[0,1]],[[170,6]],[[50,7],[52,8],[0,3]],[[53,2],[170,9],[0,4]],[[52,4],[0,5]],[[52,10],[0,6]],[[49,11]],[[15,12],[53,2],[170,3],[0,8]],[[50,13],[52,4],[0,9]],[[0,10]],[[52,8],[0,11]],[[52,15],[170,14],[0,12]],[[49,5]],[[52,15],[0,14]],[[53,2],[170,16],[0,15]],[[50,17],[52,15],[0,16]],[[49,14]]],{15:1,25:1,53:1}],336:[[[[25,1]],[[0,1]]],{25:1}],337:[[[[21,1]],[[49,2]],[[48,3]],[[80,4]],[[127,5],[0,4]],[[48,6]],[[80,7]],[[0,7]]],{21:1}],338:[[[[49,1]],[[108,2],[0,1]],[[95,3]],[[0,3]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],339:[[[[42,1]],[[171,2]],[[48,3],[52,1]],[[80,4]],[[0,4]]],{42:1}],340:[[[[172,1]],[[173,0],[0,1]]],{6:1,7:1,9:1,11:1,12:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,38:1,43:1}],341:[[[[111,2],[36,1]],[[49,2]],[[0,2]]],{6:1,7:1,8:1,9:1,11:1,12:1,14:1,19:1,22:1,25:1,29:1,30:1,33:1,35:1,36:1,38:1,43:1}],342:[[[[31,1]],[[174,2],[0,1]],[[0,2]]],{31:1}],343:[[[[62,1]],[[0,1]]],{31:1}]},states:[[[[1,1],[2,1],[3,2]],[[0,1]],[[2,1]]],[[[44,1]],[[45,0],[0,1]]],[[[46,1]],[[47,0],[0,1]]],[[[48,1]],[[49,2]],[[50,3],[0,2]],[[49,4]],[[0,4]]],[[[51,1]],[[52,2],[0,1]],[[51,1],[0,2]]],[[[49,1],[15,2],[53,2]],[[50,2],[54,3],[0,1]],[[49,3]],[[0,3]]],[[[55,1]],[[30,0],[43,0],[0,1]]],[[[24,1]],[[49,2]],[[52,3],[0,2]],[[49,4]],[[0,4]]],[[[10,1]],[[56,2]],[[0,2]]],[[[10,1]],[[57,2],[56,2],[58,2]],[[0,2]]],[[[6,1],[25,1],[33,1],[9,1],[11,1],[12,2],[35,3],[38,4],[19,1],[7,5]],[[0,1]],[[59,1],[60,6]],[[61,1],[62,7],[63,7]],[[64,1],[63,8]],[[7,5],[0,5]],[[59,1]],[[61,1]],[[64,1]]],[[[29,1],[65,2]],[[65,2]],[[66,2],[0,2]]],[[[67,1],[68,1],[69,1],[70,1],[71,1],[72,1],[73,1],[74,1],[75,1],[76,1],[77,1],[78,1],[79,1]],[[0,1]]],[[[39,1]],[[0,1]]],[[[13,1]],[[25,2]],[[48,3],[35,4]],[[80,5]],[[61,6],[81,7]],[[0,5]],[[48,3]],[[61,6]]],[[[10,1],[34,2]],[[34,2]],[[82,3]],[[83,4]],[[84,5]],[[85,6],[0,5]],[[0,6]]],[[[37,1]],[[86,2]],[[85,3],[0,2]],[[0,3]]],[[[87,1],[54,1]],[[0,1]]],[[[88,1],[89,1],[8,2],[90,1],[88,1],[83,1],[91,1],[92,3],[93,1],[94,1]],[[0,1]],[[83,1]],[[8,1],[0,3]]],[[[95,1]],[[96,0],[0,1]]],[[[97,1],[98,1],[58,1],[99,1],[57,1],[100,1],[56,1],[101,1],[102,1]],[[0,1]]],[[[40,1]],[[0,1]]],[[[17,1]],[[0,1]]],[[[103,1]],[[56,2],[104,2],[99,2]],[[0,2]]],[[[41,1]],[[105,2]],[[2,4],[35,3]],[[61,5],[81,6]],[[0,4]],[[2,4]],[[61,5]]],[[[106,1]],[[106,1],[0,1]]],[[[27,1]],[[82,2]],[[0,2]]],[[[49,1],[107,2],[53,3]],[[48,4],[54,5],[52,6],[0,1]],[[54,5],[52,6],[0,2]],[[95,7]],[[49,7]],[[0,5]],[[49,8],[107,8],[0,6]],[[54,5],[52,9],[0,7]],[[52,6],[0,8]],[[49,10],[53,11],[0,9]],[[48,12]],[[95,13]],[[49,13]],[[52,9],[0,13]]],[[[105,1]],[[108,2],[0,1]],[[25,3]],[[0,3]]],[[[109,1]],[[52,0],[0,1]]],[[[25,1]],[[110,0],[0,1]]],[[[25,1]],[[0,1]]],[[[111,1]],[[2,1],[112,2]],[[0,2]]],[[[113,1]],[[49,2],[0,1]],[[108,3],[52,3],[0,2]],[[49,4]],[[0,4]]],[[[114,1]],[[115,0],[0,1]]],[[[116,1]],[[117,2],[50,3],[118,4],[0,1]],[[111,4],[62,4]],[[116,5],[62,5]],[[0,4]],[[50,3],[0,5]]],[[[95,1],[107,1]],[[52,2],[0,1]],[[95,1],[107,1],[0,2]]],[[[119,2],[30,1],[22,1],[43,1]],[[120,2]],[[0,2]]],[[[2,0],[112,1],[121,0]],[[0,1]]],[[[122,1],[123,1],[124,1],[125,1],[126,1]],[[0,1]]],[[[34,1]],[[82,2]],[[83,3]],[[111,4]],[[48,5]],[[80,6]],[[127,7],[0,6]],[[48,8]],[[80,9]],[[0,9]]],[[[4,1]],[[25,2]],[[128,3]],[[48,4],[129,5]],[[80,6]],[[49,7]],[[0,6]],[[48,4]]],[[[26,1]],[[25,2]],[[52,1],[0,2]]],[[[37,1]],[[49,2]],[[48,3]],[[80,4]],[[127,5],[130,1],[0,4]],[[48,6]],[[80,7]],[[0,7]]],[[[25,1]],[[108,2],[0,1]],[[25,3]],[[0,3]]],[[[131,1]],[[52,2],[0,1]],[[131,1],[0,2]]],[[[36,1]],[[105,2],[19,3],[110,3]],[[32,4]],[[105,2],[19,3],[32,4],[110,3]],[[132,5],[15,5],[35,6]],[[0,5]],[[132,7]],[[61,5]]],[[[32,1]],[[133,2]],[[0,2]]],[[[134,1],[135,1]],[[0,1]]],[[[14,1]],[[48,2],[136,3]],[[49,4]],[[48,2]],[[0,4]]],[[[14,1]],[[48,2],[136,3]],[[86,4]],[[48,2]],[[0,4]]],[[[18,1]],[[25,2]],[[52,1],[0,2]]],[[[8,1],[137,2]],[[46,2]],[[0,2]]],[[[138,1]],[[139,0],[0,1]]],[[[35,1]],[[61,2],[140,3]],[[0,2]],[[61,2]]],[[[28,1]],[[0,1]]],[[[141,1]],[[53,2],[0,1]],[[120,3]],[[0,3]]],[[[16,1]],[[49,2],[142,3],[0,1]],[[52,4],[0,2]],[[49,5]],[[49,2],[0,4]],[[52,6],[0,5]],[[49,7]],[[52,8],[0,7]],[[49,7],[0,8]]],[[[5,1]],[[49,2],[0,1]],[[36,3],[52,3],[0,2]],[[49,4]],[[52,5],[0,4]],[[49,6]],[[0,6]]],[[[23,1]],[[111,2],[0,1]],[[0,2]]],[[[143,1]],[[144,0],[142,0],[0,1]]],[[[145,1]],[[2,2],[146,3]],[[0,2]],[[145,1],[2,2]]],[[[48,1]],[[49,2],[0,1]],[[0,2]]],[[[147,1],[148,1],[149,1],[150,1],[151,1],[152,1],[153,1],[154,1],[155,1],[156,1]],[[0,1]]],[[[15,1]],[[95,2]],[[0,2]]],[[[1,1],[3,1]],[[0,1]]],[[[49,1],[48,2]],[[48,2],[0,1]],[[49,3],[157,4],[0,2]],[[157,4],[0,3]],[[0,4]]],[[[158,1]],[[52,2],[0,1]],[[158,1],[0,2]]],[[[1,1],[2,2]],[[0,1]],[[159,3]],[[121,4]],[[160,1],[121,4]]],[[[120,1]],[[161,0],[15,0],[162,0],[41,0],[163,0],[0,1]]],[[[84,1],[164,2]],[[37,3],[0,1]],[[0,2]],[[84,4]],[[127,5]],[[49,2]]],[[[165,1],[84,1]],[[0,1]]],[[[49,1]],[[52,2],[0,1]],[[49,1],[0,2]]],[[[49,1],[107,1]],[[54,2],[52,3],[0,1]],[[0,2]],[[49,4],[107,4],[0,3]],[[52,3],[0,4]]],[[[49,1],[107,1]],[[52,2],[0,1]],[[49,1],[107,1],[0,2]]],[[[25,1]],[[48,2],[0,1]],[[49,3]],[[0,3]]],[[[35,1],[110,2],[38,3]],[[61,4],[81,5]],[[25,4]],[[166,6]],[[0,4]],[[61,4]],[[64,4]]],[[[20,1]],[[48,2]],[[80,3]],[[167,4],[168,5]],[[48,6]],[[48,7]],[[80,8]],[[80,9]],[[167,4],[127,10],[168,5],[0,8]],[[0,9]],[[48,11]],[[80,12]],[[168,5],[0,12]]],[[[15,1],[169,2],[53,3]],[[169,4],[52,5],[0,1]],[[50,6],[52,7],[0,2]],[[169,8]],[[52,5],[0,4]],[[169,9],[53,3],[0,5]],[[49,10]],[[15,11],[169,2],[53,3],[0,7]],[[52,12],[0,8]],[[50,13],[52,5],[0,9]],[[52,7],[0,10]],[[169,14],[52,15],[0,11]],[[0,12]],[[49,4]],[[52,15],[0,14]],[[169,16],[53,3],[0,15]],[[50,17],[52,15],[0,16]],[[49,14]]],[[[15,1],[53,2],[170,3]],[[170,5],[52,4],[0,1]],[[170,6]],[[50,7],[52,8],[0,3]],[[53,2],[170,9],[0,4]],[[52,4],[0,5]],[[52,10],[0,6]],[[49,11]],[[15,12],[53,2],[170,3],[0,8]],[[50,13],[52,4],[0,9]],[[0,10]],[[52,8],[0,11]],[[52,15],[170,14],[0,12]],[[49,5]],[[52,15],[0,14]],[[53,2],[170,16],[0,15]],[[50,17],[52,15],[0,16]],[[49,14]]],[[[25,1]],[[0,1]]],[[[21,1]],[[49,2]],[[48,3]],[[80,4]],[[127,5],[0,4]],[[48,6]],[[80,7]],[[0,7]]],[[[49,1]],[[108,2],[0,1]],[[95,3]],[[0,3]]],[[[42,1]],[[171,2]],[[48,3],[52,1]],[[80,4]],[[0,4]]],[[[172,1]],[[173,0],[0,1]]],[[[111,2],[36,1]],[[49,2]],[[0,2]]],[[[31,1]],[[174,2],[0,1]],[[0,2]]],[[[62,1]],[[0,1]]]],labels:[[0,"EMPTY"],[317,null],[4,null],[276,null],[1,"def"],[1,"raise"],[1,"True"],[3,null],[1,"not"],[1,"null"],[55,null],[2,null],[25,null],[1,"class"],[1,"lambda"],[16,null],[1,"print"],[1,"debugger"],[1,"nonlocal"],[52,null],[1,"try"],[1,"while"],[31,null],[1,"return"],[1,"assert"],[1,null],[1,"global"],[1,"del"],[1,"pass"],[54,null],[15,null],[1,"yield"],[1,"import"],[1,"False"],[1,"for"],[7,null],[1,"from"],[1,"if"],[9,null],[1,"break"],[1,"continue"],[49,null],[1,"with"],[14,null],[316,null],[19,null],[308,null],[1,"and"],[11,null],[326,null],[22,null],[261,null],[12,null],[35,null],[271,null],[325,null],[297,null],[339,null],[296,null],[26,null],[283,null],[8,null],[342,null],[329,null],[10,null],[266,null],[332,null],[45,null],[38,null],[40,null],[50,null],[46,null],[41,null],[42,null],[36,null],[43,null],[48,null],[44,null],[37,null],[39,null],[324,null],[260,null],[292,null],[1,"in"],[309,null],[273,null],[327,null],[272,null],[28,null],[21,null],[27,null],[29,null],[1,"is"],[30,null],[20,null],[290,null],[274,null],[333,null],[299,null],[270,null],[337,null],[279,null],[265,null],[281,null],[264,null],[286,null],[280,null],[320,null],[1,"as"],[284,null],[23,null],[328,null],[0,null],[1,"except"],[340,null],[18,null],[330,null],[268,null],[259,null],[312,null],[293,null],[321,null],[269,null],[277,null],[314,null],[315,null],[343,null],[1,"else"],[310,null],[51,null],[1,"elif"],[300,null],[301,null],[285,null],[303,null],[302,null],[335,null],[275,null],[258,null],[1,"or"],[334,null],[267,null],[34,null],[262,null],[33,null],[319,null],[13,null],[295,null],[263,null],[291,null],[311,null],[307,null],[313,null],[282,null],[298,null],[304,null],[278,null],[318,null],[322,null],[5,null],[6,null],[47,null],[17,null],[24,null],[305,null],[306,null],[323,null],[289,null],[1,"finally"],[331,null],[336,null],[338,null],[257,null],[32,null],[341,null]],keywords:{False:33,null:9,True:6,and:47,as:108,assert:24,break:39,class:13,continue:40,debugger:17,def:4,del:27,elif:130,else:127,except:113,finally:168,for:34,from:36,global:26,if:37,import:32,in:83,is:92,lambda:14,nonlocal:18,not:8,or:139,pass:28,print:16,raise:5,return:23,try:20,while:21,with:42,yield:31},tokens:{0:112,1:25,2:11,3:7,4:2,5:159,6:160,7:35,8:61,9:38,10:64,11:48,12:52,13:146,14:43,15:30,16:15,17:162,18:115,19:45,20:94,21:89,22:50,23:110,24:163,25:12,26:59,27:90,28:88,29:91,30:93,31:22,32:173,33:144,34:142,35:53,36:74,37:78,38:68,39:79,40:69,41:72,42:73,43:75,44:77,45:67,46:71,47:161,48:76,49:41,50:70,51:129,52:19,54:29,55:10},start:256}}),"./node_modules/fastestsmallesttextencoderdecoder/EncoderDecoderTogether.min.js":(function(Y,y,t){"use strict";(function(n){(function(a){function i(){}function r(){}var o=String.fromCharCode,p={}.toString,w=p.call(a.SharedArrayBuffer),T=p(),A=a.Uint8Array,S=A||Array,O=A?ArrayBuffer:S,D=O.isView||function(v){return v&&"length"in v},B=p.call(O.prototype);O=r.prototype;var F=a.TextEncoder,s=new(A?Uint16Array:S)(32);i.prototype.decode=function(v){if(!D(v)){var N=p.call(v);if(N!==B&&N!==w&&N!==T)throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");v=A?new S(v):v||[]}for(var h=N="",c=0,l=v.length|0,d=l-32|0,_,E,b=0,R=0,f,$=0,k=-1;c<l;){for(_=c<=d?32:l-c|0;$<_;c=c+1|0,$=$+1|0){switch(E=v[c]&255,E>>4){case 15:if(f=v[c=c+1|0]&255,f>>6!==2||247<E){c=c-1|0;break}b=(E&7)<<6|f&63,R=5,E=256;case 14:f=v[c=c+1|0]&255,b<<=6,b|=(E&15)<<6|f&63,R=f>>6===2?R+4|0:24,E=E+256&768;case 13:case 12:f=v[c=c+1|0]&255,b<<=6,b|=(E&31)<<6|f&63,R=R+7|0,c<l&&f>>6===2&&b>>R&&1114112>b?(E=b,b=b-65536|0,0<=b&&(k=(b>>10)+55296|0,E=(b&1023)+56320|0,31>$?(s[$]=k,$=$+1|0,k=-1):(f=k,k=E,E=f))):(E>>=8,c=c-E-1|0,E=65533),b=R=0,_=c<=d?32:l-c|0;default:s[$]=E;continue;case 11:case 10:case 9:case 8:}s[$]=65533}if(h+=o(s[0],s[1],s[2],s[3],s[4],s[5],s[6],s[7],s[8],s[9],s[10],s[11],s[12],s[13],s[14],s[15],s[16],s[17],s[18],s[19],s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[30],s[31]),32>$&&(h=h.slice(0,$-32|0)),c<l){if(s[0]=k,$=~k>>>31,k=-1,h.length<N.length)continue}else k!==-1&&(h+=o(k));N+=h,h=""}return N},O.encode=function(v){v=v===void 0?"":""+v;var N=v.length|0,h=new S((N<<1)+8|0),c,l=0,d=!A;for(c=0;c<N;c=c+1|0,l=l+1|0){var _=v.charCodeAt(c)|0;if(127>=_)h[l]=_;else{if(2047>=_)h[l]=192|_>>6;else{e:{if(55296<=_)if(56319>=_){var E=v.charCodeAt(c=c+1|0)|0;if(56320<=E&&57343>=E){if(_=(_<<10)+E-56613888|0,65535<_){h[l]=240|_>>18,h[l=l+1|0]=128|_>>12&63,h[l=l+1|0]=128|_>>6&63,h[l=l+1|0]=128|_&63;continue}break e}_=65533}else 57343>=_&&(_=65533);!d&&c<<1<l&&c<<1<(l-7|0)&&(d=!0,E=new S(3*N),E.set(h),h=E)}h[l]=224|_>>12,h[l=l+1|0]=128|_>>6&63}h[l=l+1|0]=128|_&63}}return A?h.subarray(0,l):h.slice(0,l)},F||(a.TextDecoder=i,a.TextEncoder=r)})(typeof n>"u"?typeof self>"u"?this:self:n)}).call(this,t("./node_modules/webpack/buildin/global.js"))}),"./node_modules/jsbi/dist/jsbi-umd.js":(function(Y,y,t){(function(n,a){Y.exports=a()})(this,function(){"use strict";var n=Math.imul,a=Math.clz32;function i(d){"@babel/helpers - typeof";return i=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(_){return typeof _}:function(_){return _&&typeof Symbol=="function"&&_.constructor===Symbol&&_!==Symbol.prototype?"symbol":typeof _},i(d)}function r(d,_){if(!(d instanceof _))throw new TypeError("Cannot call a class as a function")}function o(d,_){for(var E,b=0;b<_.length;b++)E=_[b],E.enumerable=E.enumerable||!1,E.configurable=!0,"value"in E&&(E.writable=!0),Object.defineProperty(d,E.key,E)}function p(d,_,E){return _&&o(d.prototype,_),E&&o(d,E),d}function w(d,_){if(typeof _!="function"&&_!==null)throw new TypeError("Super expression must either be null or a function");d.prototype=Object.create(_&&_.prototype,{constructor:{value:d,writable:!0,configurable:!0}}),_&&A(d,_)}function T(d){return T=Object.setPrototypeOf?Object.getPrototypeOf:function(_){return _.__proto__||Object.getPrototypeOf(_)},T(d)}function A(d,_){return A=Object.setPrototypeOf||function(E,b){return E.__proto__=b,E},A(d,_)}function S(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function O(){return O=S()?Reflect.construct:function(d,_,E){var b=[null];b.push.apply(b,_);var R=Function.bind.apply(d,b),f=new R;return E&&A(f,E.prototype),f},O.apply(null,arguments)}function D(d){return Function.toString.call(d).indexOf("[native code]")!==-1}function B(d){var _=typeof Map=="function"?new Map:void 0;return B=function(E){function b(){return O(E,arguments,T(this).constructor)}if(E===null||!D(E))return E;if(typeof E!="function")throw new TypeError("Super expression must either be null or a function");if(typeof _<"u"){if(_.has(E))return _.get(E);_.set(E,b)}return b.prototype=Object.create(E.prototype,{constructor:{value:b,enumerable:!1,writable:!0,configurable:!0}}),A(b,E)},B(d)}function F(d){if(d===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return d}function s(d,_){return _&&(typeof _=="object"||typeof _=="function")?_:F(d)}function v(d){var _=S();return function(){var E,b=T(d);if(_){var R=T(this).constructor;E=Reflect.construct(b,arguments,R)}else E=b.apply(this,arguments);return s(this,E)}}function N(d,_){if(d){if(typeof d=="string")return h(d,_);var E=Object.prototype.toString.call(d).slice(8,-1);return E==="Object"&&d.constructor&&(E=d.constructor.name),E==="Map"||E==="Set"?Array.from(d):E==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(E)?h(d,_):void 0}}function h(d,_){(_==null||_>d.length)&&(_=d.length);for(var E=0,b=Array(_);E<_;E++)b[E]=d[E];return b}function c(d,_){var E;if(typeof Symbol>"u"||d[Symbol.iterator]==null){if(Array.isArray(d)||(E=N(d))||_&&d&&typeof d.length=="number"){E&&(d=E);var b=0,R=function(){};return{s:R,n:function(){return b>=d.length?{done:!0}:{done:!1,value:d[b++]}},e:function(m){throw m},f:R}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var f,$=!0,k=!1;return{s:function(){E=d[Symbol.iterator]()},n:function(){var m=E.next();return $=m.done,m},e:function(m){k=!0,f=m},f:function(){try{$||E.return==null||E.return()}finally{if(k)throw f}}}}var l=(function(d){var _=Math.abs,E=Math.max;function b(f,$){var k;if(r(this,b),f>b.__kMaxLength)throw new RangeError("Maximum BigInt size exceeded");return k=R.call(this,f),k.sign=$,k}w(b,d);var R=v(b);return p(b,[{key:"toDebugString",value:function(){var f,$=["BigInt["],k=c(this);try{for(k.s();!(f=k.n()).done;){var m=f.value;$.push((m&&(m>>>0).toString(16))+", ")}}catch(g){k.e(g)}finally{k.f()}return $.push("]"),$.join("")}},{key:"toString",value:function(){var f=0<arguments.length&&arguments[0]!==void 0?arguments[0]:10;if(2>f||36<f)throw new RangeError("toString() radix argument must be between 2 and 36");return this.length===0?"0":(f&f-1)==0?b.__toStringBasePowerOfTwo(this,f):b.__toStringGeneric(this,f,!1)}},{key:"__copy",value:function(){for(var f=new b(this.length,this.sign),$=0;$<this.length;$++)f[$]=this[$];return f}},{key:"__trim",value:function(){for(var f=this.length,$=this[f-1];$===0;)f--,$=this[f-1],this.pop();return f===0&&(this.sign=!1),this}},{key:"__initializeDigits",value:function(){for(var f=0;f<this.length;f++)this[f]=0}},{key:"__clzmsd",value:function(){return b.__clz32(this[this.length-1])}},{key:"__inplaceMultiplyAdd",value:function(f,$,k){k>this.length&&(k=this.length);for(var m=65535&f,g=f>>>16,x=0,C=65535&$,L=$>>>16,P=0;P<k;P++){var J=this.__digit(P),K=65535&J,j=J>>>16,V=b.__imul(K,m),G=b.__imul(K,g),X=b.__imul(j,m),Q=b.__imul(j,g),Z=C+(65535&V),te=L+x+(Z>>>16)+(V>>>16)+(65535&G)+(65535&X);C=(G>>>16)+(X>>>16)+(65535&Q)+(te>>>16),x=C>>>16,C&=65535,L=Q>>>16,this.__setDigit(P,65535&Z|te<<16)}if(x!==0||C!==0||L!==0)throw new Error("implementation bug")}},{key:"__inplaceAdd",value:function(f,$,k){for(var m,g=0,x=0;x<k;x++)m=this.__halfDigit($+x)+f.__halfDigit(x)+g,g=m>>>16,this.__setHalfDigit($+x,m);return g}},{key:"__inplaceSub",value:function(f,$,k){var m=0;if(1&$){$>>=1;for(var g=this.__digit($),x=65535&g,C=0;C<k-1>>>1;C++){var L=f.__digit(C),P=(g>>>16)-(65535&L)-m;m=1&P>>>16,this.__setDigit($+C,P<<16|65535&x),g=this.__digit($+C+1),x=(65535&g)-(L>>>16)-m,m=1&x>>>16}var J=f.__digit(C),K=(g>>>16)-(65535&J)-m;if(m=1&K>>>16,this.__setDigit($+C,K<<16|65535&x),$+C+1>=this.length)throw new RangeError("out of bounds");(1&k)==0&&(g=this.__digit($+C+1),x=(65535&g)-(J>>>16)-m,m=1&x>>>16,this.__setDigit($+f.length,4294901760&g|65535&x))}else{$>>=1;for(var j=0;j<f.length-1;j++){var V=this.__digit($+j),G=f.__digit(j),X=(65535&V)-(65535&G)-m;m=1&X>>>16;var Q=(V>>>16)-(G>>>16)-m;m=1&Q>>>16,this.__setDigit($+j,Q<<16|65535&X)}var Z=this.__digit($+j),te=f.__digit(j),ae=(65535&Z)-(65535&te)-m;m=1&ae>>>16;var le=0;(1&k)==0&&(le=(Z>>>16)-(te>>>16)-m,m=1&le>>>16),this.__setDigit($+j,le<<16|65535&ae)}return m}},{key:"__inplaceRightShift",value:function(f){if(f!==0){for(var $,k=this.__digit(0)>>>f,m=this.length-1,g=0;g<m;g++)$=this.__digit(g+1),this.__setDigit(g,$<<32-f|k),k=$>>>f;this.__setDigit(m,k)}}},{key:"__digit",value:function(f){return this[f]}},{key:"__unsignedDigit",value:function(f){return this[f]>>>0}},{key:"__setDigit",value:function(f,$){this[f]=0|$}},{key:"__setDigitGrow",value:function(f,$){this[f]=0|$}},{key:"__halfDigitLength",value:function(){var f=this.length;return 65535>=this.__unsignedDigit(f-1)?2*f-1:2*f}},{key:"__halfDigit",value:function(f){return 65535&this[f>>>1]>>>((1&f)<<4)}},{key:"__setHalfDigit",value:function(f,$){var k=f>>>1,m=this.__digit(k),g=1&f?65535&m|$<<16:4294901760&m|65535&$;this.__setDigit(k,g)}}],[{key:"BigInt",value:function(f){var $=Math.floor,k=Number.isFinite;if(typeof f=="number"){if(f===0)return b.__zero();if((0|f)===f)return 0>f?b.__oneDigit(-f,!0):b.__oneDigit(f,!1);if(!k(f)||$(f)!==f)throw new RangeError("The number "+f+" cannot be converted to BigInt because it is not an integer");return b.__fromDouble(f)}if(typeof f=="string"){var m=b.__fromString(f);if(m===null)throw new SyntaxError("Cannot convert "+f+" to a BigInt");return m}if(typeof f=="boolean")return f===!0?b.__oneDigit(1,!1):b.__zero();if(i(f)==="object"){if(f.constructor===b)return f;var g=b.__toPrimitive(f);return b.BigInt(g)}throw new TypeError("Cannot convert "+f+" to a BigInt")}},{key:"toNumber",value:function(f){var $=f.length;if($===0)return 0;if($===1){var k=f.__unsignedDigit(0);return f.sign?-k:k}var m=f.__digit($-1),g=b.__clz32(m),x=32*$-g;if(1024<x)return f.sign?-1/0:1/0;var C=x-1,L=m,P=$-1,J=g+1,K=J===32?0:L<<J;K>>>=12;var j=J-12,V=12<=J?0:L<<20+J,G=20+J;0<j&&0<P&&(P--,L=f.__digit(P),K|=L>>>32-j,V=L<<j,G=j),0<G&&0<P&&(P--,L=f.__digit(P),V|=L>>>32-G,G-=32);var X=b.__decideRounding(f,G,P,L);if((X===1||X===0&&(1&V)==1)&&(V=V+1>>>0,V===0&&(K++,K>>>20!=0&&(K=0,C++,1023<C))))return f.sign?-1/0:1/0;var Q=f.sign?-2147483648:0;return C=C+1023<<20,b.__kBitConversionInts[1]=Q|C|K,b.__kBitConversionInts[0]=V,b.__kBitConversionDouble[0]}},{key:"unaryMinus",value:function(f){if(f.length===0)return f;var $=f.__copy();return $.sign=!f.sign,$}},{key:"bitwiseNot",value:function(f){return f.sign?b.__absoluteSubOne(f).__trim():b.__absoluteAddOne(f,!0)}},{key:"exponentiate",value:function(f,$){if($.sign)throw new RangeError("Exponent must be positive");if($.length===0)return b.__oneDigit(1,!1);if(f.length===0)return f;if(f.length===1&&f.__digit(0)===1)return f.sign&&(1&$.__digit(0))==0?b.unaryMinus(f):f;if(1<$.length)throw new RangeError("BigInt too big");var k=$.__unsignedDigit(0);if(k===1)return f;if(k>=b.__kMaxLengthBits)throw new RangeError("BigInt too big");if(f.length===1&&f.__digit(0)===2){var m=1+(k>>>5),g=f.sign&&(1&k)!=0,x=new b(m,g);x.__initializeDigits();var C=1<<(31&k);return x.__setDigit(m-1,C),x}var L=null,P=f;for((1&k)!=0&&(L=f),k>>=1;k!==0;k>>=1)P=b.multiply(P,P),(1&k)!=0&&(L===null?L=P:L=b.multiply(L,P));return L}},{key:"multiply",value:function(f,$){if(f.length===0)return f;if($.length===0)return $;var k=f.length+$.length;32<=f.__clzmsd()+$.__clzmsd()&&k--;var m=new b(k,f.sign!==$.sign);m.__initializeDigits();for(var g=0;g<f.length;g++)b.__multiplyAccumulate($,f.__digit(g),m,g);return m.__trim()}},{key:"divide",value:function(f,$){if($.length===0)throw new RangeError("Division by zero");if(0>b.__absoluteCompare(f,$))return b.__zero();var k,m=f.sign!==$.sign,g=$.__unsignedDigit(0);if($.length===1&&65535>=g){if(g===1)return m===f.sign?f:b.unaryMinus(f);k=b.__absoluteDivSmall(f,g,null)}else k=b.__absoluteDivLarge(f,$,!0,!1);return k.sign=m,k.__trim()}},{key:"remainder",value:function($,k){if(k.length===0)throw new RangeError("Division by zero");if(0>b.__absoluteCompare($,k))return $;var m=k.__unsignedDigit(0);if(k.length===1&&65535>=m){if(m===1)return b.__zero();var g=b.__absoluteModSmall($,m);return g===0?b.__zero():b.__oneDigit(g,$.sign)}var x=b.__absoluteDivLarge($,k,!1,!0);return x.sign=$.sign,x.__trim()}},{key:"add",value:function(f,$){var k=f.sign;return k===$.sign?b.__absoluteAdd(f,$,k):0<=b.__absoluteCompare(f,$)?b.__absoluteSub(f,$,k):b.__absoluteSub($,f,!k)}},{key:"subtract",value:function(f,$){var k=f.sign;return k===$.sign?0<=b.__absoluteCompare(f,$)?b.__absoluteSub(f,$,k):b.__absoluteSub($,f,!k):b.__absoluteAdd(f,$,k)}},{key:"leftShift",value:function(f,$){return $.length===0||f.length===0?f:$.sign?b.__rightShiftByAbsolute(f,$):b.__leftShiftByAbsolute(f,$)}},{key:"signedRightShift",value:function(f,$){return $.length===0||f.length===0?f:$.sign?b.__leftShiftByAbsolute(f,$):b.__rightShiftByAbsolute(f,$)}},{key:"unsignedRightShift",value:function(){throw new TypeError("BigInts have no unsigned right shift; use >> instead")}},{key:"lessThan",value:function(f,$){return 0>b.__compareToBigInt(f,$)}},{key:"lessThanOrEqual",value:function(f,$){return 0>=b.__compareToBigInt(f,$)}},{key:"greaterThan",value:function(f,$){return 0<b.__compareToBigInt(f,$)}},{key:"greaterThanOrEqual",value:function(f,$){return 0<=b.__compareToBigInt(f,$)}},{key:"equal",value:function(f,$){if(f.sign!==$.sign||f.length!==$.length)return!1;for(var k=0;k<f.length;k++)if(f.__digit(k)!==$.__digit(k))return!1;return!0}},{key:"notEqual",value:function(f,$){return!b.equal(f,$)}},{key:"bitwiseAnd",value:function(f,$){if(!f.sign&&!$.sign)return b.__absoluteAnd(f,$).__trim();if(f.sign&&$.sign){var k=E(f.length,$.length)+1,m=b.__absoluteSubOne(f,k),g=b.__absoluteSubOne($);return m=b.__absoluteOr(m,g,m),b.__absoluteAddOne(m,!0,m).__trim()}if(f.sign){var x=[$,f];f=x[0],$=x[1]}return b.__absoluteAndNot(f,b.__absoluteSubOne($)).__trim()}},{key:"bitwiseXor",value:function(f,$){if(!f.sign&&!$.sign)return b.__absoluteXor(f,$).__trim();if(f.sign&&$.sign){var k=E(f.length,$.length),m=b.__absoluteSubOne(f,k),g=b.__absoluteSubOne($);return b.__absoluteXor(m,g,m).__trim()}var x=E(f.length,$.length)+1;if(f.sign){var C=[$,f];f=C[0],$=C[1]}var L=b.__absoluteSubOne($,x);return L=b.__absoluteXor(L,f,L),b.__absoluteAddOne(L,!0,L).__trim()}},{key:"bitwiseOr",value:function(f,$){var k=E(f.length,$.length);if(!f.sign&&!$.sign)return b.__absoluteOr(f,$).__trim();if(f.sign&&$.sign){var m=b.__absoluteSubOne(f,k),g=b.__absoluteSubOne($);return m=b.__absoluteAnd(m,g,m),b.__absoluteAddOne(m,!0,m).__trim()}if(f.sign){var x=[$,f];f=x[0],$=x[1]}var C=b.__absoluteSubOne($,k);return C=b.__absoluteAndNot(C,f,C),b.__absoluteAddOne(C,!0,C).__trim()}},{key:"asIntN",value:function(f,$){if($.length===0)return $;if(f===0)return b.__zero();if(f>=b.__kMaxLengthBits)return $;var k=f+31>>>5;if($.length<k)return $;var m=$.__unsignedDigit(k-1),g=1<<(31&f-1);if($.length===k&&m<g)return $;if((m&g)!==g)return b.__truncateToNBits(f,$);if(!$.sign)return b.__truncateAndSubFromPowerOfTwo(f,$,!0);if((m&g-1)==0){for(var x=k-2;0<=x;x--)if($.__digit(x)!==0)return b.__truncateAndSubFromPowerOfTwo(f,$,!1);return $.length===k&&m===g?$:b.__truncateToNBits(f,$)}return b.__truncateAndSubFromPowerOfTwo(f,$,!1)}},{key:"asUintN",value:function(f,$){if($.length===0)return $;if(f===0)return b.__zero();if($.sign){if(f>b.__kMaxLengthBits)throw new RangeError("BigInt too big");return b.__truncateAndSubFromPowerOfTwo(f,$,!1)}if(f>=b.__kMaxLengthBits)return $;var k=f+31>>>5;if($.length<k)return $;var m=31&f;if($.length==k){if(m===0)return $;var g=$.__digit(k-1);if(!(g>>>m))return $}return b.__truncateToNBits(f,$)}},{key:"ADD",value:function(f,$){if(f=b.__toPrimitive(f),$=b.__toPrimitive($),typeof f=="string")return typeof $!="string"&&($=$.toString()),f+$;if(typeof $=="string")return f.toString()+$;if(f=b.__toNumeric(f),$=b.__toNumeric($),b.__isBigInt(f)&&b.__isBigInt($))return b.add(f,$);if(typeof f=="number"&&typeof $=="number")return f+$;throw new TypeError("Cannot mix BigInt and other types, use explicit conversions")}},{key:"LT",value:function(f,$){return b.__compare(f,$,0)}},{key:"LE",value:function(f,$){return b.__compare(f,$,1)}},{key:"GT",value:function(f,$){return b.__compare(f,$,2)}},{key:"GE",value:function(f,$){return b.__compare(f,$,3)}},{key:"EQ",value:function(f,$){for(;;){if(b.__isBigInt(f))return b.__isBigInt($)?b.equal(f,$):b.EQ($,f);if(typeof f=="number"){if(b.__isBigInt($))return b.__equalToNumber($,f);if(i($)!=="object")return f==$;$=b.__toPrimitive($)}else if(typeof f=="string"){if(b.__isBigInt($))return f=b.__fromString(f),f!==null&&b.equal(f,$);if(i($)!=="object")return f==$;$=b.__toPrimitive($)}else if(typeof f=="boolean"){if(b.__isBigInt($))return b.__equalToNumber($,+f);if(i($)!=="object")return f==$;$=b.__toPrimitive($)}else if(i(f)==="symbol"){if(b.__isBigInt($))return!1;if(i($)!=="object")return f==$;$=b.__toPrimitive($)}else if(i(f)==="object"){if(i($)==="object"&&$.constructor!==b)return f==$;f=b.__toPrimitive(f)}else return f==$}}},{key:"NE",value:function(f,$){return!b.EQ(f,$)}},{key:"__zero",value:function(){return new b(0,!1)}},{key:"__oneDigit",value:function(f,$){var k=new b(1,$);return k.__setDigit(0,f),k}},{key:"__decideRounding",value:function(f,$,k,m){if(0<$)return-1;var g;if(0>$)g=-$-1;else{if(k===0)return-1;k--,m=f.__digit(k),g=31}var x=1<<g;if((m&x)==0)return-1;if(x-=1,(m&x)!=0)return 1;for(;0<k;)if(k--,f.__digit(k)!==0)return 1;return 0}},{key:"__fromDouble",value:function(f){b.__kBitConversionDouble[0]=f;var $,k=2047&b.__kBitConversionInts[1]>>>20,m=k-1023,g=(m>>>5)+1,x=new b(g,0>f),C=1048575&b.__kBitConversionInts[1]|1048576,L=b.__kBitConversionInts[0],P=20,J=31&m,K=0;if(J<P){var j=P-J;K=j+32,$=C>>>j,C=C<<32-j|L>>>j,L<<=32-j}else if(J===P)K=32,$=C,C=L;else{var V=J-P;K=32-V,$=C<<V|L>>>32-V,C=L<<V}x.__setDigit(g-1,$);for(var G=g-2;0<=G;G--)0<K?(K-=32,$=C,C=L):$=0,x.__setDigit(G,$);return x.__trim()}},{key:"__isWhitespace",value:function(f){return 13>=f&&9<=f||(159>=f?f==32:131071>=f?f==160||f==5760:196607>=f?(f&=131071,10>=f||f==40||f==41||f==47||f==95||f==4096):f==65279)}},{key:"__fromString",value:function(f){var $=1<arguments.length&&arguments[1]!==void 0?arguments[1]:0,k=0,m=f.length,g=0;if(g===m)return b.__zero();for(var x=f.charCodeAt(g);b.__isWhitespace(x);){if(++g===m)return b.__zero();x=f.charCodeAt(g)}if(x===43){if(++g===m)return null;x=f.charCodeAt(g),k=1}else if(x===45){if(++g===m)return null;x=f.charCodeAt(g),k=-1}if($===0){if($=10,x===48){if(++g===m)return b.__zero();if(x=f.charCodeAt(g),x===88||x===120){if($=16,++g===m)return null;x=f.charCodeAt(g)}else if(x===79||x===111){if($=8,++g===m)return null;x=f.charCodeAt(g)}else if(x===66||x===98){if($=2,++g===m)return null;x=f.charCodeAt(g)}}}else if($===16&&x===48){if(++g===m)return b.__zero();if(x=f.charCodeAt(g),x===88||x===120){if(++g===m)return null;x=f.charCodeAt(g)}}for(;x===48;){if(++g===m)return b.__zero();x=f.charCodeAt(g)}var C=m-g,L=b.__kMaxBitsPerChar[$],P=b.__kBitsPerCharTableMultiplier-1;if(C>1073741824/L)return null;var J=L*C+P>>>b.__kBitsPerCharTableShift,K=new b(J+31>>>5,!1),j=10>$?$:10,V=10<$?$-10:0;if(($&$-1)==0){L>>=b.__kBitsPerCharTableShift;var G=[],X=[],Q=!1;do{for(var Z,te=0,ae=0;;){if(Z=void 0,x-48>>>0<j)Z=x-48;else if((32|x)-97>>>0<V)Z=(32|x)-87;else{Q=!0;break}if(ae+=L,te=te<<L|Z,++g===m){Q=!0;break}if(x=f.charCodeAt(g),32<ae+L)break}G.push(te),X.push(ae)}while(!Q);b.__fillFromParts(K,G,X)}else{K.__initializeDigits();var le=!1,re=0;do{for(var ke,oe=0,he=1;;){if(ke=void 0,x-48>>>0<j)ke=x-48;else if((32|x)-97>>>0<V)ke=(32|x)-87;else{le=!0;break}var $e=he*$;if(4294967295<$e)break;if(he=$e,oe=oe*$+ke,re++,++g===m){le=!0;break}x=f.charCodeAt(g)}P=32*b.__kBitsPerCharTableMultiplier-1;var _e=L*re+P>>>b.__kBitsPerCharTableShift+5;K.__inplaceMultiplyAdd(he,oe,_e)}while(!le)}if(g!==m){if(!b.__isWhitespace(x))return null;for(g++;g<m;g++)if(x=f.charCodeAt(g),!b.__isWhitespace(x))return null}return k!==0&&$!==10?null:(K.sign=k===-1,K.__trim())}},{key:"__fillFromParts",value:function(f,$,k){for(var m=0,g=0,x=0,C=$.length-1;0<=C;C--){var L=$[C],P=k[C];g|=L<<x,x+=P,x===32?(f.__setDigit(m++,g),x=0,g=0):32<x&&(f.__setDigit(m++,g),x-=32,g=L>>>P-x)}if(g!==0){if(m>=f.length)throw new Error("implementation bug");f.__setDigit(m++,g)}for(;m<f.length;m++)f.__setDigit(m,0)}},{key:"__toStringBasePowerOfTwo",value:function(f,$){var k=f.length,m=$-1;m=(85&m>>>1)+(85&m),m=(51&m>>>2)+(51&m),m=(15&m>>>4)+(15&m);var g=m,x=$-1,C=f.__digit(k-1),L=b.__clz32(C),P=0|(32*k-L+g-1)/g;if(f.sign&&P++,268435456<P)throw new Error("string too long");for(var J=Array(P),K=P-1,j=0,V=0,G=0;G<k-1;G++){var X=f.__digit(G),Q=(j|X<<V)&x;J[K--]=b.__kConversionChars[Q];var Z=g-V;for(j=X>>>Z,V=32-Z;V>=g;)J[K--]=b.__kConversionChars[j&x],j>>>=g,V-=g}var te=(j|C<<V)&x;for(J[K--]=b.__kConversionChars[te],j=C>>>g-V;j!==0;)J[K--]=b.__kConversionChars[j&x],j>>>=g;if(f.sign&&(J[K--]="-"),K!==-1)throw new Error("implementation bug");return J.join("")}},{key:"__toStringGeneric",value:function(f,$,k){var m=f.length;if(m===0)return"";if(m===1){var g=f.__unsignedDigit(0).toString($);return k===!1&&f.sign&&(g="-"+g),g}var x=32*m-b.__clz32(f.__digit(m-1)),C=b.__kMaxBitsPerChar[$],L=C-1,P=x*b.__kBitsPerCharTableMultiplier;P+=L-1,P=0|P/L;var J,K,j=P+1>>1,V=b.exponentiate(b.__oneDigit($,!1),b.__oneDigit(j,!1)),G=V.__unsignedDigit(0);if(V.length===1&&65535>=G){J=new b(f.length,!1),J.__initializeDigits();for(var X,Q=0,Z=2*f.length-1;0<=Z;Z--)X=Q<<16|f.__halfDigit(Z),J.__setHalfDigit(Z,0|X/G),Q=0|X%G;K=Q.toString($)}else{var te=b.__absoluteDivLarge(f,V,!0,!0);J=te.quotient;var ae=te.remainder.__trim();K=b.__toStringGeneric(ae,$,!0)}J.__trim();for(var le=b.__toStringGeneric(J,$,!0);K.length<j;)K="0"+K;return k===!1&&f.sign&&(le="-"+le),le+K}},{key:"__unequalSign",value:function(f){return f?-1:1}},{key:"__absoluteGreater",value:function(f){return f?-1:1}},{key:"__absoluteLess",value:function(f){return f?1:-1}},{key:"__compareToBigInt",value:function(f,$){var k=f.sign;if(k!==$.sign)return b.__unequalSign(k);var m=b.__absoluteCompare(f,$);return 0<m?b.__absoluteGreater(k):0>m?b.__absoluteLess(k):0}},{key:"__compareToNumber",value:function(f,$){if(!0|$){var k=f.sign,m=0>$;if(k!==m)return b.__unequalSign(k);if(f.length===0){if(m)throw new Error("implementation bug");return $===0?0:-1}if(1<f.length)return b.__absoluteGreater(k);var g=_($),x=f.__unsignedDigit(0);return x>g?b.__absoluteGreater(k):x<g?b.__absoluteLess(k):0}return b.__compareToDouble(f,$)}},{key:"__compareToDouble",value:function(f,$){if($!==$)return $;if($===1/0)return-1;if($===-1/0)return 1;var k=f.sign;if(k!==0>$)return b.__unequalSign(k);if($===0)throw new Error("implementation bug: should be handled elsewhere");if(f.length===0)return-1;b.__kBitConversionDouble[0]=$;var m=2047&b.__kBitConversionInts[1]>>>20;if(m==2047)throw new Error("implementation bug: handled elsewhere");var g=m-1023;if(0>g)return b.__absoluteGreater(k);var x=f.length,C=f.__digit(x-1),L=b.__clz32(C),P=32*x-L,J=g+1;if(P<J)return b.__absoluteLess(k);if(P>J)return b.__absoluteGreater(k);var K=1048576|1048575&b.__kBitConversionInts[1],j=b.__kBitConversionInts[0],V=20,G=31-L;if(G!==(P-1)%31)throw new Error("implementation bug");var X,Q=0;if(G<V){var Z=V-G;Q=Z+32,X=K>>>Z,K=K<<32-Z|j>>>Z,j<<=32-Z}else if(G===V)Q=32,X=K,K=j;else{var te=G-V;Q=32-te,X=K<<te|j>>>32-te,K=j<<te}if(C>>>=0,X>>>=0,C>X)return b.__absoluteGreater(k);if(C<X)return b.__absoluteLess(k);for(var ae=x-2;0<=ae;ae--){0<Q?(Q-=32,X=K>>>0,K=j,j=0):X=0;var le=f.__unsignedDigit(ae);if(le>X)return b.__absoluteGreater(k);if(le<X)return b.__absoluteLess(k)}if(K!==0||j!==0){if(Q===0)throw new Error("implementation bug");return b.__absoluteLess(k)}return 0}},{key:"__equalToNumber",value:function(f,$){return $|$===0?$===0?f.length===0:f.length===1&&f.sign===0>$&&f.__unsignedDigit(0)===_($):b.__compareToDouble(f,$)===0}},{key:"__comparisonResultToBool",value:function(f,$){switch($){case 0:return 0>f;case 1:return 0>=f;case 2:return 0<f;case 3:return 0<=f}throw new Error("unreachable")}},{key:"__compare",value:function(f,$,k){if(f=b.__toPrimitive(f),$=b.__toPrimitive($),typeof f=="string"&&typeof $=="string")switch(k){case 0:return f<$;case 1:return f<=$;case 2:return f>$;case 3:return f>=$}if(b.__isBigInt(f)&&typeof $=="string")return $=b.__fromString($),$!==null&&b.__comparisonResultToBool(b.__compareToBigInt(f,$),k);if(typeof f=="string"&&b.__isBigInt($))return f=b.__fromString(f),f!==null&&b.__comparisonResultToBool(b.__compareToBigInt(f,$),k);if(f=b.__toNumeric(f),$=b.__toNumeric($),b.__isBigInt(f)){if(b.__isBigInt($))return b.__comparisonResultToBool(b.__compareToBigInt(f,$),k);if(typeof $!="number")throw new Error("implementation bug");return b.__comparisonResultToBool(b.__compareToNumber(f,$),k)}if(typeof f!="number")throw new Error("implementation bug");if(b.__isBigInt($))return b.__comparisonResultToBool(b.__compareToNumber($,f),2^k);if(typeof $!="number")throw new Error("implementation bug");return k===0?f<$:k===1?f<=$:k===2?f>$:k===3?f>=$:void 0}},{key:"__absoluteAdd",value:function(f,$,k){if(f.length<$.length)return b.__absoluteAdd($,f,k);if(f.length===0)return f;if($.length===0)return f.sign===k?f:b.unaryMinus(f);var m=f.length;(f.__clzmsd()===0||$.length===f.length&&$.__clzmsd()===0)&&m++;for(var g=new b(m,k),x=0,C=0;C<$.length;C++){var L=$.__digit(C),P=f.__digit(C),J=(65535&P)+(65535&L)+x,K=(P>>>16)+(L>>>16)+(J>>>16);x=K>>>16,g.__setDigit(C,65535&J|K<<16)}for(;C<f.length;C++){var j=f.__digit(C),V=(65535&j)+x,G=(j>>>16)+(V>>>16);x=G>>>16,g.__setDigit(C,65535&V|G<<16)}return C<g.length&&g.__setDigit(C,x),g.__trim()}},{key:"__absoluteSub",value:function(f,$,k){if(f.length===0)return f;if($.length===0)return f.sign===k?f:b.unaryMinus(f);for(var m=new b(f.length,k),g=0,x=0;x<$.length;x++){var C=f.__digit(x),L=$.__digit(x),P=(65535&C)-(65535&L)-g;g=1&P>>>16;var J=(C>>>16)-(L>>>16)-g;g=1&J>>>16,m.__setDigit(x,65535&P|J<<16)}for(;x<f.length;x++){var K=f.__digit(x),j=(65535&K)-g;g=1&j>>>16;var V=(K>>>16)-g;g=1&V>>>16,m.__setDigit(x,65535&j|V<<16)}return m.__trim()}},{key:"__absoluteAddOne",value:function(f,$){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null,m=f.length;k===null?k=new b(m,$):k.sign=$;for(var g,x=!0,C=0;C<m;C++){if(g=f.__digit(C),x){var L=g===-1;g=0|g+1,x=L}k.__setDigit(C,g)}return x&&k.__setDigitGrow(m,1),k}},{key:"__absoluteSubOne",value:function(f,$){var k=f.length;$=$||k;for(var m,g=new b($,!1),x=!0,C=0;C<k;C++){if(m=f.__digit(C),x){var L=m===0;m=0|m-1,x=L}g.__setDigit(C,m)}if(x)throw new Error("implementation bug");for(var P=k;P<$;P++)g.__setDigit(P,0);return g}},{key:"__absoluteAnd",value:function(f,$){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null,m=f.length,g=$.length,x=g;if(m<g){x=m;var C=f,L=m;f=$,m=g,$=C,g=L}var P=x;k===null?k=new b(P,!1):P=k.length;for(var J=0;J<x;J++)k.__setDigit(J,f.__digit(J)&$.__digit(J));for(;J<P;J++)k.__setDigit(J,0);return k}},{key:"__absoluteAndNot",value:function(f,$){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null,m=f.length,g=$.length,x=g;m<g&&(x=m);var C=m;k===null?k=new b(C,!1):C=k.length;for(var L=0;L<x;L++)k.__setDigit(L,f.__digit(L)&~$.__digit(L));for(;L<m;L++)k.__setDigit(L,f.__digit(L));for(;L<C;L++)k.__setDigit(L,0);return k}},{key:"__absoluteOr",value:function(f,$){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null,m=f.length,g=$.length,x=g;if(m<g){x=m;var C=f,L=m;f=$,m=g,$=C,g=L}var P=m;k===null?k=new b(P,!1):P=k.length;for(var J=0;J<x;J++)k.__setDigit(J,f.__digit(J)|$.__digit(J));for(;J<m;J++)k.__setDigit(J,f.__digit(J));for(;J<P;J++)k.__setDigit(J,0);return k}},{key:"__absoluteXor",value:function(f,$){var k=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null,m=f.length,g=$.length,x=g;if(m<g){x=m;var C=f,L=m;f=$,m=g,$=C,g=L}var P=m;k===null?k=new b(P,!1):P=k.length;for(var J=0;J<x;J++)k.__setDigit(J,f.__digit(J)^$.__digit(J));for(;J<m;J++)k.__setDigit(J,f.__digit(J));for(;J<P;J++)k.__setDigit(J,0);return k}},{key:"__absoluteCompare",value:function(f,$){var k=f.length-$.length;if(k!=0)return k;for(var m=f.length-1;0<=m&&f.__digit(m)===$.__digit(m);)m--;return 0>m?0:f.__unsignedDigit(m)>$.__unsignedDigit(m)?1:-1}},{key:"__multiplyAccumulate",value:function(f,$,k,m){if($!==0){for(var g=65535&$,x=$>>>16,C=0,L=0,P=0,J=0;J<f.length;J++,m++){var K=k.__digit(m),j=65535&K,V=K>>>16,G=f.__digit(J),X=65535&G,Q=G>>>16,Z=b.__imul(X,g),te=b.__imul(X,x),ae=b.__imul(Q,g),le=b.__imul(Q,x);j+=L+(65535&Z),V+=P+C+(j>>>16)+(Z>>>16)+(65535&te)+(65535&ae),C=V>>>16,L=(te>>>16)+(ae>>>16)+(65535&le)+C,C=L>>>16,L&=65535,P=le>>>16,K=65535&j|V<<16,k.__setDigit(m,K)}for(;C!==0||L!==0||P!==0;m++){var re=k.__digit(m),ke=(65535&re)+L,oe=(re>>>16)+(ke>>>16)+P+C;L=0,P=0,C=oe>>>16,re=65535&ke|oe<<16,k.__setDigit(m,re)}}}},{key:"__internalMultiplyAdd",value:function(f,$,k,m,g){for(var x=k,C=0,L=0;L<m;L++){var P=f.__digit(L),J=b.__imul(65535&P,$),K=(65535&J)+C+x;x=K>>>16;var j=b.__imul(P>>>16,$),V=(65535&j)+(J>>>16)+x;x=V>>>16,C=j>>>16,g.__setDigit(L,V<<16|65535&K)}if(g.length>m)for(g.__setDigit(m++,x+C);m<g.length;)g.__setDigit(m++,0);else if(x+C!==0)throw new Error("implementation bug")}},{key:"__absoluteDivSmall",value:function(f,$,k){k===null&&(k=new b(f.length,!1));for(var m=0,g=2*f.length-1;0<=g;g-=2){var x=(m<<16|f.__halfDigit(g))>>>0,C=0|x/$;m=0|x%$,x=(m<<16|f.__halfDigit(g-1))>>>0;var L=0|x/$;m=0|x%$,k.__setDigit(g>>>1,C<<16|L)}return k}},{key:"__absoluteModSmall",value:function(f,$){for(var k,m=0,g=2*f.length-1;0<=g;g--)k=(m<<16|f.__halfDigit(g))>>>0,m=0|k%$;return m}},{key:"__absoluteDivLarge",value:function(f,$,k,m){var g=$.__halfDigitLength(),x=$.length,C=f.__halfDigitLength()-g,L=null;k&&(L=new b(C+2>>>1,!1),L.__initializeDigits());var P=new b(g+2>>>1,!1);P.__initializeDigits();var J=b.__clz16($.__halfDigit(g-1));0<J&&($=b.__specialLeftShift($,J,0));for(var K=b.__specialLeftShift(f,J,1),j=$.__halfDigit(g-1),V=0,G=C;0<=G;G--){var X=65535,Q=K.__halfDigit(G+g);if(Q!==j){var Z=(Q<<16|K.__halfDigit(G+g-1))>>>0;X=0|Z/j;for(var te=0|Z%j,ae=$.__halfDigit(g-2),le=K.__halfDigit(G+g-2);b.__imul(X,ae)>>>0>(te<<16|le)>>>0&&(X--,te+=j,!(65535<te)););}b.__internalMultiplyAdd($,X,0,x,P);var re=K.__inplaceSub(P,G,g+1);re!==0&&(re=K.__inplaceAdd($,G,g),K.__setHalfDigit(G+g,K.__halfDigit(G+g)+re),X--),k&&(1&G?V=X<<16:L.__setDigit(G>>>1,V|X))}return m?(K.__inplaceRightShift(J),k?{quotient:L,remainder:K}:K):k?L:void 0}},{key:"__clz16",value:function(f){return b.__clz32(f)-16}},{key:"__specialLeftShift",value:function(f,$,k){var m=f.length,g=new b(m+k,!1);if($===0){for(var x=0;x<m;x++)g.__setDigit(x,f.__digit(x));return 0<k&&g.__setDigit(m,0),g}for(var C,L=0,P=0;P<m;P++)C=f.__digit(P),g.__setDigit(P,C<<$|L),L=C>>>32-$;return 0<k&&g.__setDigit(m,L),g}},{key:"__leftShiftByAbsolute",value:function(f,$){var k=b.__toShiftAmount($);if(0>k)throw new RangeError("BigInt too big");var m=k>>>5,g=31&k,x=f.length,C=g!==0&&f.__digit(x-1)>>>32-g!=0,L=x+m+(C?1:0),P=new b(L,f.sign);if(g===0){for(var J=0;J<m;J++)P.__setDigit(J,0);for(;J<L;J++)P.__setDigit(J,f.__digit(J-m))}else{for(var K=0,j=0;j<m;j++)P.__setDigit(j,0);for(var V,G=0;G<x;G++)V=f.__digit(G),P.__setDigit(G+m,V<<g|K),K=V>>>32-g;if(C)P.__setDigit(x+m,K);else if(K!==0)throw new Error("implementation bug")}return P.__trim()}},{key:"__rightShiftByAbsolute",value:function(f,$){var k=f.length,m=f.sign,g=b.__toShiftAmount($);if(0>g)return b.__rightShiftByMaximum(m);var x=g>>>5,C=31&g,L=k-x;if(0>=L)return b.__rightShiftByMaximum(m);var P=!1;if(m){if((f.__digit(x)&(1<<C)-1)!=0)P=!0;else for(var J=0;J<x;J++)if(f.__digit(J)!==0){P=!0;break}}if(P&&C===0){var K=f.__digit(k-1);~K==0&&L++}var j=new b(L,m);if(C===0)for(var V=x;V<k;V++)j.__setDigit(V-x,f.__digit(V));else{for(var G,X=f.__digit(x)>>>C,Q=k-x-1,Z=0;Z<Q;Z++)G=f.__digit(Z+x+1),j.__setDigit(Z,G<<32-C|X),X=G>>>C;j.__setDigit(Q,X)}return P&&(j=b.__absoluteAddOne(j,!0,j)),j.__trim()}},{key:"__rightShiftByMaximum",value:function(f){return f?b.__oneDigit(1,!0):b.__zero()}},{key:"__toShiftAmount",value:function(f){if(1<f.length)return-1;var $=f.__unsignedDigit(0);return $>b.__kMaxLengthBits?-1:$}},{key:"__toPrimitive",value:function(f){var $=1<arguments.length&&arguments[1]!==void 0?arguments[1]:"default";if(i(f)!=="object"||f.constructor===b)return f;var k=f[Symbol.toPrimitive];if(k){var m=k($);if(i(m)!=="object")return m;throw new TypeError("Cannot convert object to primitive value")}var g=f.valueOf;if(g){var x=g.call(f);if(i(x)!=="object")return x}var C=f.toString;if(C){var L=C.call(f);if(i(L)!=="object")return L}throw new TypeError("Cannot convert object to primitive value")}},{key:"__toNumeric",value:function(f){return b.__isBigInt(f)?f:+f}},{key:"__isBigInt",value:function(f){return i(f)==="object"&&f.constructor===b}},{key:"__truncateToNBits",value:function(f,$){for(var k=f+31>>>5,m=new b(k,$.sign),g=k-1,x=0;x<g;x++)m.__setDigit(x,$.__digit(x));var C=$.__digit(g);if((31&f)!=0){var L=32-(31&f);C=C<<L>>>L}return m.__setDigit(g,C),m.__trim()}},{key:"__truncateAndSubFromPowerOfTwo",value:function(f,$,k){for(var m=Math.min,g=f+31>>>5,x=new b(g,k),C=0,L=g-1,P=0,J=m(L,$.length);C<J;C++){var K=$.__digit(C),j=0-(65535&K)-P;P=1&j>>>16;var V=0-(K>>>16)-P;P=1&V>>>16,x.__setDigit(C,65535&j|V<<16)}for(;C<L;C++)x.__setDigit(C,0|-P);var G,X=L<$.length?$.__digit(L):0,Q=31&f;if(Q===0){var Z=0-(65535&X)-P;P=1&Z>>>16;var te=0-(X>>>16)-P;G=65535&Z|te<<16}else{var ae=32-Q;X=X<<ae>>>ae;var le=1<<32-ae,re=(65535&le)-(65535&X)-P;P=1&re>>>16;var ke=(le>>>16)-(X>>>16)-P;G=65535&re|ke<<16,G&=le-1}return x.__setDigit(L,G),x.__trim()}},{key:"__digitPow",value:function(f,$){for(var k=1;0<$;)1&$&&(k*=f),$>>>=1,f*=f;return k}}]),b})(B(Array));return l.__kMaxLength=33554432,l.__kMaxLengthBits=l.__kMaxLength<<5,l.__kMaxBitsPerChar=[0,0,32,51,64,75,83,90,96,102,107,111,115,119,122,126,128,131,134,136,139,141,143,145,147,149,151,153,154,156,158,159,160,162,163,165,166],l.__kBitsPerCharTableShift=5,l.__kBitsPerCharTableMultiplier=1<<l.__kBitsPerCharTableShift,l.__kConversionChars=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],l.__kBitConversionBuffer=new ArrayBuffer(8),l.__kBitConversionDouble=new Float64Array(l.__kBitConversionBuffer),l.__kBitConversionInts=new Int32Array(l.__kBitConversionBuffer),l.__clz32=a||function(d){var _=Math.LN2,E=Math.log;return d===0?32:0|31-(0|E(d>>>0)/_)},l.__imul=n||function(d,_){return 0|d*_},l})}),"./node_modules/process/browser.js":(function(Y,y){var t=Y.exports={},n,a;function i(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?n=setTimeout:n=i}catch{n=i}try{typeof clearTimeout=="function"?a=clearTimeout:a=r}catch{a=r}})();function o(s){if(n===setTimeout)return setTimeout(s,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(s,0);try{return n(s,0)}catch{try{return n.call(null,s,0)}catch{return n.call(this,s,0)}}}function p(s){if(a===clearTimeout)return clearTimeout(s);if((a===r||!a)&&clearTimeout)return a=clearTimeout,clearTimeout(s);try{return a(s)}catch{try{return a.call(null,s)}catch{return a.call(this,s)}}}var w=[],T=!1,A,S=-1;function O(){!T||!A||(T=!1,A.length?w=A.concat(w):S=-1,w.length&&D())}function D(){if(!T){var s=o(O);T=!0;for(var v=w.length;v;){for(A=w,w=[];++S<v;)A&&A[S].run();S=-1,v=w.length}A=null,T=!1,p(s)}}t.nextTick=function(s){var v=new Array(arguments.length-1);if(arguments.length>1)for(var N=1;N<arguments.length;N++)v[N-1]=arguments[N];w.push(new B(s,v)),w.length===1&&!T&&o(D)};function B(s,v){this.fun=s,this.array=v}B.prototype.run=function(){this.fun.apply(null,this.array)},t.title="browser",t.browser=!0,t.env={},t.argv=[],t.version="",t.versions={};function F(){}t.on=F,t.addListener=F,t.once=F,t.off=F,t.removeListener=F,t.removeAllListeners=F,t.emit=F,t.prependListener=F,t.prependOnceListener=F,t.listeners=function(s){return[]},t.binding=function(s){throw new Error("process.binding is not supported")},t.cwd=function(){return"/"},t.chdir=function(s){throw new Error("process.chdir is not supported")},t.umask=function(){return 0}}),"./node_modules/setimmediate/setImmediate.js":(function(Y,y,t){(function(n,a){(function(i,r){"use strict";if(i.setImmediate)return;var o=1,p={},w=!1,T=i.document,A;function S(d){typeof d!="function"&&(d=new Function(""+d));for(var _=new Array(arguments.length-1),E=0;E<_.length;E++)_[E]=arguments[E+1];var b={callback:d,args:_};return p[o]=b,A(o),o++}function O(d){delete p[d]}function D(d){var _=d.callback,E=d.args;switch(E.length){case 0:_();break;case 1:_(E[0]);break;case 2:_(E[0],E[1]);break;case 3:_(E[0],E[1],E[2]);break;default:_.apply(r,E);break}}function B(d){if(w)setTimeout(B,0,d);else{var _=p[d];if(_){w=!0;try{D(_)}finally{O(d),w=!1}}}}function F(){A=function(d){a.nextTick(function(){B(d)})}}function s(){if(i.postMessage&&!i.importScripts){var d=!0,_=i.onmessage;return i.onmessage=function(){d=!1},i.postMessage("","*"),i.onmessage=_,d}}function v(){var d="setImmediate$"+Math.random()+"$",_=function(E){E.source===i&&typeof E.data=="string"&&E.data.indexOf(d)===0&&B(+E.data.slice(d.length))};i.addEventListener?i.addEventListener("message",_,!1):i.attachEvent("onmessage",_),A=function(E){i.postMessage(d+E,"*")}}function N(){var d=new MessageChannel;d.port1.onmessage=function(_){var E=_.data;B(E)},A=function(_){d.port2.postMessage(_)}}function h(){var d=T.documentElement;A=function(_){var E=T.createElement("script");E.onreadystatechange=function(){B(_),E.onreadystatechange=null,d.removeChild(E),E=null},d.appendChild(E)}}function c(){A=function(d){setTimeout(B,0,d)}}var l=Object.getPrototypeOf&&Object.getPrototypeOf(i);l=l&&l.setTimeout?l:i,{}.toString.call(i.process)==="[object process]"?F():s()?v():i.MessageChannel?N():T&&"onreadystatechange"in T.createElement("script")?h():c(),l.setImmediate=S,l.clearImmediate=O})(typeof self>"u"?typeof n>"u"?this:n:self)}).call(this,t("./node_modules/webpack/buildin/global.js"),t("./node_modules/process/browser.js"))}),"./node_modules/strftime/strftime.js":(function(Y,y){(function(){var t={de_DE:{days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],shortDays:["So","Mo","Di","Mi","Do","Fr","Sa"],months:["Januar","Februar","M\xE4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],shortMonths:["Jan","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d.%m.%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},en_CA:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ordinalSuffixes:["st","nd","rd","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","st","nd","rd","th","th","th","th","th","th","th","st"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d/%m/%y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%r",x:"%D"}},en_US:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ordinalSuffixes:["st","nd","rd","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","st","nd","rd","th","th","th","th","th","th","th","st"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%m/%d/%y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%r",x:"%D"}},es_MX:{days:["domingo","lunes","martes","mi\xE9rcoles","jueves","viernes","s\xE1bado"],shortDays:["dom","lun","mar","mi\xE9","jue","vie","s\xE1b"],months:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre"," diciembre"],shortMonths:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d/%m/%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},fr_FR:{days:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],shortDays:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],months:["janvier","f\xE9vrier","mars","avril","mai","juin","juillet","ao\xFBt","septembre","octobre","novembre","d\xE9cembre"],shortMonths:["janv.","f\xE9vr.","mars","avril","mai","juin","juil.","ao\xFBt","sept.","oct.","nov.","d\xE9c."],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d/%m/%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},it_IT:{days:["domenica","luned\xEC","marted\xEC","mercoled\xEC","gioved\xEC","venerd\xEC","sabato"],shortDays:["dom","lun","mar","mer","gio","ven","sab"],months:["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],shortMonths:["pr","mag","giu","lug","ago","set","ott","nov","dic"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d/%m/%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},nl_NL:{days:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],shortDays:["zo","ma","di","wo","do","vr","za"],months:["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],shortMonths:["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d-%m-%y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},pt_BR:{days:["domingo","segunda","ter\xE7a","quarta","quinta","sexta","s\xE1bado"],shortDays:["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"],months:["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],shortMonths:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X %Z",D:"%d-%m-%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},ru_RU:{days:["\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435","\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A","\u0412\u0442\u043E\u0440\u043D\u0438\u043A","\u0421\u0440\u0435\u0434\u0430","\u0427\u0435\u0442\u0432\u0435\u0440\u0433","\u041F\u044F\u0442\u043D\u0438\u0446\u0430","\u0421\u0443\u0431\u0431\u043E\u0442\u0430"],shortDays:["\u0412\u0441","\u041F\u043D","\u0412\u0442","\u0421\u0440","\u0427\u0442","\u041F\u0442","\u0421\u0431"],months:["\u042F\u043D\u0432\u0430\u0440\u044C","\u0424\u0435\u0432\u0440\u0430\u043B\u044C","\u041C\u0430\u0440\u0442","\u0410\u043F\u0440\u0435\u043B\u044C","\u041C\u0430\u0439","\u0418\u044E\u043D\u044C","\u0418\u044E\u043B\u044C","\u0410\u0432\u0433\u0443\u0441\u0442","\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u041E\u043A\u0442\u044F\u0431\u0440\u044C","\u041D\u043E\u044F\u0431\u0440\u044C","\u0414\u0435\u043A\u0430\u0431\u0440\u044C"],shortMonths:["\u044F\u043D\u0432","\u0444\u0435\u0432","\u043C\u0430\u0440","\u0430\u043F\u0440","\u043C\u0430\u0439","\u0438\u044E\u043D","\u0438\u044E\u043B","\u0430\u0432\u0433","\u0441\u0435\u043D","\u043E\u043A\u0442","\u043D\u043E\u044F","\u0434\u0435\u043A"],AM:"AM",PM:"PM",am:"am",pm:"pm",formats:{c:"%a %d %b %Y %X",D:"%d.%m.%y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},tr_TR:{days:["Pazar","Pazartesi","Sal\u0131","\xC7ar\u015Famba","Per\u015Fembe","Cuma","Cumartesi"],shortDays:["Paz","Pzt","Sal","\xC7r\u015F","Pr\u015F","Cum","Cts"],months:["Ocak","\u015Eubat","Mart","Nisan","May\u0131s","Haziran","Temmuz","A\u011Fustos","Eyl\xFCl","Ekim","Kas\u0131m","Aral\u0131k"],shortMonths:["Oca","\u015Eub","Mar","Nis","May","Haz","Tem","A\u011Fu","Eyl","Eki","Kas","Ara"],AM:"\xD6\xD6",PM:"\xD6S",am:"\xD6\xD6",pm:"\xD6S",formats:{c:"%a %d %b %Y %X %Z",D:"%d-%m-%Y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%T",x:"%D"}},zh_CN:{days:["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"],shortDays:["\u65E5","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D"],months:["\u4E00\u6708\u4EFD","\u4E8C\u6708\u4EFD","\u4E09\u6708\u4EFD","\u56DB\u6708\u4EFD","\u4E94\u6708\u4EFD","\u516D\u6708\u4EFD","\u4E03\u6708\u4EFD","\u516B\u6708\u4EFD","\u4E5D\u6708\u4EFD","\u5341\u6708\u4EFD","\u5341\u4E00\u6708\u4EFD","\u5341\u4E8C\u6708\u4EFD"],shortMonths:["\u4E00\u6708","\u4E8C\u6708","\u4E09\u6708","\u56DB\u6708","\u4E94\u6708","\u516D\u6708","\u4E03\u6708","\u516B\u6708","\u4E5D\u6708","\u5341\u6708","\u5341\u4E00\u6708","\u5341\u4E8C\u6708"],AM:"\u4E0A\u5348",PM:"\u4E0B\u5348",am:"\u4E0A\u5348",pm:"\u4E0B\u5348",formats:{c:"%a %d %b %Y %X %Z",D:"%d/%m/%y",F:"%Y-%m-%d",R:"%H:%M",r:"%I:%M:%S %p",T:"%H:%M:%S",v:"%e-%b-%Y",X:"%r",x:"%D"}}},n=t.en_US,a=new o(n,0,!1),i=typeof Y<"u",r;i?r=Y.exports=a:(r=(function(){return this||(0,eval)("this")})(),r.strftime=a),typeof Date.now!="function"&&(Date.now=function(){return+new Date});function o(B,F,s){var v=B||n,N=F||0,h=s||!1,c=0,l;function d(b,R){var f;if(R){if(f=R.getTime(),h){var k=O(R);if(R=new Date(f+k+N),O(R)!==k){var m=O(R);R=new Date(f+m+N)}}}else{var $=Date.now();$>c?(c=$,l=new Date(c),f=c,h&&(l=new Date(c+O(l)+N))):f=c,R=l}return _(b,R,v,f)}function _(b,R,f,$){for(var k="",m=null,g=!1,x=b.length,C=!1,L=0;L<x;L++){var P=b.charCodeAt(L);if(g===!0){if(P===45){m="";continue}else if(P===95){m=" ";continue}else if(P===48){m="0";continue}else if(P===58){C&&D("[WARNING] detected use of unsupported %:: or %::: modifiers to strftime"),C=!0;continue}switch(P){case 37:k+="%";break;case 65:k+=f.days[R.getDay()];break;case 66:k+=f.months[R.getMonth()];break;case 67:k+=p(Math.floor(R.getFullYear()/100),m);break;case 68:k+=_(f.formats.D,R,f,$);break;case 70:k+=_(f.formats.F,R,f,$);break;case 72:k+=p(R.getHours(),m);break;case 73:k+=p(T(R.getHours()),m);break;case 76:k+=w(Math.floor($%1e3));break;case 77:k+=p(R.getMinutes(),m);break;case 80:k+=R.getHours()<12?f.am:f.pm;break;case 82:k+=_(f.formats.R,R,f,$);break;case 83:k+=p(R.getSeconds(),m);break;case 84:k+=_(f.formats.T,R,f,$);break;case 85:k+=p(A(R,"sunday"),m);break;case 87:k+=p(A(R,"monday"),m);break;case 88:k+=_(f.formats.X,R,f,$);break;case 89:k+=R.getFullYear();break;case 90:if(h&&N===0)k+="GMT";else{var J=R.toString().match(/\(([\w\s]+)\)/);k+=J&&J[1]||""}break;case 97:k+=f.shortDays[R.getDay()];break;case 98:k+=f.shortMonths[R.getMonth()];break;case 99:k+=_(f.formats.c,R,f,$);break;case 100:k+=p(R.getDate(),m);break;case 101:k+=p(R.getDate(),m??" ");break;case 104:k+=f.shortMonths[R.getMonth()];break;case 106:var K=new Date(R.getFullYear(),0,1),j=Math.ceil((R.getTime()-K.getTime())/(1e3*60*60*24));k+=w(j);break;case 107:k+=p(R.getHours(),m??" ");break;case 108:k+=p(T(R.getHours()),m??" ");break;case 109:k+=p(R.getMonth()+1,m);break;case 110:k+=`
`;break;case 111:var j=R.getDate();f.ordinalSuffixes?k+=String(j)+(f.ordinalSuffixes[j-1]||S(j)):k+=String(j)+S(j);break;case 112:k+=R.getHours()<12?f.AM:f.PM;break;case 114:k+=_(f.formats.r,R,f,$);break;case 115:k+=Math.floor($/1e3);break;case 116:k+="	";break;case 117:var j=R.getDay();k+=j===0?7:j;break;case 118:k+=_(f.formats.v,R,f,$);break;case 119:k+=R.getDay();break;case 120:k+=_(f.formats.x,R,f,$);break;case 121:k+=(""+R.getFullYear()).slice(2);break;case 122:if(h&&N===0)k+=C?"+00:00":"+0000";else{var V;N!==0?V=N/(60*1e3):V=-R.getTimezoneOffset();var G=V<0?"-":"+",X=C?":":"",Q=Math.floor(Math.abs(V/60)),Z=Math.abs(V%60);k+=G+p(Q)+X+p(Z)}break;default:g&&(k+="%"),k+=b[L];break}m=null,g=!1;continue}if(P===37){g=!0;continue}k+=b[L]}return k}var E=d;return E.localize=function(b){return new o(b||v,N,h)},E.localizeByIdentifier=function(b){var R=t[b];return R?E.localize(R):(D('[WARNING] No locale found with identifier "'+b+'".'),E)},E.timezone=function(b){var R=N,f=h,$=typeof b;if($==="number"||$==="string")if(f=!0,$==="string"){var k=b[0]==="-"?-1:1,m=parseInt(b.slice(1,3),10),g=parseInt(b.slice(3,5),10);R=k*(60*m+g)*60*1e3}else $==="number"&&(R=b*60*1e3);return new o(v,R,f)},E.utc=function(){return new o(v,N,!0)},E}function p(B,F){return F===""||B>9?B:(F==null&&(F="0"),F+B)}function w(B){return B>99?B:B>9?"0"+B:"00"+B}function T(B){return B===0?12:B>12?B-12:B}function A(B,F){F=F||"sunday";var s=B.getDay();F==="monday"&&(s===0?s=6:s--);var v=Date.UTC(B.getFullYear(),0,1),N=Date.UTC(B.getFullYear(),B.getMonth(),B.getDate()),h=Math.floor((N-v)/864e5),c=(h+7-s)/7;return Math.floor(c)}function S(B){var F=B%10,s=B%100;if(s>=11&&s<=13||F===0||F>=4)return"th";switch(F){case 1:return"st";case 2:return"nd";case 3:return"rd"}}function O(B){return(B.getTimezoneOffset()||0)*6e4}function D(B){typeof console<"u"&&typeof console.warn=="function"&&console.warn(B)}})()}),"./node_modules/webpack/buildin/global.js":(function(Y,y){var t;t=(function(){return this})();try{t=t||new Function("return this")()}catch{typeof window=="object"&&(t=window)}Y.exports=t}),"./src/abstract.js":(function(Y,y){Sk.abstr={};var t,n;Sk.abstr.typeName=function(h){return h!=null&&h.tp$name!==void 0?h.tp$name:"<invalid type>"};let a={Add:"+",Sub:"-",Mult:"*",MatMult:"@",Div:"/",FloorDiv:"//",Mod:"%",DivMod:"divmod()",Pow:"** or pow()",LShift:"<<",RShift:">>",BitAnd:"&",BitXor:"^",BitOr:"|"};function i(h,c,l){let d=Sk.abstr.typeName(h),_=Sk.abstr.typeName(c);throw new Sk.builtin.TypeError("unsupported operand type(s) for "+a[l]+": '"+d+"' and '"+_+"'")}function r(h,c,l){let d=Sk.abstr.typeName(h),_=Sk.abstr.typeName(c);throw new Sk.builtin.TypeError("unsupported operand type(s) for "+a[l]+"=: '"+d+"' and '"+_+"'")}let o={UAdd:"+",USub:"-",Invert:"~"};function p(h,c){var l=Sk.abstr.typeName(h);throw new Sk.builtin.TypeError("bad operand type for unary "+o[c]+": '"+l+"'")}function w(h,c){switch(c){case"Add":return h.nb$add;case"Sub":return h.nb$subtract;case"Mult":return h.nb$multiply;case"MatMult":if(Sk.__future__.python3)return h.nb$matrix_multiply;case"Div":return h.nb$divide;case"FloorDiv":return h.nb$floor_divide;case"Mod":return h.nb$remainder;case"DivMod":return h.nb$divmod;case"Pow":return h.nb$power;case"LShift":return h.nb$lshift;case"RShift":return h.nb$rshift;case"BitAnd":return h.nb$and;case"BitXor":return h.nb$xor;case"BitOr":return h.nb$or}}function T(h,c){switch(c){case"Add":return h.nb$reflected_add;case"Sub":return h.nb$reflected_subtract;case"Mult":return h.nb$reflected_multiply;case"MatMult":if(Sk.__future__.python3)return h.nb$reflected_matrix_multiply;case"Div":return h.nb$reflected_divide;case"FloorDiv":return h.nb$reflected_floor_divide;case"Mod":return h.nb$reflected_remainder;case"DivMod":return h.nb$reflected_divmod;case"Pow":return h.nb$reflected_power;case"LShift":return h.nb$reflected_lshift;case"RShift":return h.nb$reflected_rshift;case"BitAnd":return h.nb$reflected_and;case"BitXor":return h.nb$reflected_xor;case"BitOr":return h.nb$reflected_or}}function A(h,c){switch(c){case"Add":return h.nb$inplace_add;case"Sub":return h.nb$inplace_subtract;case"Mult":return h.nb$inplace_multiply;case"MatMult":if(Sk.__future__.python3)return h.nb$inplace_matrix_multiply;case"Div":return h.nb$inplace_divide;case"FloorDiv":return h.nb$inplace_floor_divide;case"Mod":return h.nb$inplace_remainder;case"Pow":return h.nb$inplace_power;case"LShift":return h.nb$inplace_lshift;case"RShift":return h.nb$inplace_rshift;case"BitAnd":return h.nb$inplace_and;case"BitOr":return h.nb$inplace_or;case"BitXor":return h.nb$inplace_xor}}function S(h,c){switch(c){case"USub":return h.nb$negative;case"UAdd":return h.nb$positive;case"Invert":return h.nb$invert}}function O(h,c,l){let d=c.constructor,_=h.constructor,E=d!==_&&d.sk$baseClass===void 0&&c instanceof _,b,R;if(E&&(b=T(c,l),b!==void 0&&b!==T(h,l)&&(R=b.call(c,h),R!==Sk.builtin.NotImplemented.NotImplemented$)))return R;let f=w(h,l);if(f!==void 0&&(R=f.call(h,c),R!==Sk.builtin.NotImplemented.NotImplemented$)||!E&&(b=T(c,l),b!==void 0&&(R=b.call(c,h),R!==Sk.builtin.NotImplemented.NotImplemented$)))return R}function D(h,c,l){let d=A(h,l);if(d!==void 0){let _=d.call(h,c);if(_!==Sk.builtin.NotImplemented.NotImplemented$)return _}return O(h,c,l)}function B(h,c){let l=S(h,c);if(l!==void 0)return l.call(h)}Sk.abstr.numberBinOp=function(h,c,l){return O(h,c,l)||i(h,c,l)},Sk.exportSymbol("Sk.abstr.numberBinOp",Sk.abstr.numberBinOp),Sk.abstr.numberInplaceBinOp=function(h,c,l){return D(h,c,l)||r(h,c,l)},Sk.exportSymbol("Sk.abstr.numberInplaceBinOp",Sk.abstr.numberInplaceBinOp),Sk.abstr.numberUnaryOp=function(h,c){return c==="Not"?Sk.misceval.isTrue(h)?Sk.builtin.bool.false$:Sk.builtin.bool.true$:B(h,c)||p(h,c)},Sk.exportSymbol("Sk.abstr.numberUnaryOp",Sk.abstr.numberUnaryOp),Sk.abstr.fixSeqIndex_=function(h,c){return c=Sk.builtin.asnum$(c),c<0&&h.sq$length&&(c+=h.sq$length()),c},Sk.abstr.sequenceContains=function(h,c,l){if(h.sq$contains)return h.sq$contains(c,l);let d=Sk.misceval.iterFor(Sk.abstr.iter(h),function(_){return _===c||Sk.misceval.richCompareBool(_,c,"Eq")?new Sk.misceval.Break(!0):!1},!1);return l?d:Sk.misceval.retryOptionalSuspensionOrThrow(d)},Sk.abstr.sequenceConcat=function(h,c){if(h.sq$concat)return h.sq$concat(c);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(h)+"' object can't be concatenated")},Sk.abstr.sequenceGetIndexOf=function(h,c){if(h.index)return Sk.misceval.callsimArray(h.index,[h,c]);let l=0;for(let d=Sk.abstr.iter(h),_=d.tp$iternext();_!==void 0;_=d.tp$iternext()){if(Sk.misceval.richCompareBool(c,_,"Eq"))return new Sk.builtin.int_(l);l+=1}throw new Sk.builtin.ValueError("sequence.index(x): x not in sequence")},Sk.abstr.sequenceGetCountOf=function(h,c){if(h.count)return Sk.misceval.callsimArray(h.count,[h,c]);let l=0;for(let d=Sk.abstr.iter(h),_=d.tp$iternext();_!==void 0;_=d.tp$iternext())Sk.misceval.richCompareBool(c,_,"Eq")&&(l+=1);return new Sk.builtin.int_(l)},Sk.abstr.sequenceGetItem=function(h,c,l){return typeof c=="number"&&(c=new Sk.builtin.int_(c)),Sk.abstr.objectGetItem(h,c,l)},Sk.abstr.sequenceSetItem=function(h,c,l,d){return typeof c=="number"&&(c=new Sk.builtin.int_(c)),Sk.abstr.objectSetItem(h,c,l,d)},Sk.abstr.sequenceDelItem=function(h,c,l){return Sk.abstr.objectDelItem(h,c,l)},Sk.abstr.sequenceGetSlice=function(h,c,l){return Sk.abstr.objectGetItem(h,new Sk.builtin.slice(c,l))},Sk.abstr.sequenceDelSlice=function(h,c,l){return Sk.abstr.objectDelItem(h,new Sk.builtin.slice(c,l))},Sk.abstr.sequenceSetSlice=function(h,c,l,d){return Sk.abstr.objectSetItem(h,new Sk.builtin.slice(c,l))},Sk.abstr.sequenceUnpack=function(h,c,l,d){if(!Sk.builtin.checkIterable(h))throw new Sk.builtin.TypeError("cannot unpack non-iterable "+Sk.abstr.typeName(h)+" object");let _=Sk.abstr.iter(h),E=[],b=0,R;return c>0&&(R=Sk.misceval.iterFor(_,f=>{if(E.push(f),++b===c)return new Sk.misceval.Break})),Sk.misceval.chain(R,()=>{if(E.length<c)throw new Sk.builtin.ValueError("not enough values to unpack (expected at least "+l+", got "+E.length+")");if(!d)return Sk.misceval.chain(_.tp$iternext(!0),$=>{if($!==void 0)throw new Sk.builtin.ValueError("too many values to unpack (expected "+c+")");return E});let f=[];return Sk.misceval.chain(Sk.misceval.iterFor(_,$=>{f.push($)}),()=>{let $=f.length+c-l;if($<0)throw new Sk.builtin.ValueError("not enough values to unpack (expected at least "+l+", got "+(l+$)+")");return E.push(new Sk.builtin.list(f.slice(0,$))),E.push(...f.slice($)),E})})},Sk.abstr.mappingUnpackIntoKeywordArray=function(h,c,l){if(c instanceof Sk.builtin.dict){c.$items().forEach(([_,E])=>{if(!Sk.builtin.checkString(_))throw new Sk.builtin.TypeError((l.$qualname?l.$qualname+"() ":"")+"keywords must be strings");h.push(_.v),h.push(E)});return}let d=Sk.abstr.lookupSpecial(c,Sk.builtin.str.$keys);if(d===void 0)throw new Sk.builtin.TypeError("Object is not a mapping");return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(d),_=>Sk.misceval.iterFor(Sk.abstr.iter(_),E=>{if(!Sk.builtin.checkString(E))throw new Sk.builtin.TypeError((l.$qualname?l.$qualname+"() ":"")+"keywords must be strings");return Sk.misceval.chain(c.mp$subscript(E,!0),b=>{h.push(E.v),h.push(b)})}))},Sk.abstr.copyKeywordsToNamedArgs=function(h,c,l,d,_){d=d||[];let E=l.length+d.length/2;if(E>c.length)throw new Sk.builtin.TypeError(h+"() expected at most "+c.length+" arguments ("+E+" given)");if(!d.length&&_===void 0)return l;if(E===c.length&&!d.length)return l;if(E===0&&c.length===(_&&_.length))return _;l=l.slice(0);for(let b=0;b<d.length;b+=2){let R=d[b],f=d[b+1],$=c.indexOf(R);if($>=0){if(l[$]!==void 0)throw new Sk.builtin.TypeError(h+"() got multiple values for argument '"+R+"'");l[$]=f}else throw new Sk.builtin.TypeError(h+"() got an unexpected keyword argument '"+R+"'")}if(_){let b=c.length;for(let f=b-1;f>=0;f--)l[f]===void 0&&(l[f]=_[_.length-1-(b-1-f)]);let R=c.filter((f,$)=>l[$]===void 0);if(R.length)throw new Sk.builtin.TypeError(h+"() missing "+R.length+" required positional arguments: "+R.join(", "))}return l},Sk.exportSymbol("Sk.abstr.copyKeywordsToNamedArgs",Sk.abstr.copyKeywordsToNamedArgs),Sk.abstr.checkNoKwargs=function(h,c){if(c&&c.length)throw new Sk.builtin.TypeError(h+"() takes no keyword arguments")},Sk.exportSymbol("Sk.abstr.checkNoKwargs",Sk.abstr.checkNoKwargs),Sk.abstr.checkNoArgs=function(h,c,l){let d=c.length+(l?l.length:0);if(d)throw new Sk.builtin.TypeError(h+"() takes no arguments ("+d+" given)")},Sk.exportSymbol("Sk.abstr.checkNoArgs",Sk.abstr.checkNoArgs),Sk.abstr.checkOneArg=function(h,c,l){if(Sk.abstr.checkNoKwargs(h,l),c.length!==1)throw new Sk.builtin.TypeError(h+"() takes exactly one argument ("+c.length+" given)")},Sk.exportSymbol("Sk.abstr.checkOneArg",Sk.abstr.checkOneArg),Sk.abstr.checkArgsLen=function(h,c,l,d){let _=c.length,E;if(d===void 0&&(d=1/0),_<l||_>d)throw l===d?E=h+"() takes exactly "+l+" arguments":_<l?E=h+"() takes at least "+l+" arguments":E=h+"() takes at most "+d+" arguments",E+=" ("+_+" given)",new Sk.builtin.TypeError(E)},Sk.exportSymbol("Sk.abstr.checkArgsLen",Sk.abstr.checkArgsLen),Sk.abstr.objectFormat=function(h,c){let l=Sk.abstr.lookupSpecial(h,Sk.builtin.str.$format),d=Sk.misceval.callsimArray(l,[c]);if(!Sk.builtin.checkString(d))throw new Sk.builtin.TypeError("__format__ must return a str, not "+Sk.abstr.typeName(d));return d},Sk.abstr.objectHash=function(h){let c=h.tp$hash;if(c!==void 0){if(Sk.builtin.checkNone(c))throw new Sk.builtin.TypeError("unhashable type: '"+Sk.abstr.typeName(h)+"'");return h.tp$hash()}throw new Sk.builtin.TypeError("unsupported Javascript type")},Sk.abstr.objectAdd=function(h,c){if(h.nb$add)return h.nb$add(c);let l=Sk.abstr.typeName(h),d=Sk.abstr.typeName(c);throw new Sk.builtin.TypeError("unsupported operand type(s) for +: '"+l+"' and '"+d+"'")},Sk.abstr.objectNegative=function(h){if(h.nb$negative)return h.nb$negative();throw new Sk.builtin.TypeError("bad operand type for unary -: '"+Sk.abstr.typeName(h)+"'")},Sk.abstr.objectPositive=function(h){if(h.nb$positive)return h.nb$positive();throw new Sk.builtin.TypeError("bad operand type for unary +: '"+Sk.abstr.typeName(h)+"'")},Sk.abstr.objectDelItem=function(h,c,l){if(h.mp$ass_subscript)return h.mp$ass_subscript(c,void 0,l);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(h)+"' object does not support item deletion")},Sk.exportSymbol("Sk.abstr.objectDelItem",Sk.abstr.objectDelItem),Sk.abstr.objectGetItem=function(h,c,l){if(h.mp$subscript)return h.mp$subscript(c,l);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(h)+"' does not support indexing")},Sk.exportSymbol("Sk.abstr.objectGetItem",Sk.abstr.objectGetItem),Sk.abstr.objectSetItem=function(h,c,l,d){if(h.mp$ass_subscript)return h.mp$ass_subscript(c,l,d);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(h)+"' does not support item assignment")},Sk.exportSymbol("Sk.abstr.objectSetItem",Sk.abstr.objectSetItem),Sk.abstr.gattr=function(h,c,l){let d=h.tp$getattr(c,l);if(d===void 0)throw new Sk.builtin.AttributeError(h.sk$attrError()+" has no attribute '"+c.$jsstr()+"'");return d.$isSuspension?Sk.misceval.chain(d,function(_){if(_===void 0)throw new Sk.builtin.AttributeError(h.sk$attrError()+" has no attribute '"+c.$jsstr()+"'");return _}):d},Sk.exportSymbol("Sk.abstr.gattr",Sk.abstr.gattr),Sk.abstr.sattr=function(h,c,l,d){return h.tp$setattr(c,l,d)},Sk.exportSymbol("Sk.abstr.sattr",Sk.abstr.sattr),Sk.abstr.iternext=function(h,c){return h.tp$iternext(c)},Sk.exportSymbol("Sk.abstr.iternext",Sk.abstr.iternext),Sk.abstr.iter=function(h){if(h.tp$iter){let c=h.tp$iter();if(c.tp$iternext)return c;throw new Sk.builtin.TypeError("iter() returned non-iterator of type '"+Sk.abstr.typeName(c)+"'")}if(h.mp$subscript)return new Sk.builtin.seq_iter_(h);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(h)+"' object is not iterable")},Sk.exportSymbol("Sk.abstr.iter",Sk.abstr.iter),Sk.abstr.lookupSpecial=function(h,c){var l=h.ob$type;if(l===void 0){Sk.asserts.fail("javascript object sent to lookupSpecial");return}var d=l.$typeLookup(c);if(d!==void 0)return d.tp$descr_get!==void 0&&(d=d.tp$descr_get(h,l)),d},Sk.exportSymbol("Sk.abstr.lookupSpecial",Sk.abstr.lookupSpecial),Sk.abstr.typeLookup=function(h,c){let l=h.$typeLookup(c);return l!==void 0&&l.tp$descr_get?l.tp$descr_get(null,h):l},Sk.abstr.markUnhashable=function(h){let c=h.prototype;c.__hash__=Sk.builtin.none.none$,c.tp$hash=Sk.builtin.none.none$},Sk.abstr.setUpInheritance=function(h,c,l,d){d=d||Sk.builtin.type,l=l===void 0?Sk.builtin.object:l;let _=l!==null?l.prototype:null;Object.setPrototypeOf(c,d.prototype),Object.setPrototypeOf(c.prototype,_),Object.defineProperties(c.prototype,{sk$object:{value:c,writable:!0},ob$type:{value:c,writable:!0},tp$name:{value:h,writable:!0},tp$base:{value:l,writable:!0}})},Sk.abstr.setUpBuiltinMro=function(h){let c=h.prototype.tp$base,l=c===null?[]:[c];(c===Sk.builtin.object||c===null)&&(Object.defineProperty(h,"sk$baseClass",{value:!0,writable:!0}),Object.defineProperty(h.prototype,"sk$builtinBase",{value:h,writable:!0}));let d=[h];for(;c!==null;)d.push(c),c=c.prototype.tp$base;Object.defineProperties(h.prototype,{sk$prototypical:{value:!0,writable:!0},tp$bases:{value:l,writable:!0},tp$mro:{value:d,writable:!0}}),Object.defineProperty(h,"$typeLookup",{value:function(_){var E=_.$mangled;return this.prototype[E]},writable:!0})},Sk.abstr.setUpGetSets=function(h,c){if(Sk.builtin.getset_descriptor===void 0)return;let l=h.prototype;c=c||l.tp$getsets||{},Object.entries(c).forEach(([d,_])=>{_.$name=d,l[d]=new Sk.builtin.getset_descriptor(h,_)}),Object.defineProperty(l,"tp$getsets",{value:null,writable:!0})},Sk.abstr.setUpMethods=function(h,c){if(Sk.builtin.method_descriptor===void 0)return;let l=h.prototype;c=c||l.tp$methods||{},Object.entries(c).forEach(([d,_])=>{_.$name=d,l[d]=new Sk.builtin.method_descriptor(h,_)}),Object.defineProperty(l,"tp$methods",{value:null,writable:!0})},Sk.abstr.setUpClassMethods=function(h,c){if(Sk.builtin.classmethod_descriptor===void 0)return;let l=h.prototype;c=c||l.tp$classmethods||{},Object.entries(c).forEach(([d,_])=>{_.$name=d,l[d]=new Sk.builtin.classmethod_descriptor(h,_)}),Object.defineProperty(l,"tp$classmethods",{value:null,writable:!0})};let F=Object.entries({Eq:"ob$eq",NotEq:"ob$ne",Gt:"ob$gt",GtE:"ob$ge",Lt:"ob$lt",LtE:"ob$le"});function s(h){F.forEach(([c,l])=>{h[l]=function(d){return this.tp$richcompare(d,c)}})}function v(h){let c=Sk.reflectedNumberSlots;Object.keys(c).forEach(l=>{if(h[l]!==void 0){let d=c[l],_=d.reflected,E=h[_];E!==void 0?E===null&&delete h[_]:h[_]=d.slot||h[l]}})}function N(h){let c=Sk.sequenceAndMappingSlots;Object.keys(c).forEach(l=>{h[l]!==void 0&&c[l].forEach(_=>{h[_]=h[l]})})}Sk.abstr.setUpSlots=function(h,c){if(Sk.builtin.wrapper_descriptor===void 0)return;let l=h.prototype;c=c||l.tp$slots||{},c.tp$new===Sk.generic.new&&(c.tp$new=Sk.generic.new(h)),c.tp$richcompare&&s(c),c.tp$as_number&&v(c),c.tp$as_sequence_or_mapping&&N(c),Object.entries(c).forEach(([b,R])=>{Object.defineProperty(l,b,{value:R,writable:!0})}),c.tp$new&&(l.__new__=new Sk.builtin.sk_method(Sk.generic.newMethodDef,h),Object.defineProperty(l,"sk$staticNew",{value:h,writable:!0}));function d(b,R){let f=Sk.slots[b];l[b]=new Sk.builtin.wrapper_descriptor(h,f,R)}function _(b,R){typeof b=="string"?d(b,R):b.forEach(f=>{d(f,R)})}Sk.subSlots.main_slots.forEach(([b,R])=>{let f=c[b];f!==void 0&&_(R,f)});let E=c.tp$hash;E!==void 0&&(typeof E=="function"?d("__hash__",E):E===Sk.builtin.none.none$?l.__hash__=E:Sk.asserts.fail("invalid tp$hash")),c.tp$as_number&&Sk.subSlots.number_slots.forEach(([b,R])=>{let f=c[b];f!==void 0&&_(R,f)}),c.tp$as_sequence_or_mapping&&Sk.subSlots.sequence_and_mapping_slots.forEach(([b,R])=>{let f=c[b];f!==void 0&&_(R,f)}),Object.defineProperty(l,"tp$slots",{value:null,writable:!0})},Sk.abstr.buildNativeClass=function(h,c){c=c||{},Sk.asserts.assert(c.hasOwnProperty("constructor"),"A constructor is required to build a native class");let l=c.constructor,d;if(h.includes(".")){let R=h.split(".");h=R.pop(),d=R.join(".")}Sk.abstr.setUpInheritance(h,l,c.base,c.meta),Sk.abstr.setUpBuiltinMro(l);let _=l.prototype;Object.defineProperties(_,{tp$slots:{value:c.slots,writable:!0},tp$getsets:{value:c.getsets,writable:!0},tp$methods:{value:c.methods,writable:!0},tp$classmethods:{value:c.classmethods,writable:!0}}),Sk.abstr.setUpSlots(l,c.slots||{}),Sk.abstr.setUpMethods(l,c.methods),Sk.abstr.setUpGetSets(l,c.getsets),Sk.abstr.setUpClassMethods(l,c.classmethods),d!==void 0&&(_.__module__=new Sk.builtin.str(d));let E=c.proto||{};Object.entries(E).forEach(([R,f])=>{Object.defineProperty(_,R,{value:f,writable:!0,enumerable:!(R.includes("$")||R in Object.prototype)})});let b=c.flags||{};if(Object.entries(b).forEach(([R,f])=>{Object.defineProperty(l,R,{value:f,writable:!0})}),Sk.builtin.str!==void 0&&_.hasOwnProperty("tp$doc")&&!_.hasOwnProperty("__doc__")){let R=_.tp$doc||null;typeof R=="string"?_.__doc__=new Sk.builtin.str(R):_.__doc__=Sk.builtin.none.none$}return l},Sk.abstr.buildIteratorClass=function(h,c){Sk.asserts.assert(c.hasOwnProperty("constructor"),"must provide a constructor"),c.slots=c.slots||{},c.slots.tp$iter=Sk.generic.selfIter,c.slots.tp$iternext=c.slots.tp$iternext||c.iternext,c.slots.tp$getattr=c.slots.tp$getattr||Sk.generic.getAttr;let l=Sk.abstr.buildNativeClass(h,c);return Sk.abstr.built$iterators.push(l),l},Sk.abstr.built$iterators=[],Sk.abstr.setUpModuleMethods=function(h,c,l){Object.entries(l).forEach(([d,_])=>{_.$name=_.$name||d,c[d]=new Sk.builtin.sk_method(_,null,h)})},Sk.abstr.superConstructor=function(h,c,l){var d=Array.prototype.slice.call(arguments,2);h.prototype.tp$base.apply(c,d)}}),"./src/assert-dev.js":(function(Y,y){Sk.asserts={ENABLE_ASSERTS:!0},Sk.asserts.assert=function(t,n){if(Sk.asserts.ENABLE_ASSERTS&&!t){var a="Assertion failure";throw n&&(a=a+": "+n),new Error(a)}return t},Sk.exportSymbol("Sk.asserts.assert",Sk.asserts.assert),Sk.asserts.fail=function(t){if(Sk.asserts.ENABLE_ASSERTS){var n="Assertion failure";throw t&&(n=n+": "+t),new Error(n)}},Sk.exportSymbol("Sk.asserts.fail",Sk.asserts.fail)}),"./src/ast.js":(function(Y,y){var t=Sk.ParseTables.sym,n=Sk.token.tokens,a=0,i=1,r=2,o=null,p={Slice_kind:1,ExtSlice_kind:2,Index_kind:3},w={BoolOp_kind:1,NamedExpr_kind:2,BinOp_kind:3,UnaryOp_kind:4,Lambda_kind:5,IfExp_kind:6,Dict_kind:7,Set_kind:8,ListComp_kind:9,SetComp_kind:10,DictComp_kind:11,GeneratorExp_kind:12,Await_kind:13,Yield_kind:14,YieldFrom_kind:15,Compare_kind:16,Call_kind:17,FormattedValue_kind:18,JoinedStr_kind:19,Constant_kind:20,Attribute_kind:21,Subscript_kind:22,Starred_kind:23,Name_kind:24,List_kind:25,Tuple_kind:26};function T(I,u,M){this.c_encoding=I,this.c_filename=u,this.c_flags=M||0}function A(I){return Sk.asserts.assert(I!==void 0,"node must be defined"),I.children===null?0:I.children.length}function S(I,u){return Sk.asserts.assert(I!==void 0,"node must be defined"),Sk.asserts.assert(u!==void 0,"index of child must be specified"),I.children[u]}function O(I,u){Sk.asserts.assert(I.type===u,"node wasn't expected type")}function D(I){return I.type}function B(I){return I.lineno}function F(I){return I.value}function s(I,u,M){throw new Sk.builtin.SyntaxError(M,I.c_filename,u.lineno)}function v(I){return Sk.asserts.assert(typeof I=="string","expecting string, got "+typeof I),new Sk.builtin.str(I)}function N(I){var u,M,z;switch(I.type){case t.single_input:return S(I,0).type===n.T_NEWLINE?0:N(S(I,0));case t.file_input:for(z=0,M=0;M<A(I);++M)u=S(I,M),u.type===t.stmt&&(z+=N(u));return z;case t.stmt:return N(S(I,0));case t.compound_stmt:return 1;case t.simple_stmt:return Math.floor(A(I)/2);case t.suite:if(A(I)===1)return N(S(I,0));for(z=0,M=2;M<A(I)-1;++M)z+=N(S(I,M));return z;break;default:Sk.asserts.fail("Non-statement found")}return 0}function h(I,u,M,z){if(M instanceof Sk.builtin.str&&(M=M.v),M==="None")throw new Sk.builtin.SyntaxError("assignment to None",I.c_filename,z);if(M==="True"||M==="False")throw new Sk.builtin.SyntaxError("assignment to True or False is forbidden",I.c_filename,z)}function c(I,u,M,z){var U,q,H;switch(Sk.asserts.assert(M!==Sk.astnodes.AugStore&&M!==Sk.astnodes.AugLoad,"context not AugStore or AugLoad"),H=null,q=null,u.constructor){case Sk.astnodes.Attribute:case Sk.astnodes.Name:M===Sk.astnodes.Store&&h(I,z,u.attr,z.lineno),u.ctx=M;break;case Sk.astnodes.Starred:u.ctx=M,c(I,u.value,M,z);break;case Sk.astnodes.Subscript:u.ctx=M;break;case Sk.astnodes.List:u.ctx=M,H=u.elts;break;case Sk.astnodes.Tuple:if(u.elts.length===0)throw new Sk.builtin.SyntaxError("can't assign to ()",I.c_filename,z.lineno);u.ctx=M,H=u.elts;break;case Sk.astnodes.Lambda:q="lambda";break;case Sk.astnodes.Call:q="function call";break;case Sk.astnodes.BoolOp:case Sk.astnodes.BinOp:case Sk.astnodes.UnaryOp:q="operator";break;case Sk.astnodes.GeneratorExp:q="generator expression";break;case Sk.astnodes.Yield:q="yield expression";break;case Sk.astnodes.ListComp:q="list comprehension";break;case Sk.astnodes.SetComp:q="set comprehension";break;case Sk.astnodes.DictComp:q="dict comprehension";break;case Sk.astnodes.Dict:case Sk.astnodes.Set:case Sk.astnodes.Num:case Sk.astnodes.Str:q="literal";break;case Sk.astnodes.NameConstant:q="True, False or None";break;case Sk.astnodes.Compare:q="comparison";break;case Sk.astnodes.Repr:q="repr";break;case Sk.astnodes.IfExp:q="conditional expression";break;default:Sk.asserts.fail("unhandled expression in assignment")}if(q)throw new Sk.builtin.SyntaxError("can't "+(M===Sk.astnodes.Store?"assign to":"delete")+" "+q,I.c_filename,z.lineno);if(H)for(U=0;U<H.length;++U)c(I,H[U],M,z)}var l={};(function(){l[n.T_VBAR]=Sk.astnodes.BitOr,l[n.T_CIRCUMFLEX]=Sk.astnodes.BitXor,l[n.T_AMPER]=Sk.astnodes.BitAnd,l[n.T_LEFTSHIFT]=Sk.astnodes.LShift,l[n.T_RIGHTSHIFT]=Sk.astnodes.RShift,l[n.T_PLUS]=Sk.astnodes.Add,l[n.T_MINUS]=Sk.astnodes.Sub,l[n.T_STAR]=Sk.astnodes.Mult,l[n.T_SLASH]=Sk.astnodes.Div,l[n.T_DOUBLESLASH]=Sk.astnodes.FloorDiv,l[n.T_PERCENT]=Sk.astnodes.Mod})(),Sk.setupOperators=function(I){I?l[n.T_AT]=Sk.astnodes.MatMult:l[n.T_AT]&&delete l[n.T_AT]},Sk.exportSymbol("Sk.setupOperators",Sk.setupOperators);function d(I){if(l[I.type]===void 0)throw new Sk.builtin.SyntaxError("invalid syntax",I.type,I.lineno);return l[I.type]}function _(I,u){return I.value?new Sk.builtin.str(I.value):new Sk.builtin.str(I)}function E(I,u){if(O(u,t.comp_op),A(u)===1)switch(u=S(u,0),u.type){case n.T_LESS:return Sk.astnodes.Lt;case n.T_GREATER:return Sk.astnodes.Gt;case n.T_EQEQUAL:return Sk.astnodes.Eq;case n.T_LESSEQUAL:return Sk.astnodes.LtE;case n.T_GREATEREQUAL:return Sk.astnodes.GtE;case n.T_NOTEQUAL:return Sk.astnodes.NotEq;case n.T_NAME:if(u.value==="in")return Sk.astnodes.In;if(u.value==="is")return Sk.astnodes.Is}else if(A(u)===2&&S(u,0).type===n.T_NAME){if(S(u,1).value==="in")return Sk.astnodes.NotIn;if(S(u,0).value==="is")return Sk.astnodes.IsNot}Sk.asserts.fail("invalid comp_op")}function b(I,u){return I&&(I.lineno=B(u),I.col_offset=u.col_offset,I.end_lineno=u.end_lineno,I.end_col_offset=u.end_col_offset),I}function R(I,u){var M,z=[];for(Sk.asserts.assert(u.type===t.testlist||u.type===t.testlist_star_expr||u.type===t.listmaker||u.type===t.testlist_comp||u.type===t.testlist_safe||u.type===t.testlist1,"node type must be listlike"),M=0;M<A(u);M+=2)Sk.asserts.assert(S(u,M).type===t.test||S(u,M).type===t.old_test||S(u,M).type===t.star_expr),z[M/2]=se(I,S(u,M));return z}function f(I,u){var M,z,U,q,H,W,ne;if(O(u,t.suite),ne=[],W=0,S(u,0).type===t.simple_stmt)for(u=S(u,0),q=A(u)-1,S(u,q-1).type===n.T_SEMI&&(q-=1),U=0;U<q;U+=2)ne[W++]=ht(I,S(u,U));else for(U=2;U<A(u)-1;++U)if(H=S(u,U),O(H,t.stmt),z=N(H),z===1)ne[W++]=ht(I,H);else for(H=S(H,0),O(H,t.simple_stmt),M=0;M<A(H);M+=2){if(A(S(H,M))===0){Sk.asserts.assert(M+1===A(H));break}ne[W++]=ht(I,S(H,M))}return Sk.asserts.assert(W===N(u)),ne}function $(I,u,M){var z;if(O(u,t.except_clause),O(M,t.suite),A(u)===1)return new Sk.astnodes.ExceptHandler(null,null,f(I,M),u.lineno,u.col_offset);if(A(u)===2)return new Sk.astnodes.ExceptHandler(se(I,S(u,1)),null,f(I,M),u.lineno,u.col_offset);if(A(u)===4){Sk.__future__.python3&&S(u,2).value==","&&s(I,u,"Old-style 'except' clauses are not supported in Python 3");var U=se(I,S(u,1));return z=se(I,S(u,3)),c(I,z,Sk.astnodes.Store,S(u,3)),new Sk.astnodes.ExceptHandler(se(I,S(u,1)),z,f(I,M),u.lineno,u.col_offset)}Sk.asserts.fail("wrong number of children for except clause")}function k(I,u){var M,z,U=[],q=A(u),H=(q-3)/3,W,ne=[],ie=null;if(O(u,t.try_stmt),W=f(I,S(u,2)),S(u,q-3).type===n.T_NAME)S(u,q-3).value==="finally"?(q>=9&&S(u,q-6).type===n.T_NAME&&(ne=f(I,S(u,q-4)),H--),ie=f(I,S(u,q-1)),H--):(ne=f(I,S(u,q-1)),H--);else if(S(u,q-3).type!==t.except_clause)throw new Sk.builtin.SyntaxError("malformed 'try' statement",I.c_filename,u.lineno);if(H>0)for(z=0;z<H;z++)U[z]=$(I,S(u,3+z*3),S(u,5+z*3));return Sk.asserts.assert(!!ie||U.length!=0),new Sk.astnodes.Try(W,U,ne,ie,u.lineno,u.col_offset)}function m(I,u){var M,z,U,q,H;for(O(u,t.dotted_name),H=u.lineno,q=u.col_offset,U=v(S(u,0).value),z=new Sk.astnodes.Name(U,Sk.astnodes.Load,H,q),M=2;M<A(u);M+=2)U=v(S(u,M).value),z=new Sk.astnodes.Attribute(z,U,Sk.astnodes.Load,H,q);return z}function g(I,u){var M;return O(u,t.decorator),O(S(u,0),n.T_AT),O(S(u,A(u)-1),n.T_NEWLINE),M=m(I,S(u,1)),A(u)===3?M:A(u)===5?new Sk.astnodes.Call(M,[],[],null,null,u.lineno,u.col_offset):oe(I,S(u,3),M)}function x(I,u){var M,z;for(O(u,t.decorators),z=[],M=0;M<A(u);++M)z[M]=g(I,S(u,M));return z}function C(I,u){var M=null,z=null;return O(u,t.decorated),z=x(I,S(u,0)),Sk.asserts.assert(D(S(u,1))==t.funcdef||D(S(u,1))==t.async_funcdef||D(S(u,1))==t.classdef),D(S(u,1))==t.funcdef?M=ze(I,S(u,1),z):D(S(u,1))==t.classdef?M=Ze(I,S(u,1),z):D(S(u,1))==t.async_funcdef&&(M=Ie(I,S(u,1),z)),M&&(M.lineno=B(u),M.col_offset=u.col_offset),M}function L(I,u){var M,z;return O(u,t.with_item),M=se(I,S(u,0)),A(u)==3&&(z=se(I,S(u,2)),c(I,z,Sk.astnodes.Store,u)),new Sk.astnodes.withitem(M,z)}function P(I,u,M){let z=M?S(u,1):u;var U,q=[],H;for(O(z,t.with_stmt),U=1;U<A(z)-2;U+=2){var W=L(I,S(z,U));q[(U-1)/2]=W}return H=f(I,S(z,A(z)-1)),M?new Sk.astnodes.AsyncWith(q,H,B(u),u.col_offset):new Sk.astnodes.With(q,H,B(z),z.col_offset)}function J(I,u){var M,z=null,U=null,q=A(u);return Sk.asserts.assert(q===2||q===4||q===6),O(u,t.exec_stmt),M=se(I,S(u,1)),q>=4&&(z=se(I,S(u,3))),q===6&&(U=se(I,S(u,5))),new Sk.astnodes.Exec(M,z,U,u.lineno,u.col_offset)}function K(I,u){var M,z,U,q,H,W,ne;if(O(u,t.if_stmt),A(u)===4)return new Sk.astnodes.If(se(I,S(u,1)),f(I,S(u,3)),[],u.lineno,u.col_offset);if(ne=S(u,4).value,W=ne.charAt(2),W==="s")return new Sk.astnodes.If(se(I,S(u,1)),f(I,S(u,3)),f(I,S(u,6)),u.lineno,u.col_offset);if(W==="i"){for(H=A(u)-4,q=!1,U=[],S(u,H+1).type===n.T_NAME&&S(u,H+1).value.charAt(2)==="s"&&(q=!0,H-=3),H/=4,q&&(U=[new Sk.astnodes.If(se(I,S(u,A(u)-6)),f(I,S(u,A(u)-4)),f(I,S(u,A(u)-1)),S(u,A(u)-6).lineno,S(u,A(u)-6).col_offset)],H--),z=0;z<H;++z)M=5+(H-z-1)*4,U=[new Sk.astnodes.If(se(I,S(u,M)),f(I,S(u,M+2)),U,S(u,M).lineno,S(u,M).col_offset)];return new Sk.astnodes.If(se(I,S(u,1)),f(I,S(u,3)),U,u.lineno,u.col_offset)}Sk.asserts.fail("unexpected token in 'if' statement")}function j(I,u,M){var z,U,q;for(O(u,t.exprlist),q=[],U=0;U<A(u);U+=2)z=se(I,S(u,U)),q[U/2]=z,M&&c(I,z,M,S(u,U));return q}function V(I,u){return O(u,t.del_stmt),new Sk.astnodes.Delete(j(I,S(u,1),Sk.astnodes.Del),u.lineno,u.col_offset)}function G(I,u){var M,z=[];for(O(u,t.global_stmt),M=1;M<A(u);M+=2)z[(M-1)/2]=v(S(u,M).value);return new Sk.astnodes.Global(z,u.lineno,u.col_offset)}function X(I,u){if(O(u,t.assert_stmt),A(u)===2)return new Sk.astnodes.Assert(se(I,S(u,1)),null,u.lineno,u.col_offset);if(A(u)===4)return new Sk.astnodes.Assert(se(I,S(u,1)),se(I,S(u,3)),u.lineno,u.col_offset);Sk.asserts.fail("improper number of parts to assert stmt")}function Q(I,u){var M,z,U,q;e:for(;;){switch(u.type){case t.import_as_name:return q=null,U=v(S(u,0).value),A(u)===3&&(q=S(u,2).value),new Sk.astnodes.alias(U,q==null?null:v(q));case t.dotted_as_name:if(A(u)===1){u=S(u,0);continue e}else return z=Q(I,S(u,0)),Sk.asserts.assert(!z.asname),z.asname=v(S(u,2).value),z;break;case t.dotted_name:if(A(u)===1)return new Sk.astnodes.alias(v(S(u,0).value),null);for(q="",M=0;M<A(u);M+=2)q+=S(u,M).value+".";return new Sk.astnodes.alias(v(q.substr(0,q.length-1)),null);break;case n.T_STAR:return new Sk.astnodes.alias(v("*"),null);default:throw new Sk.builtin.SyntaxError("unexpected import name",I.c_filename,u.lineno)}break}}function Z(I,u){var M,z,U,q,H,W,ne,ie,ee;if(O(u,t.import_stmt),ee=u.lineno,ie=u.col_offset,u=S(u,0),u.type===t.import_name){for(u=S(u,1),O(u,t.dotted_as_names),ne=[],W=0;W<A(u);W+=2)ne[W/2]=Q(I,S(u,W));return new Sk.astnodes.Import(ne,ee,ie)}else if(u.type===t.import_from){for(H=null,q=0,z=1;z<A(u);++z)if(S(u,z).type===t.dotted_name){H=Q(I,S(u,z)),z++;break}else if(S(u,z).type===n.T_DOT)q++;else if(S(u,z).type===n.T_ELLIPSIS)q+=3;else break;switch(++z,S(u,z).type){case n.T_STAR:u=S(u,z),U=1;break;case n.T_LPAR:u=S(u,z+1),U=A(u);break;case t.import_as_names:if(u=S(u,z),U=A(u),U%2===0)throw new Sk.builtin.SyntaxError("trailing comma not allowed without surrounding parentheses",I.c_filename,u.lineno);break;default:throw new Sk.builtin.SyntaxError("Unexpected node-type in from-import",I.c_filename,u.lineno)}if(ne=[],u.type===n.T_STAR)ne[0]=Q(I,u);else for(W=0;W<A(u);W+=2)ne[W/2]=Q(I,S(u,W));return M=H?H.name.v:"",new Sk.astnodes.ImportFrom(v(M),ne,q,ee,ie)}throw new Sk.builtin.SyntaxError("unknown import statement",I.c_filename,u.lineno)}function te(I,u){return Sk.asserts.assert(u.type===t.testlist_comp||u.type===t.argument),A(u)>1&&S(u,1).type===t.comp_for?ft(I,u):je(I,u)}function ae(I,u){return Sk.asserts.assert(D(u)==t.testlist_comp||D(u)==t.argument),Ye(I,u,a)}function le(I,u){return Sk.asserts.assert(D(u)==t.testlist_comp),Ye(I,u,i)}function re(I,u){var M,z,U,q,H;if(S(u,0).type===n.T_MINUS&&A(u)===2&&(H=S(u,1),H.type===t.factor&&A(H)===1&&(q=S(H,0),q.type===t.power&&A(q)===1&&(U=S(q,0),U.type===t.atom&&(z=S(U,0),z.type===n.T_NUMBER)))))return z.value="-"+z.value,Dt(I,U);switch(M=se(I,S(u,1)),S(u,0).type){case n.T_PLUS:return new Sk.astnodes.UnaryOp(Sk.astnodes.UAdd,M,u.lineno,u.col_offset);case n.T_MINUS:return new Sk.astnodes.UnaryOp(Sk.astnodes.USub,M,u.lineno,u.col_offset);case n.T_TILDE:return new Sk.astnodes.UnaryOp(Sk.astnodes.Invert,M,u.lineno,u.col_offset)}Sk.asserts.fail("unhandled factor")}function ke(I,u){var M,z,U,q=[];return O(u,t.for_stmt),A(u)===9&&(q=f(I,S(u,8))),U=S(u,1),z=j(I,U,Sk.astnodes.Store),A(U)===1?M=z[0]:M=new Sk.astnodes.Tuple(z,Sk.astnodes.Store,u.lineno,u.col_offset),new Sk.astnodes.For(M,je(I,S(u,3)),f(I,S(u,5)),q,u.lineno,u.col_offset)}function oe(I,u,M,z){var U,q,H,W,ne,ie;for(O(u,t.arglist),q=0,H=0,U=0;U<A(u);U++){var ee=S(u,U);D(ee)==t.argument&&(A(ee)==1?q++:D(S(ee,1))==t.comp_for?(q++,z||s(I,ee,"invalid syntax"),A(u)>1&&s(I,ee,"Generator expression must be parenthesized")):D(S(ee,0))==n.T_STAR?q++:H++)}for(ne=[],ie=[],q=0,H=0,W=0,U=0;U<A(u);U++)if(ee=S(u,U),D(ee)==t.argument){var ue,fe=S(ee,0);if(A(ee)==1){if(H&&(W?s(I,fe,"positional argument follows keyword argument unpacking"):s(I,fe,"positional argument follows keyword argument")),ue=se(I,fe),!ue)return o;ne[q++]=ue}else if(D(fe)==n.T_STAR){var ge;if(W)return s(I,fe,"iterable argument unpacking follows keyword argument unpacking"),o;if(ue=se(I,S(ee,1)),!ue)return o;ge=new Sk.astnodes.Starred(ue,Sk.astnodes.Load,B(fe),fe.col_offset),ne[q++]=ge}else if(D(fe)==n.T_DOUBLESTAR){var Te;if(U++,ue=se(I,S(ee,1)),!ue)return o;Te=new Sk.astnodes.keyword(o,ue),ie[H++]=Te,W++}else if(D(S(ee,1))==t.comp_for){if(ue=ae(I,ee),!ue)return o;ne[q++]=ue}else{var Te,Ee,Se,we;if(ue=se(I,fe),!ue)return o;if(ue.constructor===Sk.astnodes.Lambda)return s(I,fe,"lambda cannot contain assignment"),o;if(ue.constructor!==Sk.astnodes.Name)return s(I,fe,"keyword can't be an expression"),o;if(h(I,ue.id,ee,1))return o;for(Ee=ue.id,we=0;we<H;we++)if(Se=ie[we].arg,Se&&Se===Ee)return s(I,fe,"keyword argument repeated"),o;if(ue=se(I,S(ee,2)),!ue)return o;Te=new Sk.astnodes.keyword(Ee,ue),ie[H++]=Te}}return new Sk.astnodes.Call(M,ne,ie,M.lineno,M.col_offset)}function he(I,u,M){if(O(u,t.trailer),D(S(u,0))==n.T_LPAR)return A(u)==2?new Sk.astnodes.Call(M,o,o,B(u),u.col_offset):oe(I,S(u,1),M,!0);if(D(S(u,0))==n.T_DOT){var z=_(S(u,1));return z?new Sk.astnodes.Attribute(M,z,Sk.astnodes.Load,B(u),u.col_offset):o}else if(O(S(u,0),n.T_LSQB),O(S(u,2),n.T_RSQB),u=S(u,1),A(u)==1){var U=Rt(I,S(u,0));return U?new Sk.astnodes.Subscript(M,U,Sk.astnodes.Load,B(u),u.col_offset):o}else{var q,U,H,W=1,ne=[],ie;for(q=0;q<A(u);q+=2){if(U=Rt(I,S(u,q)),!U)return o;U.kind!=p.Index_kind&&(W=0),ne[q/2]=U}if(!W)return new Sk.astnodes.Subscript(M,new Sk.astnodes.ExtSlice(ne),Sk.astnodes.Load,B(u),u.col_offset);for(ie=[],q=0;q<ne.length;++q)U=ne[q],Sk.asserts.assert(U.kind==p.Index_kind&&U.v.Index.value),ie[q]=U.v.Index.value;return H=new Sk.astnodes.Tuple(ie,Sk.astnodes.Load,B(u),u.col_offset),new Sk.astnodes.Subscript(M,new Sk.astnodes.Index(H),Sk.astnodes.Load,B(u),u.col_offset)}}function $e(I,u){var M;switch(O(u,t.flow_stmt),M=S(u,0),D(M)){case t.break_stmt:return new Sk.astnodes.Break(B(u),u.col_offset,u.end_lineno,u.end_col_offset);case t.continue_stmt:return new Sk.astnodes.Continue(B(u),u.col_offset,u.end_lineno,u.end_col_offset);case t.yield_stmt:{var z=se(I,S(M,0));return z?new Sk.astnodes.Expr(z,B(u),u.col_offset,u.end_lineno,u.end_col_offset):null}case t.return_stmt:if(A(M)==1)return new Sk.astnodes.Return(null,B(u),u.col_offset,u.end_lineno,u.end_col_offset);var U=je(I,S(M,1));return U?new Sk.astnodes.Return(U,B(u),u.col_offset,u.end_lineno,u.end_col_offset):null;case t.raise_stmt:if(A(M)==1)return new Sk.astnodes.Raise(null,null,null,null,B(u),u.col_offset,u.end_lineno,u.end_col_offset);if(A(M)>=2){var q=null,U=se(I,S(M,1)),H=null,W=null;return A(M)==4&&S(M,2).value=="from"?(Sk.__future__.python3||s(I,S(M,2),"raise ... from ... is not available in Python 2"),q=se(I,S(M,3))):A(M)>=4&&S(M,2).value==","&&(Sk.__future__.python3&&s(I,u,"Old raise syntax is not available in Python 3"),H=se(I,S(M,3)),A(M)==6&&(W=se(I,S(M,5)))),new Sk.astnodes.Raise(U,q,H,W,B(u),u.col_offset,u.end_lineno,u.end_col_offset)}default:return Sk.asserts.fail("unexpected flow_stmt: ",D(M)),null}}function _e(I,u){var M,z=null,U;return Sk.asserts.assert(u.type===t.tfpdef||u.type===t.vfpdef),U=S(u,0),h(I,U,U.value,U.lineno),M=v(U.value),A(u)==3&&S(u,1).type===n.T_COLON&&(z=se(I,S(u,2))),new Sk.astnodes.arg(M,z,u.lineno,u.col_offset)}function de(I,u,M,z,U){var q,H,W,ne,ie,ee=M,ue=0;for(z||s(I,S(u,M),"named arguments must follow bare *"),Sk.asserts.assert(U);ee<A(u);)switch(H=S(u,ee),H.type){case t.vfpdef:case t.tfpdef:ee+1<A(u)&&S(u,ee+1).type==n.T_EQUAL?(U[ue]=se(I,S(u,ee+2)),ee+=2):U[ue]=null,A(H)==3?ne=se(I,S(H,2)):ne=null,H=S(H,0),h(I,H,H.value,H.lineno),q=v(H.value),z[ue++]=new Sk.astnodes.arg(q,ne,H.lineno,H.col_offset),ee+=2;break;case n.T_DOUBLESTAR:return ee;default:s(I,H,"unexpected node")}return ee}function Oe(I,u){var M,z,U,q,H=[],W=[],ne=[],ie=[],ee=null,ue=null,fe=null;if(u.type===t.parameters){if(A(u)===2)return new Sk.astnodes.arguments_([],null,[],[],null,[]);u=S(u,1)}for(Sk.asserts.assert(u.type===t.varargslist||u.type===t.typedargslist),U=0,z=0,M=0;U<A(u);)switch(fe=S(u,U),fe.type){case t.tfpdef:case t.vfpdef:if(U+1<A(u)&&S(u,U+1).type==n.T_EQUAL)W[z++]=se(I,S(u,U+2)),U+=2,q=1;else if(q)throw new Sk.builtin.SyntaxError("non-default argument follows default argument",I.c_filename,u.lineno);H[M++]=_e(I,fe),U+=2;break;case n.T_STAR:if(U+1>=A(u)||U+2==A(u)&&S(u,U+1).type==n.T_COMMA)throw new Sk.builtin.SyntaxError("named arguments must follow bare *",I.c_filename,u.lineno);fe=S(u,U+1),fe.type==n.T_COMMA?(U+=2,U=de(I,u,U,ne,ie)):(ee=_e(I,fe),U+=3,U<A(u)&&(S(u,U).type==t.tfpdef||S(u,U).type==t.vfpdef)&&(U=de(I,u,U,ne,ie)));break;case n.T_DOUBLESTAR:fe=S(u,U+1),Sk.asserts.assert(fe.type==t.tfpdef||fe.type==t.vfpdef),ue=_e(I,fe),U+=3;break;default:Sk.asserts.fail("unexpected node in varargslist");return}return new Sk.astnodes.arguments_(H,ee,ne,ie,ue,W)}function Ie(I,u,M){return O(u,t.async_funcdef),O(S(u,0),n.T_NAME),Sk.asserts.assert(F(S(u,0)==="async")),O(S(u,1),t.funcdef),Pe(I,u,M,!0)}function ze(I,u,M){return Pe(I,u,M,!1)}function Pe(I,u,M,z){var U=z?S(u,1):u,q,H,W,ne=o,ie=1,ee,ue,fe,ge=o;if(z&&I.c_feature_version<5)return s(I,U,"Async functions are only supported in Python 3.5 and greater"),o;if(O(U,t.funcdef),q=_(S(U,ie)),h(I,q,S(U,ie),0)||(H=Oe(I,S(U,ie+1)),!H))return o;if(D(S(U,ie+2))==n.T_RARROW){if(ne=se(I,S(U,ie+3)),!ne)return o;ie+=2}if(D(S(U,ie+3))==n.T_TYPE_COMMENT){if(ge=n.T_NEW_TYPE_COMMENT(S(U,ie+3)),!ge)return o;ie+=1}if(W=f(I,S(U,ie+3)),!W)return o;if(A(S(U,ie+3))>1&&(fe=S(S(U,ie+3),1),D(fe)==n.T_TYPE_COMMENT)){if(ge!=o)return s(I,U,"Cannot have two type comments on def"),o;if(ge=n.T_NEW_TYPE_COMMENT(fe),!ge)return o}return z?new Sk.astnodes.AsyncFunctionDef(q,H,W,M,ne,ge,B(u),u.col_offset,ee,ue):new Sk.astnodes.FunctionDef(q,H,W,M,ne,ge,B(U),U.col_offset,ee,ue)}function ye(I,u){return Sk.asserts.assert(A(u)>0),O(u,t.testlist),A(u)===1?[se(I,S(u,0))]:R(I,u)}function Ze(I,u,M){var z,U,q;if(O(u,t.classdef),A(u)==4)return q=f(I,S(u,3)),z=_(S(u,1).value),h(I,S(u,3),z,u.lineno),new Sk.astnodes.ClassDef(z,[],[],q,M,null,B(u),u.col_offset);if(D(S(u,3))===n.T_RPAR)return q=f(I,S(u,5)),z=_(S(u,1).value),h(I,S(u,3),z,S(u,3).lineno),new Sk.astnodes.ClassDef(z,[],[],q,M,null,B(u),u.col_offset);{var H,W;H=_(S(u,1)),W=new Sk.astnodes.Name(H,Sk.astnodes.Load,B(u),u.col_offset),U=oe(I,S(u,3),W,!1)}return q=f(I,S(u,6)),z=_(S(u,1).value),h(I,S(u,1),z,S(u,1).lineno),new Sk.astnodes.ClassDef(z,U.args,U.keywords,q,M,null,B(u),u.col_offset)}function ut(I,u){var M,z;return A(u)===3?(M=new Sk.astnodes.arguments_([],null,null,[]),z=se(I,S(u,2))):(M=Oe(I,S(u,1)),z=se(I,S(u,3))),new Sk.astnodes.Lambda(M,z,u.lineno,u.col_offset)}function kt(I,u){var M,z,U,q,H,W,ne,ie,ee,ue,fe,ge,Te,Ee;function Se(xe,be){var tt=0;e:for(;;){if(tt++,O(be,t.comp_for),A(be)===5)be=S(be,4);else return tt;t:for(;;){if(O(be,t.comp_iter),be=S(be,0),be.type===t.comp_for)continue e;if(be.type===t.comp_if)if(A(be)===3){be=S(be,2);continue t}else return tt;break}break}Sk.asserts.fail("logic error in countCompFors")}function we(xe,be){for(var tt=0;;){if(O(be,t.comp_iter),S(be,0).type===t.comp_for||(be=S(be,0),O(be,t.comp_if),tt++,A(be)===2))return tt;be=S(be,2)}}for(fe=Se(I,u),Te=[],ie=0;ie<fe;++ie){if(O(u,t.comp_for),ne=S(u,1),W=j(I,ne,Sk.astnodes.Store),H=se(I,S(u,3)),A(ne)===1?Ee=new Sk.astnodes.comprehension(W[0],H,[]):Ee=new Sk.astnodes.comprehension(new Sk.astnodes.Tuple(W,Sk.astnodes.Store,u.lineno,u.col_offset),H,[]),A(u)===5){for(u=S(u,4),U=we(I,u),z=[],M=0;M<U;++M)O(u,t.comp_iter),u=S(u,0),O(u,t.comp_if),H=se(I,S(u,1)),z[M]=H,A(u)===3&&(u=S(u,2));u.type===t.comp_iter&&(u=S(u,0)),Ee.ifs=z}Te[ie]=Ee}return Te}function Le(I,u,M){var z,U;if(Sk.asserts.assert(A(u)>1),z=se(I,S(u,0)),U=kt(I,S(u,1)),M===a)return new Sk.astnodes.GeneratorExp(z,U,u.lineno,u.col_offset);if(M===r)return new Sk.astnodes.SetComp(z,U,u.lineno,u.col_offset)}function ct(I,u){var M=0,z;e:for(;;){if(z=0,M++,O(u,t.comp_for),D(S(u,0))==n.T_ASYNC&&(z=1),A(u)==5+z)u=S(u,4+z);else return M;t:for(;;){if(O(u,t.comp_iter),u=S(u,0),D(u)===t.comp_for)continue e;if(D(u)===t.comp_if)if(A(u)===3){u=S(u,2);continue t}else return M;break}break}}function qe(I,u){for(var M=0;;){if(O(u,t.comp_iter),D(S(u,0))==t.comp_for||(u=S(u,0),O(u,t.comp_if),M++,A(u)==2))return M;u=S(u,2)}}function Fe(I,u){var M,z,U=[];for(z=ct(I,u),M=0;M<z;M++){var q,H,W,ne,ie,ee=0;if(D(S(u,0))==n.T_ASYNC&&(ee=1),ie=S(u,1+ee),H=j(I,ie,Sk.astnodes.Store),!H||(W=se(I,S(u,3+ee)),!W))return null;if(ne=H[0],A(ie)==1?q=new Sk.astnodes.comprehension(ne,W,null,ee):q=new Sk.astnodes.comprehension(new Sk.astnodes.Tuple(H,Sk.astnodes.Store,ne.lineno,ne.col_offset,ie.end_lineno,ie.end_col_offset),W,null,ee),A(u)==5+ee){var ue,fe,ge=[];if(u=S(u,4+ee),fe=qe(I,u),fe==-1)return null;for(ue=0;ue<fe;ue++){if(O(u,t.comp_iter),u=S(u,0),O(u,t.comp_if),W=se(I,S(u,1)),!W)return null;ge[ue]=W,A(u)==3&&(u=S(u,2))}D(u)==t.comp_iter&&(u=S(u,0)),q.ifs=ge}U[M]=q}return U}function Ye(I,u,M){var z,U,q;return Sk.asserts.assert(A(u)>1),q=S(u,0),z=se(I,q),z.constructor===Sk.astnodes.Starred?(s(I,q,"iterable unpacking cannot be used in comprehension"),o):(U=Fe(I,S(u,1)),M==a?new Sk.astnodes.GeneratorExp(z,U,B(u),u.col_offset,u.end_lineno,u.end_col_offset):M==i?new Sk.astnodes.ListComp(z,U,B(u),u.col_offset,u.end_lineno,u.end_col_offset):M==r?new Sk.astnodes.SetComp(z,U,B(u),u.col_offset,u.end_lineno,u.end_col_offset):null)}function et(I,u,M){var z;if(D(S(u,M))==n.T_DOUBLESTAR)return Sk.asserts.assert(A(u)-M>=2),z=se(I,S(u,M+1)),{key:null,value:z,i:M+2};if(Sk.asserts.assert(A(u)-M>=3),z=se(I,S(u,M)),!z)return 0;var U=z;if(O(S(u,M+1),n.T_COLON),z=se(I,S(u,M+2)),!z)return!1;var q=z;return{key:U,value:q,i:M+3}}function We(I,u){var M,z,U=[];return Sk.asserts.assert(A(u)>3),O(S(u,1),n.T_COLON),M=se(I,S(u,0)),z=se(I,S(u,2)),U=kt(I,S(u,3)),new Sk.astnodes.DictComp(M,z,U,u.lineno,u.col_offset)}function Ue(I,u){var M,z,U=[],q=[];for(z=0,M=0;M<A(u);M++){var H=et(I,u,M);M=H.i,U[z]=H.key,q[z]=H.value,z++}return new Sk.astnodes.Dict(U,q,B(u),u.col_offset,u.end_lineno,u.end_col_offset)}function ft(I,u){return Sk.asserts.assert(u.type===t.testlist_comp||u.type===t.argument),Le(I,u,a)}function Xe(I,u){return Sk.asserts.assert(u.type===t.dictorsetmaker),Le(I,u,r)}function ce(I,u){if(O(u,t.while_stmt),A(u)===4)return new Sk.astnodes.While(se(I,S(u,1)),f(I,S(u,3)),[],u.lineno,u.col_offset);if(A(u)===7)return new Sk.astnodes.While(se(I,S(u,1)),f(I,S(u,3)),f(I,S(u,6)),u.lineno,u.col_offset);Sk.asserts.fail("wrong number of tokens for 'while' stmt")}function me(I,u){switch(O(u,t.augassign),u=S(u,0),u.value.charAt(0)){case"+":return Sk.astnodes.Add;case"-":return Sk.astnodes.Sub;case"/":return u.value.charAt(1)==="/"?Sk.astnodes.FloorDiv:Sk.astnodes.Div;case"%":return Sk.astnodes.Mod;case"<":return Sk.astnodes.LShift;case">":return Sk.astnodes.RShift;case"&":return Sk.astnodes.BitAnd;case"^":return Sk.astnodes.BitXor;case"|":return Sk.astnodes.BitOr;case"*":return u.value.charAt(1)==="*"?Sk.astnodes.Pow:Sk.astnodes.Mult;case"@":if(Sk.__future__.python3)return Sk.astnodes.MatMult;default:Sk.asserts.fail("invalid augassign")}}function dt(I,u){var M,z,U,q,H=new Sk.astnodes.BinOp(se(I,S(u,0)),d(S(u,1)),se(I,S(u,2)),u.lineno,u.col_offset),W=(A(u)-1)/2;for(q=1;q<W;++q)U=S(u,q*2+1),z=d(U),M=se(I,S(u,q*2+2)),H=new Sk.astnodes.BinOp(H,z,M,U.lineno,U.col_offset);return H}function je(I,u){return Sk.asserts.assert(A(u)>0),u.type===t.testlist_comp?A(u)>1&&Sk.asserts.assert(S(u,1).type!==t.comp_for):Sk.asserts.assert(u.type===t.testlist||u.type===t.testlist_star_expr),A(u)===1?se(I,S(u,0)):new Sk.astnodes.Tuple(R(I,u),Sk.astnodes.Load,u.lineno,u.col_offset)}function Ge(I,u){var M,z,U,q,H,W,ne,ie,ee,ue,fe,ge,Te;if(O(u,t.expr_stmt),A(u)===1)return new Sk.astnodes.Expr(je(I,S(u,0)),u.lineno,u.col_offset);if(S(u,1).type===t.augassign){switch(ee=S(u,0),ie=je(I,ee),c(I,ie,Sk.astnodes.Store,ee),ie.constructor){case Sk.astnodes.Name:ne=ie.id,h(I,ee,ne,u.lineno);break;case Sk.astnodes.Attribute:case Sk.astnodes.Subscript:break;case Sk.astnodes.GeneratorExp:throw new Sk.builtin.SyntaxError("augmented assignment to generator expression not possible",I.c_filename,u.lineno);case Sk.astnodes.Yield:throw new Sk.builtin.SyntaxError("augmented assignment to yield expression not possible",I.c_filename,u.lineno);default:throw new Sk.builtin.SyntaxError("illegal expression for augmented assignment",I.c_filename,u.lineno)}return ee=S(u,2),ee.type===t.testlist?W=je(I,ee):W=se(I,ee),new Sk.astnodes.AugAssign(ie,me(I,S(u,1)),W,u.lineno,u.col_offset)}else if(S(u,1).type===t.annassign){if(!Sk.__future__.python3)throw new Sk.builtin.SyntaxError("Annotated assignment is not supported in Python 2",I.c_filename,u.lineno);for(ee=S(u,0),ue=S(u,1),fe=1,ge=ee;A(ge)==1;)ge=S(ge,0);switch(A(ge)>0&&D(S(ge,0))==n.T_LPAR&&(fe=0),ie=je(I,ee),ie.constructor){case Sk.astnodes.Name:ne=ie.id,h(I,ee,ne,u.lineno),c(I,ie,Sk.astnodes.Store,ee);break;case Sk.astnodes.Attribute:ne=ie.attr,h(I,ee,ne,u.lineno),c(I,ie,Sk.astnodes.Store,ee);break;case Sk.astnodes.Subscript:c(I,ie,Sk.astnodes.Store,ee);break;case Sk.astnodes.List:throw new Sk.builtin.SyntaxError("only single target (not list) can be annotated",I.c_filename,u.lineno);case Sk.astnodes.Tuple:throw new Sk.builtin.SyntaxError("only single target (not tuple) can be annotated",I.c_filename,u.lineno);default:throw new Sk.builtin.SyntaxError("illegal target for annotation",I.c_filename,u.lineno)}return ie.constructor!=Sk.astnodes.Name&&(fe=0),ee=S(ue,1),W=se(I,ee),A(ue)==2?new Sk.astnodes.AnnAssign(ie,W,null,fe,u.lineno,u.col_offset):(ee=S(ue,3),Te=se(I,ee),new Sk.astnodes.AnnAssign(ie,W,Te,fe,u.lineno,u.col_offset))}else{for(O(S(u,1),n.T_EQUAL),H=[],q=0;q<A(u)-2;q+=2){if(ee=S(u,q),ee.type===t.yield_expr)throw new Sk.builtin.SyntaxError("assignment to yield expression not possible",I.c_filename,u.lineno);U=je(I,ee),c(I,U,Sk.astnodes.Store,S(u,q)),H[q/2]=U}return z=S(u,A(u)-1),z.type===t.testlist_star_expr?M=je(I,z):M=se(I,z),new Sk.astnodes.Assign(H,M,u.lineno,u.col_offset)}}function pt(I,u){return Sk.asserts.assert(A(u)===5),new Sk.astnodes.IfExp(se(I,S(u,2)),se(I,S(u,0)),se(I,S(u,4)),u.lineno,u.col_offset)}function Re(I,u,M){var z=M.charAt(0),U=!1,q=!1,H=!1,W=!1,ne=function(ee,ue){var fe,ge,Te,Ee,Se,we,xe=ee.length,be="";for(we=0;we<xe;++we)Se=ee.charAt(we),Se==="\\"?(++we,Se=ee.charAt(we),Se==="n"?be+=`
`:Se==="\\"?be+="\\":Se==="t"?be+="	":Se==="r"?be+="\r":Se==="b"?be+="\b":Se==="f"?be+="\f":Se==="v"?be+="\v":Se==="0"?be+="\0":Se==='"'?be+='"':Se==="'"?be+="'":Se===`
`||(Se==="x"?(we+2>=xe&&s(I,u,"Truncated \\xNN escape"),be+=String.fromCharCode(parseInt(ee.substr(we+1,2),16)),we+=2):!W&&Se==="u"?(we+4>=xe&&s(I,u,"Truncated \\uXXXX escape"),be+=String.fromCharCode(parseInt(ee.substr(we+1,4),16)),we+=4):!W&&Se==="U"?(we+8>=xe&&s(I,u,"Truncated \\UXXXXXXXX escape"),be+=String.fromCodePoint(parseInt(ee.substr(we+1,8),16)),we+=8):be+="\\"+Se)):W&&Se.charCodeAt(0)>127?s(I,u,"bytes can only contain ASCII literal characters"):be+=Se;return be};(I.c_flags&Sk.Parser.CO_FUTURE_UNICODE_LITERALS||Sk.__future__.unicode_literals===!0)&&(q=!0);let ie={};for(;;){if(z==="u"||z==="U")q=!0;else if(z==="r"||z==="R")U=!0;else if(z==="b"||z==="B")W=!0;else if(z==="f"||z==="F")H=!0;else break;M=M.substr(1),z=M.charAt(0)}if(Sk.asserts.assert(z==="'"||z==='"'&&M.charAt(M.length-1)===z),M=M.substr(1,M.length-2),M.length>=4&&M.charAt(0)===z&&M.charAt(1)===z&&(Sk.asserts.assert(M.charAt(M.length-1)===z&&M.charAt(M.length-2)===z),M=M.substr(2,M.length-4)),U||M.indexOf("\\")===-1){if(W)for(let ee=0;ee<M.length;ee++)M.charCodeAt(ee)>127&&s(I,u,"bytes can only contain ASCII literal characters");return[v(M),H,W]}return[v(ne(M,z)),H,W]}function Ve(I,u,M,z,U){Sk.asserts.assert(M>=u),Sk.asserts.assert(I.charAt(u-1)=="{"),Sk.asserts.assert(I.charAt(M)=="}"||I.charAt(M)=="!"||I.charAt(M)==":");let q=I.substring(u,M);/^\s*$/.test(q)&&s(z,U,"f-string: empty expression not allowed"),q="("+q+")";let H;try{let W=Sk.parse("<fstring>",q);H=Sk.astFromParse(W.cst,"<fstring>",W.flags)}catch(W){if(W.traceback&&W.traceback[0]){let ne=W.traceback[0];ne.lineno=(ne.lineno||1)-1+B(U),ne.filename=z.c_filename}throw W}return Sk.asserts.assert(H.body.length==1&&H.body[0].constructor===Sk.astnodes.Expr),H.body[0].value}function He(I,u,M,z,U,q,H){let W=u;Sk.asserts.assert(I.charAt(W)=="{"),W++;let ne=W,ie=null,ee=0,ue=0,fe,ge,Te=()=>s(q,H,"f-string: expecting '}'");for(Sk.asserts.assert(W<=M);W<M;W++){let xe=I.charAt(W);if(xe=="\\"&&s(q,H,"f-string expression part cannot include a backslash"),ie){if(xe==ie)if(ee==3){if(W+2<M&&I.charAt(W+1)==xe&&I.charAt(W+2)==xe){W+=2,ee=0,ie=0;continue}}else{ie=0,ee=0;continue}}else if(xe=="'"||xe=='"')W+2<M&&I.charAt(W+1)==xe&&I.charAt(W+2)==xe?(ee=3,W+=2):ee=1,ie=xe;else if(xe=="["||xe=="{"||xe=="(")ue++;else if(ue!=0&&(xe=="]"||xe=="}"||xe==")"))ue--;else if(xe=="#")s(q,H,"f-string expression part cannot include '#'");else if(ue==0&&(xe=="!"||xe==":"||xe=="}")){if(xe=="!"&&W+1<M&&I.charAt(W+1)=="=")continue;break}}ie&&s(q,H,"f-string: unterminated string"),ue&&s(q,H,"f-string: mismatched '(', '{', or '['");let Se=Ve(I,ne,W,q,H);return I.charAt(W)=="!"&&(W++,W>=M&&Te(),ge=I.charAt(W),W++,ge=="s"||ge=="r"||ge=="a"||s(q,H,"f-string: invalid conversion character: expected 's', 'r', or 'a'")),W>=M&&Te(),I.charAt(W)==":"&&(W++,W>=M&&Te(),[fe,W]=Ae(I,W,M,z,U+1,q,H)),(W>=M||I.charAt(W)!="}")&&Te(),W++,[new Sk.astnodes.FormattedValue(Se,ge,fe,B(H),H.col_offset),W]}function Ae(I,u,M,z,U,q,H){let W=[],ne=u,ie=ee=>{if(ee.indexOf("}")!==-1){if(/(^|[^}])}(}})*($|[^}])/.test(ee))throw new SyntaxError("f-string: single '}' is not allowed",B(H),H.col_offset);ee=ee.replace(/}}/g,"}")}W.push(new Sk.astnodes.Str(new Sk.builtin.str(ee),B(H),H.col_offset,q.end_lineno,H.end_col_offset))};for(;ne<M;){let ee=I.indexOf("{",ne);if(U!==0){let ue=I.indexOf("}",ne);ue!==-1&&(ee===-1?M=ue:ee>ue&&(ee=-1,M=ue))}if(ee===-1){ie(I.substring(ne,M)),ne=M;break}else if(ee+1<M&&I.charAt(ee+1)==="{"){ie(I.substring(ne,ee+1)),ne=ee+2;continue}else{ie(I.substring(ne,ee)),ne=ee;let[ue,fe]=He(I,ee,M,z,U,q,H);W.push(ue),ne=fe}}return[new Sk.astnodes.JoinedStr(W,B(H),H.col_offset),ne]}function De(I,u){let M=[],z,U;for(let q=0;q<A(u);++q){let H=S(u,q).value,W=Re(I,S(u,q),H),ne=W[0],ie=W[1],ee=W[2];if(q!=0&&U!==ee&&s(I,u,"cannot mix bytes and nonbytes literals"),U=ee,ie){if(!Sk.__future__.python3)throw new Sk.builtin.SyntaxError("invalid string (f-strings are not supported in Python 2)",I.c_filename,S(u,q).lineno);let ue=ne.$jsstr(),[fe,ge]=Ae(ue,0,ue.length,!1,0,I,S(u,q));M.push.apply(M,fe.values),z=null}else if(z)z.s=z.s.sq$concat(ne);else{let ue=U?Sk.astnodes.Bytes:Sk.astnodes.Str;z=new ue(ne,B(u),u.col_offset,I.end_lineno,u.end_col_offset),M.push(z)}}return M.length===1&&M[0].constructor===Sk.astnodes.Str?M[0]:new Sk.astnodes.JoinedStr(M,B(u),u.col_offset,I.end_lineno,u.end_col_offset)}let Bt=/_[eE]|[eE]_|\._|j_/,Lt=/_\.|[+-]_|^0_\D|_j/,Zt=/_(?=[^_])/g;function en(I,u,M){var z,U,q,H=u.charAt(u.length-1);if(u.indexOf("_")!==-1){if(Bt.test(u))throw new Sk.builtin.SyntaxError("invalid syntax",I.c_filename,M);if(Lt.test(u))throw new Sk.builtin.SyntaxError("invalid decimal literal",I.c_filename,M);u=u.replace(Zt,"")}if(H==="j"||H==="J")return Sk.builtin.complex.complex_subtype_from_string(u);if(H==="l"||H==="L")return Sk.longFromStr(u.substr(0,u.length-1),0);if(u.indexOf(".")!==-1)return new Sk.builtin.float_(parseFloat(u));if(q=u,z=!1,u.charAt(0)==="-"&&(q=u.substr(1),z=!0),q.charAt(0)==="0"&&(q.charAt(1)==="x"||q.charAt(1)==="X"))q=q.substring(2),U=parseInt(q,16);else{if(u.indexOf("e")!==-1||u.indexOf("E")!==-1)return new Sk.builtin.float_(parseFloat(u));q.charAt(0)==="0"&&(q.charAt(1)==="b"||q.charAt(1)==="B")?(q=q.substring(2),U=parseInt(q,2)):q.charAt(0)==="0"?q==="0"?U=0:(q=q.substring(1),(q.charAt(0)==="o"||q.charAt(0)==="O")&&(q=q.substring(1)),U=parseInt(q,8)):U=parseInt(q,10)}return U>Number.MAX_SAFE_INTEGER&&Math.floor(U)===U&&u.indexOf("e")===-1&&u.indexOf("E")===-1?Sk.longFromStr(u,0):z?new Sk.builtin.int_(-U):new Sk.builtin.int_(U)}function Rt(I,u){var M,z,U,q,H;return O(u,t.subscript),H=S(u,0),q=null,U=null,z=null,H.type===n.T_DOT?new Sk.astnodes.Ellipsis:A(u)===1&&H.type===t.test?new Sk.astnodes.Index(se(I,H)):(H.type===t.test&&(q=se(I,H)),H.type===n.T_COLON?A(u)>1&&(M=S(u,1),M.type===t.test&&(U=se(I,M))):A(u)>2&&(M=S(u,2),M.type===t.test&&(U=se(I,M))),H=S(u,A(u)-1),H.type===t.sliceop&&(A(H)===1?(H=S(H,0),z=new Sk.astnodes.NameConstant(Sk.builtin.none.none$,Sk.astnodes.Load,H.lineno,H.col_offset)):(H=S(H,1),H.type===t.test&&(z=se(I,H)))),new Sk.astnodes.Slice(q,U,z))}function Dt(I,u){var M=S(u,0);switch(D(M)){case n.T_NAME:{var z,U=F(M);if(U.length>=4&&U.length<=5){if(U==="None")return new Sk.astnodes.NameConstant(Sk.builtin.none.none$,u.lineno,u.col_offset);if(U==="True")return new Sk.astnodes.NameConstant(Sk.builtin.bool.true$,u.lineno,u.col_offset);if(U==="False")return new Sk.astnodes.NameConstant(Sk.builtin.bool.false$,u.lineno,u.col_offset)}return z=_(U,I),new Sk.astnodes.Name(z,Sk.astnodes.Load,B(u),u.col_offset,u.end_lineno,u.end_col_offset)}case n.T_STRING:return De(I,u);case n.T_NUMBER:return new Sk.astnodes.Num(en(I,M.value,u.lineno),u.lineno,u.col_offset);case n.T_ELLIPSIS:return new Sk.astnodes.Ellipsis(B(u),u.col_offset,u.end_lineno,u.end_col_offset);case n.T_LPAR:return M=S(u,1),D(M)==n.T_RPAR?new Sk.astnodes.Tuple([],Sk.astnodes.Load,B(u),u.col_offset,u.end_lineno,u.end_col_offset):D(M)==t.yield_expr?se(I,M):A(M)==1?je(I,M):D(S(M,1))==t.comp_for?b(ae(I,M),u):b(je(I,M),u);case n.T_LSQB:if(M=S(u,1),D(M)==n.T_RSQB)return new Sk.astnodes.List([],Sk.astnodes.Load,B(u),u.col_offset,u.end_lineno,u.end_col_offset);if(O(M,t.testlist_comp),A(M)==1||D(S(M,1))==n.T_COMMA){var q=R(I,M);return q?new Sk.astnodes.List(q,Sk.astnodes.Load,B(u),u.col_offset,u.end_lineno,u.end_col_offset):null}else return b(le(I,M),u);case n.T_LBRACE:{var H;if(M=S(u,1),D(M)==n.T_RBRACE)return new Sk.astnodes.Dict(null,null,B(u),u.col_offset,u.end_lineno,u.end_col_offset);var W=D(S(M,0))==n.T_DOUBLESTAR;if(A(M)==1||A(M)>1&&D(S(M,1))==n.T_COMMA)H=tn(I,M);else if(A(M)>1&&D(S(M,1))==t.comp_for)H=Xe(I,M);else if(A(M)>3-W&&D(S(M,3-W))==t.comp_for){if(W)return s(I,u,"dict unpacking cannot be used in dict comprehension"),null;H=We(I,M)}else H=Ue(I,M);return b(H,u)}default:return Sk.asserts.fail("unhandled atom "+D(M)),null}}function tn(I,u){var M,z=[];for(Sk.asserts.assert(D(u)===t.dictorsetmaker),M=0;M<A(u);M+=2){var U;U=se(I,S(u,M)),z[M/2]=U}return new Sk.astnodes.Set(z,B(u),u.col_offset)}function nn(I,u){var M,z,U=0,q,H;if(O(u,t.atom_expr),z=A(u),S(u,0).type===n.T_AWAIT&&(U=1,Sk.asserts.assert(z>1)),q=Dt(I,S(u,U)),!q)return null;if(z===1)return q;if(U&&z===2)return new Sk.astnodes.Await(q,u.lineno,u.col_offset);for(M=U+1;M<z;M++){var W=S(u,M);if(W.type!==t.trailer)break;if(H=he(I,W,q),!H)return null;H.lineno=q.lineno,H.col_offset=q.col_offset,q=H}return U?new Sk.astnodes.Await(q,u.line,u.col_offset):q}function rn(I,u){var M,z,U,q,H;return O(u,t.power),H=nn(I,S(u,0)),A(u)===1||S(u,A(u)-1).type===t.factor&&(M=se(I,S(u,A(u)-1)),H=new Sk.astnodes.BinOp(H,Sk.astnodes.Pow,M,u.lineno,u.col_offset)),H}function sn(I,u){return O(u,t.star_expr),new Sk.astnodes.Starred(se(I,S(u,1)),Sk.astnodes.Load,u.lineno,u.col_offset)}function se(I,u){var M,z,U,q,H;e:for(;;){switch(u.type){case t.test:case t.test_nocond:if(S(u,0).type===t.lambdef||S(u,0).type===t.lambdef_nocond)return ut(I,S(u,0));if(A(u)>1)return pt(I,u);case t.or_test:case t.and_test:if(A(u)===1){u=S(u,0);continue e}for(H=[],q=0;q<A(u);q+=2)H[q/2]=se(I,S(u,q));return S(u,1).value==="and"?new Sk.astnodes.BoolOp(Sk.astnodes.And,H,u.lineno,u.col_offset):(Sk.asserts.assert(S(u,1).value==="or"),new Sk.astnodes.BoolOp(Sk.astnodes.Or,H,u.lineno,u.col_offset));case t.not_test:if(A(u)===1){u=S(u,0);continue e}else return new Sk.astnodes.UnaryOp(Sk.astnodes.Not,se(I,S(u,1)),u.lineno,u.col_offset);break;case t.comparison:if(A(u)===1){u=S(u,0);continue e}else{for(U=[],z=[],q=1;q<A(u);q+=2)U[(q-1)/2]=E(I,S(u,q)),z[(q-1)/2]=se(I,S(u,q+1));return new Sk.astnodes.Compare(se(I,S(u,0)),U,z,u.lineno,u.col_offset)}break;case t.star_expr:return sn(I,u);case t.expr:case t.xor_expr:case t.and_expr:case t.shift_expr:case t.arith_expr:case t.term:if(A(u)===1){u=S(u,0);continue e}return dt(I,u);case t.yield_expr:var W,ne,ie=!1;return M=null,A(u)>1&&(W=S(u,1)),W&&(ne=S(W,A(W)-1),A(W)==2?(ie=!0,M=se(I,ne)):M=je(I,ne)),ie?new Sk.astnodes.YieldFrom(M,u.lineno,u.col_offset):new Sk.astnodes.Yield(M,u.lineno,u.col_offset);case t.factor:if(A(u)===1){u=S(u,0);continue e}return re(I,u);case t.power:return rn(I,u);default:Sk.asserts.fail("unhandled expr","n.type: %d",u.type)}break}}function an(I,u){s(I,u,"Not implemented: nonlocal")}function on(I,u){s(I,u,"Not implemented: async")}function ln(I,u){Sk.__future__.print_function&&s(I,u,"Missing parentheses in call to 'print'");var M,z,U,q,H=1,W=null;for(O(u,t.print_stmt),A(u)>=2&&S(u,1).type===n.T_RIGHTSHIFT&&(W=se(I,S(u,2)),H=4),q=[],z=H,U=0;z<A(u);z+=2,++U)q[U]=se(I,S(u,z));return M=S(u,A(u)-1).type!==n.T_COMMA,new Sk.astnodes.Print(W,q,M,u.lineno,u.col_offset)}function ht(I,u){var M;if(u.type===t.stmt&&(Sk.asserts.assert(A(u)===1),u=S(u,0)),u.type===t.simple_stmt&&(Sk.asserts.assert(N(u)===1),u=S(u,0)),u.type===t.small_stmt)switch(u=S(u,0),u.type){case t.expr_stmt:return Ge(I,u);case t.del_stmt:return V(I,u);case t.pass_stmt:return new Sk.astnodes.Pass(u.lineno,u.col_offset);case t.flow_stmt:return $e(I,u);case t.import_stmt:return Z(I,u);case t.global_stmt:return G(I,u);case t.nonlocal_stmt:return an(I,u);case t.assert_stmt:return X(I,u);case t.print_stmt:return ln(I,u);case t.debugger_stmt:return new Sk.astnodes.Debugger(u.lineno,u.col_offset);default:Sk.asserts.fail("unhandled small_stmt")}else switch(M=S(u,0),O(u,t.compound_stmt),M.type){case t.if_stmt:return K(I,M);case t.while_stmt:return ce(I,M);case t.for_stmt:return ke(I,M);case t.try_stmt:return k(I,M);case t.with_stmt:return P(I,M);case t.funcdef:return ze(I,M,[]);case t.classdef:return Ze(I,M,[]);case t.decorated:return C(I,M);case t.async_stmt:return on(I,M);default:Sk.asserts.assert("unhandled compound_stmt")}}Sk.astFromParse=function(I,u,M){var z,U,q,H,W=new T("utf-8",u,M),ne=[],ie=0;switch(I.type){case t.file_input:for(H=0;H<A(I)-1;++H)if(q=S(I,H),I.type!==n.T_NEWLINE)if(O(q,t.stmt),U=N(q),U===1)ne[ie++]=ht(W,q);else for(q=S(q,0),O(q,t.simple_stmt),z=0;z<U;++z)ne[ie++]=ht(W,S(q,z*2));return new Sk.astnodes.Module(ne);case t.eval_input:Sk.asserts.fail("todo;");case t.single_input:Sk.asserts.fail("todo;");default:Sk.asserts.fail("todo;")}},Sk.astDump=function(I){var u=function(z){var U,q="";for(U=0;U<z;++U)q+=" ";return q},M=function(z,U){var q,H,W,ne,ie,ee,ue,fe,ge,Te,Ee,Se,we;if(z===null)return U+"None";if(z.prototype&&z.prototype._astname!==void 0&&z.prototype._isenum)return U+z.prototype._astname+"()";if(z._astname!==void 0){for(we=u(z._astname.length+1),Se=[],Ee=0;Ee<z._fields.length;Ee+=2)Te=z._fields[Ee],ge=z._fields[Ee+1](z),fe=u(Te.length+1),Se.push([Te,M(ge,U+we+fe)]);for(ue=[],Ee=0;Ee<Se.length;++Ee)ee=Se[Ee],ue.push(ee[0]+"="+ee[1].replace(/^\s+/,""));return ie=ue.join(`,
`+U+we),U+z._astname+"("+ie+")"}else if(Sk.isArrayLike(z)){for(ne=[],Ee=0;Ee<z.length;++Ee)W=z[Ee],ne.push(M(W,U+" "));return H=ne.join(`,
`),U+"["+H.replace(/^\s+/,"")+"]"}else return z===!0?q="True":z===!1?q="False":z instanceof Sk.builtin.lng?q=z.tp$str().v:z instanceof Sk.builtin.str?q=z.$r().v:q=""+z,U+q};return M(I,"")},Sk.exportSymbol("Sk.astFromParse",Sk.astFromParse),Sk.exportSymbol("Sk.astDump",Sk.astDump)}),"./src/bool.js":(function(Y,y){let t=Sk.builtin.int_.prototype;Sk.builtin.bool=Sk.abstr.buildNativeClass("bool",{constructor:function(a){return Sk.misceval.isTrue(a)?Sk.builtin.bool.true$:Sk.builtin.bool.false$},base:Sk.builtin.int_,slots:{tp$doc:`bool(x) -> bool

Returns True when the argument x is true, False otherwise.
The builtins True and False are the only two instances of the class bool.
The class bool is a subclass of the class int, and cannot be subclassed.`,tp$new(n,a){return Sk.abstr.checkNoKwargs("bool",a),Sk.abstr.checkArgsLen("bool",n,0,1),new Sk.builtin.bool(n[0])},$r(){return this.v?this.str$True:this.str$False},tp$as_number:!0,nb$and(n){return n.ob$type===Sk.builtin.bool?new Sk.builtin.bool(this.v&n.v):t.nb$and.call(this,n)},nb$or(n){return n.ob$type===Sk.builtin.bool?new Sk.builtin.bool(this.v|n.v):t.nb$or.call(this,n)},nb$xor(n){return n.ob$type===Sk.builtin.bool?new Sk.builtin.bool(this.v^n.v):t.nb$xor.call(this,n)}},flags:{sk$acceptable_as_base_class:!1},methods:{__format__:{$meth(){return this.$r()},$flags:{OneArg:!0}}},proto:{str$False:new Sk.builtin.str("False"),str$True:new Sk.builtin.str("True")}}),Sk.exportSymbol("Sk.builtin.bool",Sk.builtin.bool),Sk.builtin.bool.true$=Object.create(Sk.builtin.bool.prototype,{v:{value:1,enumerable:!0}}),Sk.builtin.bool.false$=Object.create(Sk.builtin.bool.prototype,{v:{value:0,enumerable:!0}})}),"./src/builtin.js":(function(Y,y){var t;Sk.builtin.asnum$=function(i){return i===void 0||i===null||typeof i=="number"?i:i instanceof Sk.builtin.int_?typeof i.v=="number"?i.v:i.v.toString():i instanceof Sk.builtin.float_?i.v:i===Sk.builtin.none.none$?null:i},Sk.exportSymbol("Sk.builtin.asnum$",Sk.builtin.asnum$),Sk.builtin.assk$=function(i){return i%1===0?new Sk.builtin.int_(i):new Sk.builtin.float_(i)},Sk.exportSymbol("Sk.builtin.assk$",Sk.builtin.assk$),Sk.builtin.asnum$nofloat=function(i){var r,o,p;if(i===void 0)return i;if(i===null)return i;if(typeof i=="number")i=i.toString();else if(i instanceof Sk.builtin.int_)i=i.v.toString();else if(i instanceof Sk.builtin.float_)i=i.v.toString();else return i===Sk.builtin.none.none$?null:void 0;if(i.indexOf(".")<0&&i.indexOf("e")<0&&i.indexOf("E")<0)return i;if(p=0,i.indexOf("e")>=0?(o=i.substr(0,i.indexOf("e")),p=i.substr(i.indexOf("e")+1)):i.indexOf("E")>=0?(o=i.substr(0,i.indexOf("e")),p=i.substr(i.indexOf("E")+1)):o=i,p=parseInt(p,10),r=o.indexOf("."),r<0)if(p>=0){for(;p-- >0;)o+="0";return o}else return o.length>-p?o.substr(0,o.length+p):0;for(r===0?o=o.substr(1):r<o.length?o=o.substr(0,r)+o.substr(r+1):o=o.substr(0,r),r=r+p;r>o.length;)o+="0";return r<=0?o=0:o=o.substr(0,r),o},Sk.exportSymbol("Sk.builtin.asnum$nofloat",Sk.builtin.asnum$nofloat),Sk.builtin.round=function(r,o){if(r===void 0)throw new Sk.builtin.TypeError("a float is required");if(!Sk.__future__.dunder_round){if(!Sk.builtin.checkNumber(r))throw new Sk.builtin.TypeError("a float is required");if(r.round$)return r.round$(o);throw new Sk.builtin.AttributeError(Sk.abstr.typeName(r)+" instance has no attribute '__float__'")}if(o!==void 0&&!Sk.builtin.checkNone(o)&&!Sk.misceval.isIndex(o))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(o)+"' object cannot be interpreted as an index");let p=Sk.abstr.lookupSpecial(r,Sk.builtin.str.$round);if(p!==void 0)return o!==void 0?Sk.misceval.callsimArray(p,[o]):Sk.misceval.callsimArray(p,[]);throw new Sk.builtin.TypeError("a float is required")},Sk.builtin.len=function(r){let o;if(r.sq$length)o=r.sq$length(!0);else throw new Sk.builtin.TypeError("object of type '"+Sk.abstr.typeName(r)+"' has no len()");return Sk.misceval.chain(o,p=>new Sk.builtin.int_(p))},Sk.builtin.min=function(r,o){let p,w=r.length;if(!w)throw new Sk.builtin.TypeError("min expected 1 argument, got 0");let[T,A]=Sk.abstr.copyKeywordsToNamedArgs("min",["default","key"],[],o,[null,Sk.builtin.none.none$]);if(w>1&&T!==null)throw new Sk.builtin.TypeError("Cannot specify a default for min() with multiple positional arguments");if(w==1?p=Sk.abstr.iter(r[0]):p=Sk.abstr.iter(new Sk.builtin.tuple(r)),!Sk.builtin.checkNone(A)&&!Sk.builtin.checkCallable(A))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(A)+"' object is not callable");let S;return Sk.misceval.chain(p.tp$iternext(!0),O=>{if(S=O,S!==void 0)return Sk.builtin.checkNone(A)?Sk.misceval.iterFor(p,D=>{Sk.misceval.richCompareBool(D,S,"Lt")&&(S=D)}):Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(A,[S]),D=>Sk.misceval.iterFor(p,B=>Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(A,[B]),F=>{Sk.misceval.richCompareBool(F,D,"Lt")&&(S=B,D=F)})))},()=>{if(S===void 0){if(T===null)throw new Sk.builtin.ValueError("min() arg is an empty sequence");S=T}return S})},Sk.builtin.max=function(r,o){let p,w=r.length;if(!w)throw new Sk.builtin.TypeError("max expected 1 argument, got 0");let[T,A]=Sk.abstr.copyKeywordsToNamedArgs("min",["default","key"],[],o,[null,Sk.builtin.none.none$]);if(w>1&&T!==null)throw new Sk.builtin.TypeError("Cannot specify a default for max() with multiple positional arguments");if(w===1?p=Sk.abstr.iter(r[0]):p=Sk.abstr.iter(new Sk.builtin.tuple(r)),!Sk.builtin.checkNone(A)&&!Sk.builtin.checkCallable(A))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(A)+"' object is not callable");let S;return Sk.misceval.chain(p.tp$iternext(!0),O=>{if(S=O,S!==void 0)return Sk.builtin.checkNone(A)?Sk.misceval.iterFor(p,D=>{Sk.misceval.richCompareBool(D,S,"Gt")&&(S=D)}):Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(A,[S]),D=>Sk.misceval.iterFor(p,B=>Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(A,[B]),F=>{Sk.misceval.richCompareBool(F,D,"Gt")&&(S=B,D=F)})))},()=>{if(S===void 0){if(T===null)throw new Sk.builtin.ValueError("min() arg is an empty sequence");S=T}return S})},Sk.builtin.min.co_fastcall=Sk.builtin.max.co_fastcall=1,Sk.builtin.any=function(r){return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(r),function(o){if(Sk.misceval.isTrue(o))return new Sk.misceval.Break(Sk.builtin.bool.true$)}),o=>o||Sk.builtin.bool.false$)},Sk.builtin.all=function(r){return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(r),function(o){if(!Sk.misceval.isTrue(o))return new Sk.misceval.Break(Sk.builtin.bool.false$)}),o=>o||Sk.builtin.bool.true$)},Sk.builtin.sum=function(r,o){var p;let w=Sk.abstr.iter(r);if(o===void 0)p=new Sk.builtin.int_(0);else{if(Sk.builtin.checkString(o))throw new Sk.builtin.TypeError("sum() can't sum strings [use ''.join(seq) instead]");p=o}function T(){return Sk.misceval.iterFor(w,D=>{if(D.constructor===Sk.builtin.int_)p=p.nb$add(D);else return D.constructor===Sk.builtin.float_?(p=p.nb$float().nb$add(D),new Sk.misceval.Break("float")):(p=Sk.abstr.numberBinOp(p,D,"Add"),new Sk.misceval.Break("slow"))})}function A(){return Sk.misceval.iterFor(w,D=>{if(D.constructor===Sk.builtin.float_||D.constructor===Sk.builtin.int_)p=p.nb$add(D);else return p=Sk.abstr.numberBinOp(p,D,"Add"),new Sk.misceval.Break("slow")})}function S(){return Sk.misceval.iterFor(w,D=>{p=Sk.abstr.numberBinOp(p,D,"Add")})}let O;return o===void 0||o.constructor===Sk.builtin.int_?O=T():o.constructor===Sk.builtin.float_?O="float":O="slow",Sk.misceval.chain(O,D=>D==="float"?A():D,D=>{if(D==="slow")return S()},()=>p)},Sk.builtin.zip=function(){var r,o,p,w,T,A;if(arguments.length===0)return new Sk.builtin.list([]);for(A=[],T=0;T<arguments.length;T++)if(Sk.builtin.checkIterable(arguments[T]))A.push(Sk.abstr.iter(arguments[T]));else throw new Sk.builtin.TypeError("argument "+T+" must support iteration");for(w=[],p=!1;!p;){for(o=[],T=0;T<arguments.length;T++){if(r=A[T].tp$iternext(),r===void 0){p=!0;break}o.push(r)}p||w.push(new Sk.builtin.tuple(o))}return new Sk.builtin.list(w)},Sk.builtin.abs=function(r){if(r.nb$abs)return r.nb$abs();throw new TypeError("bad operand type for abs(): '"+Sk.abstr.typeName(r)+"'")},Sk.builtin.fabs=function(r){return Sk.builtin.abs(r)},Sk.builtin.ord=function(r){if(Sk.builtin.checkString(r)){if(r.v.length!==1&&r.sq$length()!==1)throw new Sk.builtin.TypeError("ord() expected a character, but string of length "+r.v.length+" found");return new Sk.builtin.int_(r.v.codePointAt(0))}else if(Sk.builtin.checkBytes(r)){if(r.sq$length()!==1)throw new Sk.builtin.TypeError("ord() expected a character, but string of length "+r.v.length+" found");return new Sk.builtin.int_(r.v[0])}throw new Sk.builtin.TypeError("ord() expected a string of length 1, but "+Sk.abstr.typeName(r)+" found")},Sk.builtin.chr=function(r){if(!Sk.builtin.checkInt(r))throw new Sk.builtin.TypeError("an integer is required");if(r=Sk.builtin.asnum$(r),Sk.__future__.python3){if(r<0||r>=1114112)throw new Sk.builtin.ValueError("chr() arg not in range(0x110000)")}else if(r<0||r>=256)throw new Sk.builtin.ValueError("chr() arg not in range(256)");return new Sk.builtin.str(String.fromCodePoint(r))},Sk.builtin.unichr=function(r){if(!Sk.builtin.checkInt(r))throw new Sk.builtin.TypeError("an integer is required");r=Sk.builtin.asnum$(r);try{return new Sk.builtin.str(String.fromCodePoint(r))}catch(o){throw o instanceof RangeError?new Sk.builtin.ValueError(o.message):o}},Sk.builtin.int2str_=function(r,o,p){let w;r.constructor===Sk.builtin.int_||r instanceof Sk.builtin.int_||(r=r.nb$index()),w=r.v;let T=w.toString(o);return r.nb$isnegative()?T="-"+p+T.slice(1):T=p+T,o!==2&&!Sk.__future__.python3&&(r instanceof Sk.builtin.lng||JSBI.__isBigInt(w))&&(T+="L"),new Sk.builtin.str(T)},Sk.builtin.hex=function(r){if(!Sk.misceval.isIndex(r))throw new Sk.builtin.TypeError("hex() argument can't be converted to hex");return Sk.builtin.int2str_(r,16,"0x")},Sk.builtin.oct=function(r){if(!Sk.misceval.isIndex(r))throw new Sk.builtin.TypeError("oct() argument can't be converted to hex");return Sk.__future__.octal_number_literal?Sk.builtin.int2str_(r,8,"0o"):Sk.builtin.int2str_(r,8,"0")},Sk.builtin.bin=function(r){if(!Sk.misceval.isIndex(r))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(r)+"' object can't be interpreted as an index");return Sk.builtin.int2str_(r,2,"0b")},Sk.builtin.dir=function(r){if(r!==void 0){let o=Sk.abstr.lookupSpecial(r,Sk.builtin.str.$dir);return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(o,[]),p=>Sk.builtin.sorted(p))}throw new Sk.builtin.NotImplementedError("skulpt does not yet support dir with no args")},Sk.builtin.repr=function(r){return r.$r()},Sk.builtin.ascii=function(r){return Sk.misceval.chain(r.$r(),o=>{let p,w;for(w=0;w<o.v.length;w++)if(o.v.charCodeAt(w)>=127){p=o.v.substr(0,w);break}if(!p)return o;for(;w<o.v.length;w++){let T=o.v.charAt(w),A=o.v.charCodeAt(w);if(A>127&&A<=255){let S=A.toString(16);S.length<2&&(S="0"+S),p+="\\x"+S}else if(A>127&&A<55296||A>=57344)p+="\\u"+("000"+A.toString(16)).slice(-4);else if(A>=55296){let S=o.v.codePointAt(w);w++,S=S.toString(16);let O="0000000"+S.toString(16);S.length>4?p+="\\U"+O.slice(-8):p+="\\u"+O.slice(-4)}else p+=T}return new Sk.builtin.str(p)})},Sk.builtin.open=function(r,o,p){if(o===void 0&&(o=new Sk.builtin.str("r")),/\+/.test(o.v))throw"todo; haven't implemented read/write mode";if((o.v==="w"||o.v==="wb"||o.v==="a"||o.v==="ab")&&!Sk.nonreadopen)throw"todo; haven't implemented non-read opens";return new Sk.builtin.file(r,o,p)},Sk.builtin.isinstance=function(r,o){if(!Sk.builtin.checkClass(o)&&!(o instanceof Sk.builtin.tuple))throw new Sk.builtin.TypeError("isinstance() arg 2 must be a class, type, or tuple of classes and types");let p=r.ob$type;if(p===o)return Sk.builtin.bool.true$;if(!(o instanceof Sk.builtin.tuple)){if(p.$isSubType(o))return Sk.builtin.bool.true$;let w=r.tp$getattr(Sk.builtin.str.$class);return w==p?Sk.builtin.bool.false$:Sk.builtin.checkClass(w)&&w.$isSubType(o)?Sk.builtin.bool.true$:Sk.builtin.bool.false$}for(let w=0;w<o.v.length;++w)if(Sk.misceval.isTrue(Sk.builtin.isinstance(r,o.v[w])))return Sk.builtin.bool.true$;return Sk.builtin.bool.false$},Sk.builtin.hash=function(r){return new Sk.builtin.int_(Sk.abstr.objectHash(r))},Sk.builtin.getattr=function(r,o,p){if(!Sk.builtin.checkString(o))throw new Sk.builtin.TypeError("attribute name must be string");let w=Sk.misceval.tryCatch(()=>r.tp$getattr(o,!0),T=>{if(!(T instanceof Sk.builtin.AttributeError))throw T});return Sk.misceval.chain(w,T=>{if(T===void 0){if(p!==void 0)return p;throw new Sk.builtin.AttributeError(r.sk$attrError()+" has no attribute "+Sk.misceval.objectRepr(o))}return T})},Sk.builtin.setattr=function(r,o,p){if(!Sk.builtin.checkString(o))throw new Sk.builtin.TypeError("attribute name must be string");return Sk.misceval.chain(r.tp$setattr(o,p,!0),()=>Sk.builtin.none.none$)},Sk.builtin.raw_input=function(i){var r=i||"";return Sk.misceval.chain(Sk.importModule("sys",!1,!0),function(o){return Sk.inputfunTakesPrompt?Sk.builtin.file.$readline(o.$d.stdin,null,r):Sk.misceval.chain(void 0,function(){return Sk.misceval.callsimOrSuspendArray(o.$d.stdout.write,[o.$d.stdout,new Sk.builtin.str(r)])},function(){return Sk.misceval.callsimOrSuspendArray(o.$d.stdin.readline,[o.$d.stdin])})})},Sk.builtin.input=Sk.builtin.raw_input,Sk.builtin.jseval=function(r){let o=Sk.global.eval(Sk.ffi.remapToJs(r));return Sk.ffi.remapToPy(o)},Sk.builtin.jsmillis=function(){console.warn("jsmillis is deprecated");var r=new Date;return r.valueOf()},Sk.builtin.eval_=function(){throw new Sk.builtin.NotImplementedError("eval is not yet implemented")},Sk.builtin.map=function(r,o){var p=[],w,T,A,S,O,D,B;if(Sk.builtin.pyCheckArgsLen("map",arguments.length,2),arguments.length>2){for(B=[],D=Array.prototype.slice.apply(arguments).slice(1),O=0;O<D.length;O++){if(!Sk.builtin.checkIterable(D[O]))throw S=parseInt(O,10)+2,new Sk.builtin.TypeError("argument "+S+" to map() must support iteration");D[O]=Sk.abstr.iter(D[O])}for(;;){for(A=[],T=0,O=0;O<D.length;O++)w=D[O].tp$iternext(),w===void 0?(A.push(Sk.builtin.none.none$),T++):A.push(w);if(T!==D.length)B.push(A);else break}o=new Sk.builtin.list(B)}if(!Sk.builtin.checkIterable(o))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(o)+"' object is not iterable");return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(o),function(F){if(r===Sk.builtin.none.none$)F instanceof Array&&(F=new Sk.builtin.tuple(F)),p.push(F);else return F instanceof Array||(F=[F]),Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(r,F),function(s){p.push(s)})}),function(){return new Sk.builtin.list(p)})},Sk.builtin.reduce=function(r,o,p){var w,T,A;if(!Sk.builtin.checkIterable(o))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(o)+"' object is not iterable");if(A=Sk.abstr.iter(o),p===void 0&&(p=A.tp$iternext(),p===void 0))throw new Sk.builtin.TypeError("reduce() of empty sequence with no initial value");for(T=p,w=A.tp$iternext();w!==void 0;w=A.tp$iternext())T=Sk.misceval.callsimArray(r,[T,w]);return T},Sk.builtin.sorted=function(r,o,p,w){let T=Sk.misceval.arrayFromIterable(r,!0);return Sk.misceval.chain(T,A=>(A=new Sk.builtin.list(A),A.list$sort(o,p,w),A))},Sk.builtin.filter=function(r,o){var p,w,T,A,S,O,D;if(Sk.builtin.pyCheckArgsLen("filter",arguments.length,2,2),!Sk.builtin.checkIterable(o))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(o)+"' object is not iterable");for(D=function(){return[]},O=function(B,F){return B.push(F),B},S=function(B){return new Sk.builtin.list(B)},o.ob$type===Sk.builtin.str?(D=function(){return new Sk.builtin.str("")},O=function(B,F){return B.sq$concat(F)},S=function(B){return B}):o.ob$type===Sk.builtin.tuple&&(S=function(B){return new Sk.builtin.tuple(B)}),A=D(),w=Sk.abstr.iter(o),T=w.tp$iternext();T!==void 0;T=w.tp$iternext())r===Sk.builtin.none.none$?p=new Sk.builtin.bool(T):p=Sk.misceval.callsimArray(r,[T]),Sk.misceval.isTrue(p)&&(A=O(A,T));return S(A)},Sk.builtin.hasattr=function(r,o){if(!Sk.builtin.checkString(o))throw new Sk.builtin.TypeError("hasattr(): attribute name must be string");let p=Sk.misceval.tryCatch(()=>r.tp$getattr(o,!0),w=>{if(!(w instanceof Sk.builtin.AttributeError))throw w});return Sk.misceval.chain(p,w=>w===void 0?Sk.builtin.bool.false$:Sk.builtin.bool.true$)},Sk.builtin.pow=function(r,o,p){if(p===void 0||Sk.builtin.checkNone(p))return Sk.abstr.numberBinOp(r,o,"Pow");if(!(Sk.builtin.checkInt(r)&&Sk.builtin.checkInt(o)&&Sk.builtin.checkInt(p))){if(Sk.builtin.checkFloat(r)||Sk.builtin.checkComplex(r))return r.nb$power(o,p);throw new Sk.builtin.TypeError("unsupported operand type(s) for ** or pow(): '"+Sk.abstr.typeName(r)+"', '"+Sk.abstr.typeName(o)+"', '"+Sk.abstr.typeName(p)+"'")}return r.nb$power(o,p)},Sk.builtin.quit=function(r){var o=new Sk.builtin.str(r).v;throw new Sk.builtin.SystemExit(o)},Sk.builtin.issubclass=function(r,o){if(!Sk.builtin.checkClass(r))throw new Sk.builtin.TypeError("issubclass() arg 1 must be a class");let p=Sk.builtin.checkClass(o);if(!p&&!(o instanceof Sk.builtin.tuple))throw new Sk.builtin.TypeError("issubclass() arg 2 must be a class or tuple of classes");if(p)return r.$isSubType(o)?Sk.builtin.bool.true$:Sk.builtin.bool.false$;for(let w=0;w<o.v.length;++w)if(Sk.misceval.isTrue(Sk.builtin.issubclass(r,o.v[w])))return Sk.builtin.bool.true$;return Sk.builtin.bool.false$},Sk.builtin.globals=function(){var r,o,p=new Sk.builtin.dict([]);for(r in Sk.globals)o=Sk.unfixReserved(r),p.mp$ass_subscript(new Sk.builtin.str(o),Sk.globals[r]);return p},Sk.builtin.divmod=function(r,o){return Sk.abstr.numberBinOp(r,o,"DivMod")},Sk.builtin.format=function(r,o){return o===void 0&&(o=Sk.builtin.str.$emptystr),Sk.abstr.objectFormat(r,o)};let n=new Map,a=0;Sk.builtin.id=function(i){let r=n.get(i);return r!==void 0?new Sk.builtin.int_(r):(n.set(i,a),new Sk.builtin.int_(a++))},Sk.builtin.bytearray=function(){throw new Sk.builtin.NotImplementedError("bytearray is not yet implemented")},Sk.builtin.callable=function(r){return Sk.builtin.checkCallable(r)?Sk.builtin.bool.true$:Sk.builtin.bool.false$},Sk.builtin.delattr=function(r,o){return Sk.builtin.setattr(r,o,void 0)},Sk.builtin.execfile=function(){throw new Sk.builtin.NotImplementedError("execfile is not yet implemented")},Sk.builtin.help=function(){throw new Sk.builtin.NotImplementedError("help is not yet implemented")},Sk.builtin.iter=function(r,o){return arguments.length===1?Sk.abstr.iter(r):Sk.abstr.iter(new Sk.builtin.callable_iter_(r,o))},Sk.builtin.locals=function(){throw new Sk.builtin.NotImplementedError("locals is not yet implemented")},Sk.builtin.memoryview=function(){throw new Sk.builtin.NotImplementedError("memoryview is not yet implemented")},Sk.builtin.next_=function(r,o){var p;if(!r.tp$iternext)throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(r)+"' object is not an iterator");if(p=r.tp$iternext(),p===void 0){if(o)return o;throw new Sk.builtin.StopIteration}return p},Sk.builtin.reload=function(){throw new Sk.builtin.NotImplementedError("reload is not yet implemented")},Sk.builtin.vars=function(){throw new Sk.builtin.NotImplementedError("vars is not yet implemented")},Sk.builtin.apply_=function(){throw new Sk.builtin.NotImplementedError("apply is not yet implemented")},Sk.builtin.buffer=function(){throw new Sk.builtin.NotImplementedError("buffer is not yet implemented")},Sk.builtin.coerce=function(){throw new Sk.builtin.NotImplementedError("coerce is not yet implemented")},Sk.builtin.intern=function(){throw new Sk.builtin.NotImplementedError("intern is not yet implemented")}}),"./src/builtindict.js":(function(Y,y){Sk.builtins={round:null,len:null,min:null,max:null,sum:null,abs:null,fabs:null,ord:null,chr:null,hex:null,oct:null,bin:null,dir:null,repr:null,open:null,isinstance:null,hash:null,getattr:null,hasattr:null,id:null,reduce:new Sk.builtin.func(Sk.builtin.reduce),sorted:null,any:null,all:null,enumerate:Sk.builtin.enumerate,filter:Sk.builtin.filter_,map:Sk.builtin.map_,range:Sk.builtin.range_,reversed:Sk.builtin.reversed,zip:Sk.builtin.zip_,BaseException:Sk.builtin.BaseException,AttributeError:Sk.builtin.AttributeError,ValueError:Sk.builtin.ValueError,Exception:Sk.builtin.Exception,ZeroDivisionError:Sk.builtin.ZeroDivisionError,AssertionError:Sk.builtin.AssertionError,ImportError:Sk.builtin.ImportError,IndentationError:Sk.builtin.IndentationError,IndexError:Sk.builtin.IndexError,LookupError:Sk.builtin.LookupError,KeyError:Sk.builtin.KeyError,TypeError:Sk.builtin.TypeError,UnicodeDecodeError:Sk.builtin.UnicodeDecodeError,UnicodeEncodeError:Sk.builtin.UnicodeEncodeError,NameError:Sk.builtin.NameError,IOError:Sk.builtin.IOError,NotImplementedError:Sk.builtin.NotImplementedError,SystemExit:Sk.builtin.SystemExit,OverflowError:Sk.builtin.OverflowError,OperationError:Sk.builtin.OperationError,NegativePowerError:Sk.builtin.NegativePowerError,RuntimeError:Sk.builtin.RuntimeError,RecursionError:Sk.builtin.RecursionError,StopIteration:Sk.builtin.StopIteration,SyntaxError:Sk.builtin.SyntaxError,SystemError:Sk.builtin.SystemError,float_$rw$:Sk.builtin.float_,int_$rw$:Sk.builtin.int_,bool:Sk.builtin.bool,complex:Sk.builtin.complex,dict:Sk.builtin.dict,file:Sk.builtin.file,frozenset:Sk.builtin.frozenset,function:Sk.builtin.func,generator:Sk.builtin.generator,list:Sk.builtin.list,long_$rw$:Sk.builtin.lng,method:Sk.builtin.method,object:Sk.builtin.object,slice:Sk.builtin.slice,str:Sk.builtin.str,set:Sk.builtin.set,tuple:Sk.builtin.tuple,type:Sk.builtin.type,input:null,raw_input:new Sk.builtin.func(Sk.builtin.raw_input),setattr:null,jseval:Sk.builtin.jseval,jsmillis:Sk.builtin.jsmillis,quit:new Sk.builtin.func(Sk.builtin.quit),exit:new Sk.builtin.func(Sk.builtin.quit),print:null,divmod:null,format:null,globals:null,issubclass:null,iter:null,execfile:Sk.builtin.execfile,help:Sk.builtin.help,memoryview:Sk.builtin.memoryview,reload:Sk.builtin.reload,super_$rw$:Sk.builtin.super_,unichr:Sk.builtin.unichr,vars:Sk.builtin.vars,apply_$rw$:Sk.builtin.apply_,buffer:Sk.builtin.buffer,coerce:Sk.builtin.coerce,intern:Sk.builtin.intern,property:Sk.builtin.property,classmethod:Sk.builtin.classmethod,staticmethod:Sk.builtin.staticmethod},Sk.abstr.setUpModuleMethods("builtins",Sk.builtins,{__import__:{$meth:Sk.builtin.__import__,$flags:{NamedArgs:["name","globals","locals","fromlist","level"]},$textsig:null,$doc:`__import__(name, globals=None, locals=None, fromlist=(), level=0) -> module

Import a module. Because this function is meant for use by the Python
interpreter and not for general use, it is better to use
importlib.import_module() to programmatically import a module.

The globals argument is only used to determine the context;
they are not modified.  The locals argument is unused.  The fromlist
should be a list of names to emulate \`\`from name import ...'', or an
empty list to emulate \`\`import name''.
When importing a module from a package, note that __import__('A.B', ...)
returns package A when fromlist is empty, but its submodule B when
fromlist is not empty.  The level argument is used to determine whether to
perform absolute or relative imports: 0 is absolute, while a positive number
is the number of parent directories to search relative to the current module.`},abs:{$meth:Sk.builtin.abs,$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the absolute value of the argument."},all:{$meth:Sk.builtin.all,$flags:{OneArg:!0},$textsig:"($module, iterable, /)",$doc:`Return True if bool(x) is True for all values x in the iterable.

If the iterable is empty, return True.`},any:{$meth:Sk.builtin.any,$flags:{OneArg:!0},$textsig:"($module, iterable, /)",$doc:`Return True if bool(x) is True for any x in the iterable.

If the iterable is empty, return False.`},ascii:{$meth:Sk.builtin.ascii,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return an ASCII-only representation of an object.

As repr(), return a string containing a printable representation of an
object, but escape the non-ASCII characters in the string returned by
repr() using \\\\x, \\\\u or \\\\U escapes. This generates a string similar
to that returned by repr() in Python 2.`},bin:{$meth:Sk.builtin.bin,$flags:{OneArg:!0},$textsig:"($module, number, /)",$doc:`Return the binary representation of an integer.

   >>> bin(2796202)
   '0b1010101010101010101010'`},callable:{$meth:Sk.builtin.callable,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return whether the object is callable (i.e., some kind of function).

Note that classes are callable, as are instances of classes with a
__call__() method.`},chr:{$meth:Sk.builtin.chr,$flags:{OneArg:!0},$textsig:"($module, i, /)",$doc:"Return a Unicode string of one character with ordinal i; 0 <= i <= 0x10ffff."},delattr:{$meth:Sk.builtin.delattr,$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, obj, name, /)",$doc:"Deletes the named attribute from the given object.\n\ndelattr(x, 'y') is equivalent to ``del x.y''"},dir:{$meth:Sk.builtin.dir,$flags:{MinArgs:0,MaxArgs:1},$textsig:null,$doc:`dir([object]) -> list of strings

If called without an argument, return the names in the current scope.
Else, return an alphabetized list of names comprising (some of) the attributes
of the given object, and of attributes reachable from it.
If the object supplies a method named __dir__, it will be used; otherwise
the default dir() logic is used and returns:
  for a module object: the module's attributes.
  for a class object:  its attributes, and recursively the attributes
    of its bases.
  for any other object: its attributes, its class's attributes, and
    recursively the attributes of its class's base classes.`},divmod:{$meth:Sk.builtin.divmod,$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Return the tuple (x//y, x%y).  Invariant: div*y + mod == x."},eval_$rw$:{$name:"eval",$meth:Sk.builtin.eval_,$flags:{MinArgs:1,MaxArgs:3},$textsig:"($module, source, globals=None, locals=None, /)",$doc:`Evaluate the given source in the context of globals and locals.

The source may be a string representing a Python expression
or a code object as returned by compile().
The globals must be a dictionary and locals can be any mapping,
defaulting to the current globals and locals.
If only globals is given, locals defaults to it.`},format:{$meth:Sk.builtin.format,$flags:{MinArgs:1,MaxArgs:2},$textsig:"($module, value, format_spec='', /)",$doc:`Return value.__format__(format_spec)

format_spec defaults to the empty string.
See the Format Specification Mini-Language section of help('FORMATTING') for
details.`},getattr:{$meth:Sk.builtin.getattr,$flags:{MinArgs:2,MaxArgs:3},$textsig:null,$doc:`getattr(object, name[, default]) -> value

Get a named attribute from an object; getattr(x, 'y') is equivalent to x.y.
When a default argument is given, it is returned when the attribute doesn't
exist; without it, an exception is raised in that case.`},globals:{$meth:Sk.builtin.globals,$flags:{NoArgs:!0},$textsig:"($module, /)",$doc:`Return the dictionary containing the current scope's global variables.

NOTE: Updates to this dictionary *will* affect name lookups in the current
global scope and vice-versa.`},hasattr:{$meth:Sk.builtin.hasattr,$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, obj, name, /)",$doc:`Return whether the object has an attribute with the given name.

This is done by calling getattr(obj, name) and catching AttributeError.`},hash:{$meth:Sk.builtin.hash,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return the hash value for the given object.

Two objects that compare equal must also have the same hash value, but the
reverse is not necessarily true.`},hex:{$meth:Sk.builtin.hex,$flags:{OneArg:!0},$textsig:"($module, number, /)",$doc:`Return the hexadecimal representation of an integer.

   >>> hex(12648430)
   '0xc0ffee'`},id:{$meth:Sk.builtin.id,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return the identity of an object.

This is guaranteed to be unique among simultaneously existing objects.
(CPython uses the object's memory address.)`},input:{$meth:Sk.builtin.input,$flags:{MinArgs:0,MaxArgs:1},$textsig:"($module, prompt=None, /)",$doc:`Read a string from standard input.  The trailing newline is stripped.

The prompt string, if given, is printed to standard output without a
trailing newline before reading input.

If the user hits EOF (*nix: Ctrl-D, Windows: Ctrl-Z+Return), raise EOFError.
On *nix systems, readline is used if available.`},isinstance:{$meth:Sk.builtin.isinstance,$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, obj, class_or_tuple, /)",$doc:"Return whether an object is an instance of a class or of a subclass thereof.\n\nA tuple, as in ``isinstance(x, (A, B, ...))``, may be given as the target to\ncheck against. This is equivalent to ``isinstance(x, A) or isinstance(x, B)\nor ...`` etc."},issubclass:{$meth:Sk.builtin.issubclass,$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, cls, class_or_tuple, /)",$doc:"Return whether 'cls' is a derived from another class or is the same class.\n\nA tuple, as in ``issubclass(x, (A, B, ...))``, may be given as the target to\ncheck against. This is equivalent to ``issubclass(x, A) or issubclass(x, B)\nor ...`` etc."},iter:{$meth:Sk.builtin.iter,$flags:{MinArgs:1,MaxArgs:2},$textsig:"($module, iterable /)",$doc:`iter(iterable) -> iterator
iter(callable, sentinel) -> iterator

Get an iterator from an object.  In the first form, the argument must
supply its own iterator, or be a sequence.
In the second form, the callable is called until it returns the sentinel.`},len:{$meth:Sk.builtin.len,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:"Return the number of items in a container."},locals:{$meth:Sk.builtin.locals,$flags:{NoArgs:!0},$textsig:"($module, /)",$doc:`Return a dictionary containing the current scope's local variables.

NOTE: Whether or not updates to this dictionary will affect name lookups in
the local scope and vice-versa is *implementation dependent* and not
covered by any backwards compatibility guarantees.`},max:{$meth:Sk.builtin.max,$flags:{FastCall:!0},$textsig:null,$doc:`max(iterable, *[, default=obj, key=func]) -> value
max(arg1, arg2, *args, *[, key=func]) -> value

With a single iterable argument, return its biggest item. The
default keyword-only argument specifies an object to return if
the provided iterable is empty.
With two or more arguments, return the largest argument.`},min:{$meth:Sk.builtin.min,$flags:{FastCall:!0},$textsig:null,$doc:`min(iterable, *[, default=obj, key=func]) -> value
min(arg1, arg2, *args, *[, key=func]) -> value

With a single iterable argument, return its smallest item. The
default keyword-only argument specifies an object to return if
the provided iterable is empty.
With two or more arguments, return the smallest argument.`},next:{$name:"next",$meth:Sk.builtin.next_,$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:`next(iterator[, default])

Return the next item from the iterator. If default is given and the iterator
is exhausted, it is returned instead of raising StopIteration.`},oct:{$meth:Sk.builtin.oct,$flags:{OneArg:!0},$textsig:"($module, number, /)",$doc:`Return the octal representation of an integer.

   >>> oct(342391)
   '0o1234567'`},open:{$meth:Sk.builtin.open,$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`open(name[, mode[, buffering]]) -> file object

Open a file using the file() type, returns a file object.  This is the
preferred way to open a file.  See file.__doc__ for further information.`},ord:{$meth:Sk.builtin.ord,$flags:{OneArg:!0},$textsig:"($module, c, /)",$doc:"Return the Unicode code point for a one-character string."},pow:{$meth:Sk.builtin.pow,$flags:{MinArgs:2,MaxArgs:3},$textsig:"($module, x, y, z=None, /)",$doc:`Equivalent to x**y (with two arguments) or x**y % z (with three arguments)

Some types, such as ints, are able to use a more efficient algorithm when
invoked using the three argument form.`},print:{$meth:Sk.builtin.print,$flags:{FastCall:!0},$textsig:null,$doc:`print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)

Prints the values to a stream, or to sys.stdout by default.
Optional keyword arguments:
file:  a file-like object (stream); defaults to the current sys.stdout.
sep:   string inserted between values, default a space.
end:   string appended after the last value, default a newline.
flush: whether to forcibly flush the stream.`},repr:{$meth:Sk.builtin.repr,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return the canonical string representation of the object.

For many object types, including most builtins, eval(repr(obj)) == obj.`},round:{$meth:Sk.builtin.round,$flags:{NamedArgs:["number","ndigits"]},$textsig:"($module, /, number, ndigits=None)",$doc:`Round a number to a given precision in decimal digits.

The return value is an integer if ndigits is omitted or None.  Otherwise
the return value has the same type as the number.  ndigits may be negative.`},setattr:{$meth:Sk.builtin.setattr,$flags:{MinArgs:3,MaxArgs:3},$textsig:"($module, obj, name, value, /)",$doc:"Sets the named attribute on the given object to the specified value.\n\nsetattr(x, 'y', v) is equivalent to ``x.y = v''"},sorted:{$meth:Sk.builtin.sorted,$flags:{NamedArgs:[null,"cmp","key","reverse"],Defaults:[Sk.builtin.none.none$,Sk.builtin.none.none$,Sk.builtin.bool.false$]},$textsig:"($module, iterable, /, *, key=None, reverse=False)",$doc:`Return a new list containing all items from the iterable in ascending order.

A custom key function can be supplied to customize the sort order, and the
reverse flag can be set to request the result in descending order.`},sum:{$meth:Sk.builtin.sum,$flags:{NamedArgs:[null,"start"],Defaults:[new Sk.builtin.int_(0)]},$textsig:"($module, iterable, /, start=0)",$doc:`Return the sum of a 'start' value (default: 0) plus an iterable of numbers

When the iterable is empty, return the start value.
This function is intended specifically for use with numeric values and may
reject non-numeric types.`},vars:{$meth:Sk.builtin.vars,$flags:{MinArgs:0,MaxArgs:1},$textsig:null,$doc:`vars([object]) -> dictionary

Without arguments, equivalent to locals().
With an argument, equivalent to object.__dict__.`}}),Sk.setupObjects=function(t){t?(Sk.builtins.filter=Sk.builtin.filter_,Sk.builtins.map=Sk.builtin.map_,Sk.builtins.zip=Sk.builtin.zip_,Sk.builtins.range=Sk.builtin.range_,delete Sk.builtins.xrange,delete Sk.builtins.StandardError,delete Sk.builtins.unicode,delete Sk.builtins.basestring,delete Sk.builtins.long_$rw$,Sk.builtin.int_.prototype.$r=function(){return new Sk.builtin.str(this.v.toString())},delete Sk.builtin.int_.prototype.tp$str,delete Sk.builtin.bool.prototype.tp$str,delete Sk.builtins.raw_input,delete Sk.builtin.str.prototype.decode,Sk.builtins.bytes=Sk.builtin.bytes,Sk.builtins.ascii=new Sk.builtin.sk_method({$meth:Sk.builtin.ascii,$flags:{OneArg:!0},$textsig:"($module, obj, /)",$doc:`Return an ASCII-only representation of an object.

As repr(), return a string containing a printable representation of an
object, but escape the non-ASCII characters in the string returned by
repr() using \\\\x, \\\\u or \\\\U escapes. This generates a string similar
to that returned by repr() in Python 2.`},null,"builtins")):(Sk.builtins.range=new Sk.builtin.sk_method({$meth:Sk.builtin.range,$name:"range",$flags:{MinArgs:1,MaxArgs:3}},void 0,"builtins"),Sk.builtins.xrange=new Sk.builtin.sk_method({$meth:Sk.builtin.xrange,$name:"xrange",$flags:{MinArgs:1,MaxArgs:3}},null,"builtins"),Sk.builtins.filter=new Sk.builtin.func(Sk.builtin.filter),Sk.builtins.map=new Sk.builtin.func(Sk.builtin.map),Sk.builtins.zip=new Sk.builtin.func(Sk.builtin.zip),Sk.builtins.StandardError=Sk.builtin.Exception,Sk.builtins.unicode=Sk.builtin.str,Sk.builtins.basestring=Sk.builtin.str,Sk.builtins.long_$rw$=Sk.builtin.lng,Sk.builtin.int_.prototype.$r=function(){let n=this.v;return typeof n=="number"?new Sk.builtin.str(n.toString()):new Sk.builtin.str(n.toString()+"L")},Sk.builtin.int_.prototype.tp$str=function(){return new Sk.builtin.str(this.v.toString())},Sk.builtin.bool.prototype.tp$str=function(){return this.$r()},Sk.builtins.raw_input=new Sk.builtin.func(Sk.builtin.raw_input),Sk.builtin.str.prototype.decode=Sk.builtin.str.$py2decode,delete Sk.builtins.bytes,delete Sk.builtins.ascii)},Sk.exportSymbol("Sk.setupObjects",Sk.setupObjects),Sk.exportSymbol("Sk.builtins",Sk.builtins)}),"./src/bytes.js":(function(Y,y,t){t("./node_modules/fastestsmallesttextencoderdecoder/EncoderDecoderTogether.min.js");let n={utf:"utf-8",utf8:"utf-8",utf_8:"utf-8",ascii:"ascii"};var a=/\s+/g,i=/[_-]+/g;function r(k){let m=k.replace(a,"").replace(i,"_").toLowerCase(),g=n[m];return g===void 0?k:g}let o=new TextEncoder,p=new TextDecoder;Sk.builtin.bytes=Sk.abstr.buildNativeClass("bytes",{constructor:function(m){if(!(this instanceof Sk.builtin.bytes))throw new TypeError("bytes is a constructor use 'new'");if(m===void 0)this.v=new Uint8Array;else if(m instanceof Uint8Array)this.v=m;else if(Array.isArray(m))Sk.asserts.assert(m.every(g=>g>=0&&g<=255),"bad internal call to bytes with array"),this.v=new Uint8Array(m);else if(typeof m=="string"){let g,x=new Uint8Array(m.length),C=m.length;for(let L=0;L<C;L++){if(g=m.charCodeAt(L),g>255)throw new Sk.builtin.UnicodeDecodeError("invalid string at index "+L+" (possibly contains a unicode character)");x[L]=g}this.v=x}else if(typeof m=="number")this.v=new Uint8Array(m);else throw new Sk.builtin.TypeError("bad argument to bytes constructor")},slots:{tp$getattr:Sk.generic.getAttr,tp$doc:`bytes(iterable_of_ints) -> bytes
bytes(string, encoding[, errors]) -> bytes
bytes(bytes_or_buffer) -> immutable copy of bytes_or_buffer
bytes(int) -> bytes object of size given by the parameter initialized with null bytes
bytes() -> empty bytes object

Construct an immutable array of bytes from:
  - an iterable yielding integers in range(256)
  - a text string encoded using the specified encoding
  - any object implementing the buffer API.
  - an integer`,tp$new(k,m){if(this!==Sk.builtin.bytes.prototype)return this.$subtype_new(k,m);m=m||[];let g,x,C,L,P;if(k.length<=1&&+m.length==0)x=k[0];else{if([x,L,P]=Sk.abstr.copyKeywordsToNamedArgs("bytes",[null,"pySource","errors"],k,m),{encoding:L,errors:P}=w("bytes",L,P),!Sk.builtin.checkString(x))throw new Sk.builtin.TypeError("encoding or errors without a string argument");return T(x,L,P)}if(x===void 0)return new Sk.builtin.bytes;if((C=Sk.abstr.lookupSpecial(x,Sk.builtin.str.$bytes))!==void 0){let J=Sk.misceval.callsimOrSuspendArray(C,[]);return Sk.misceval.chain(J,K=>{if(!Sk.builtin.checkBytes(K))throw new Sk.builtin.TypeError("__bytes__ returned non-bytes (type "+Sk.abstr.typeName(K)+")");return K})}else if(Sk.misceval.isIndex(x)){if(g=Sk.misceval.asIndexSized(x,Sk.builtin.OverflowError),g<0)throw new Sk.builtin.ValueError("negative count");return new Sk.builtin.bytes(g)}else{if(Sk.builtin.checkBytes(x))return new Sk.builtin.bytes(x.v);if(Sk.builtin.checkString(x))throw new Sk.builtin.TypeError("string argument without an encoding");if(Sk.builtin.checkIterable(x)){let J=[],K=Sk.misceval.iterFor(Sk.abstr.iter(x),j=>{let V=Sk.misceval.asIndexSized(j);if(V<0||V>255)throw new Sk.builtin.ValueError("bytes must be in range(0, 256)");J.push(V)});return Sk.misceval.chain(K,()=>new Sk.builtin.bytes(J))}}throw new Sk.builtin.TypeError("cannot convert '"+Sk.abstr.typeName(g)+"' object into bytes")},$r(){let k,m="'",g=this.v.indexOf(34)!==-1,x="";for(let C=0;C<this.v.length;C++)if(k=this.v[C],k<9||k>10&&k<13||k>13&&k<32||k>126)x+=S(k);else if(k===9||k===10||k===13||k===39||k===92)switch(k){case 9:x+="\\t";break;case 10:x+="\\n";break;case 13:x+="\\r";break;case 39:g?x+="\\'":(x+="'",m='"');break;case 92:x+="\\\\";break}else x+=String.fromCharCode(k);return x="b"+m+x+m,new Sk.builtin.str(x)},tp$str(){return this.$r()},tp$iter(){return new $(this)},tp$richcompare(k,m){if(this===k&&Sk.misceval.opAllowsEquality(m))return!0;if(!(k instanceof Sk.builtin.bytes))return Sk.builtin.NotImplemented.NotImplemented$;let g=this.v,x=k.v;if(g.length!==x.length&&(m==="Eq"||m==="NotEq"))return m!=="Eq";let C,L=Math.min(g.length,x.length);for(C=0;C<L&&g[C]===x[C];C++);switch(m){case"Lt":return C===L&&g.length<x.length||g[C]<x[C];case"LtE":return C===L&&g.length<=x.length||g[C]<=x[C];case"Eq":return C===L;case"NotEq":return C<L;case"Gt":return C===L&&g.length>x.length||g[C]>x[C];case"GtE":return C===L&&g.length>=x.length||g[C]>=x[C]}},tp$hash(){return new Sk.builtin.str(this.$jsstr()).tp$hash()},tp$as_sequence_or_mapping:!0,mp$subscript(k){if(Sk.misceval.isIndex(k)){let m=Sk.misceval.asIndexSized(k,Sk.builtin.IndexError);if(m!==void 0){if(m<0&&(m=this.v.length+m),m<0||m>=this.v.length)throw new Sk.builtin.IndexError("index out of range");return new Sk.builtin.int_(this.v[m])}}else if(k instanceof Sk.builtin.slice){let m=[];return k.sssiter$(this.v.length,g=>{m.push(this.v[g])}),new Sk.builtin.bytes(new Uint8Array(m))}throw new Sk.builtin.TypeError("byte indices must be integers or slices, not "+Sk.abstr.typeName(k))},sq$length(){return this.v.length},sq$concat(k){if(!(k instanceof Sk.builtin.bytes))throw new Sk.builtin.TypeError("can't concat "+Sk.abstr.typeName(k)+" to bytes");let m=new Uint8Array(this.v.length+k.v.length),g;for(g=0;g<this.v.length;g++)m[g]=this.v[g];for(let x=0;x<k.v.length;x++,g++)m[g]=k.v[x];return new Sk.builtin.bytes(m)},sq$repeat(k){if(!Sk.misceval.isIndex(k))throw new Sk.builtin.TypeError("can't multiply sequence by non-int of type '"+Sk.abstr.typeName(k)+"'");k=Sk.misceval.asIndexSized(k,Sk.builtin.OverflowError);let m=k*this.v.length;if(m>Number.MAX_SAFE_INTEGER)throw new Sk.builtin.OverflowError;if(k<=0)return new Sk.builtin.bytes;let g=new Uint8Array(m),x=0;for(;x<m;)for(let C=0;C<this.v.length;C++)g[x++]=this.v[C];return new Sk.builtin.bytes(g)},sq$contains(k){return this.find$left(k)!==-1},tp$as_number:!0,nb$remainder:Sk.builtin.str.prototype.nb$remainder},proto:{$jsstr(){let k="";for(let m=0;m<this.v.length;m++)k+=String.fromCharCode(this.v[m]);return k},get$tgt(k){if(k instanceof Sk.builtin.bytes)return k.v;if(k=Sk.misceval.asIndexOrThrow(k,"argument should be integer or bytes-like object, not {tp$name}"),k<0||k>255)throw new Sk.builtin.ValueError("bytes must be in range(0, 256)");return k},get$raw(k){if(k instanceof Sk.builtin.bytes)return k.v;throw new Sk.builtin.TypeError("a bytes-like object is required, not '"+Sk.abstr.typeName(k)+"'")},get$splitArgs:E,find$left:s(!1),find$right:s(!0),find$subleft:function(m,g,x){x=x-m.length+1;let C=g;for(;C<x;){if(m.every((L,P)=>L===this.v[C+P]))return C;C++}return-1},find$subright(k,m,g){let x=g-k.length;for(;x>=m;){if(k.every((C,L)=>C===this.v[x+L]))return x;x--}return-1},$subtype_new(k,m){let g=new this.constructor,x=Sk.builtin.bytes.prototype.tp$new(k,m);return g.v=x.v,g},sk$asarray(){let k=[];return this.v.forEach(m=>{k.push(new Sk.builtin.int_(m))}),k}},flags:{str$encode:T,$decode:B,check$encodeArgs:w},methods:{__getnewargs__:{$meth(){return new Sk.builtin.tuple(new Sk.builtin.bytes(this.v))},$flags:{NoArgs:!0},$textsig:null,$doc:null},capitalize:{$meth(){let k=this.v.length;if(k===0)return new Sk.builtin.bytes(this.v);let m=new Uint8Array(k),g=this.v[0];m[0]=l(g)?g-32:g;for(let x=1;x<k;x++)g=this.v[x],m[x]=d(g)?g+32:g;return new Sk.builtin.bytes(m)},$flags:{NoArgs:!0},$textsig:null,$doc:`B.capitalize() -> copy of B

Return a copy of B with only its first character capitalized (ASCII)
and the rest lower-cased.`},center:{$meth:h("center",!1,!0),$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:`B.center(width[, fillchar]) -> copy of B

Return B centered in a string of length width.  Padding is
done using the specified fill character (default is a space).`},count:{$meth(k,m,g){k=this.get$tgt(k),{start:m,end:g}=Sk.builtin.slice.startEnd$wrt(this,m,g);let x=0;if(typeof k=="number")for(let C=m;C<g;C++)this.v[C]===k&&x++;else{let C=g-k.length+1;for(let L=m;L<C;L++)k.every((P,J)=>P===this.v[L+J])&&(x++,L+=k.length-1)}return new Sk.builtin.int_(x)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.count(sub[, start[, end]]) -> int

Return the number of non-overlapping occurrences of subsection sub in
bytes B[start:end].  Optional arguments start and end are interpreted
as in slice notation.`},decode:{$meth:B,$flags:{NamedArgs:["encoding","errors"]},$textsig:"($self, /, encoding='utf-8', errors='strict')",$doc:`Decode the bytes using the codec registered for encoding.

  encoding
    The encoding with which to decode the bytes.
  errors
    The error handling scheme to use for the handling of decoding errors.
    The default is 'strict' meaning that decoding errors raise a
    UnicodeDecodeError. Other possible values are 'ignore' and 'replace'
    as well as any other name registered with codecs.register_error that
    can handle UnicodeDecodeErrors.`},endswith:{$meth:F("endswith",(k,m)=>{let g=k.length-m.length;return g>=0&&m.every((x,C)=>x===k[g+C])}),$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.endswith(suffix[, start[, end]]) -> bool

Return True if B ends with the specified suffix, False otherwise.
With optional start, test B beginning at that position.
With optional end, stop comparing B at that position.
suffix can also be a tuple of bytes to try.`},expandtabs:{$meth(k){k=Sk.misceval.asIndexSized(k,Sk.builtin.OverflowError,"an integer is required (got type {tp$nam})");let m=[],g=0;for(let x=0;x<this.v.length;x++){let C=this.v[x];if(C===9){let L=k-g%k;m.push(...new Array(L).fill(32)),g+=L}else C===10||C===13?(m.push(C),g=0):(m.push(C),g++)}return new Sk.builtin.bytes(new Uint8Array(m))},$flags:{NamedArgs:["tabsize"],Defaults:[8]},$textsig:null,$doc:`B.expandtabs(tabsize=8) -> copy of B

Return a copy of B where all tab characters are expanded using spaces.
If tabsize is not given, a tab size of 8 characters is assumed.`},find:{$meth:function(m,g,x){return new Sk.builtin.int_(this.find$left(m,g,x))},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.find(sub[, start[, end]]) -> int

Return the lowest index in B where subsection sub is found,
such that sub is contained within B[start,end].  Optional
arguments start and end are interpreted as in slice notation.

Return -1 on failure.`},hex:{$meth(){let k="";for(let m=0;m<this.v.length;m++)k+=this.v[m].toString(16).padStart(2,"0");return new Sk.builtin.str(k)},$flags:{NoArgs:!0},$textsig:null,$doc:`B.hex() -> string

Create a string of hexadecimal numbers from a bytes object.
Example: b'\\xb9\\x01\\xef'.hex() -> 'b901ef'.`},index:{$meth:function(m,g,x){let C=this.find$left(m,g,x);if(C===-1)throw new Sk.builtin.ValueError("subsection not found");return new Sk.builtin.int_(C)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.index(sub[, start[, end]]) -> int

Return the lowest index in B where subsection sub is found,
such that sub is contained within B[start,end].  Optional
arguments start and end are interpreted as in slice notation.

Raises ValueError when the subsection is not found.`},isalnum:{$meth:b(k=>_(k)||l(k)||d(k)),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isalnum() -> bool

Return True if all characters in B are alphanumeric
and there is at least one character in B, False otherwise.`},isalpha:{$meth:b(k=>k>=65&&k<=90||k>=97&&k<=122),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isalpha() -> bool

Return True if all characters in B are alphabetic
and there is at least one character in B, False otherwise.`},isascii:{$meth:b(k=>k>=0&&k<=127,!0),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isascii() -> bool

Return True if B is empty or all characters in B are ASCII,
False otherwise.`},isdigit:{$meth:b(_),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isdigit() -> bool

Return True if all characters in B are digits
and there is at least one character in B, False otherwise.`},islower:{$meth:R(l,d),$flags:{NoArgs:!0},$textsig:null,$doc:`B.islower() -> bool

Return True if all cased characters in B are lowercase and there is
at least one cased character in B, False otherwise.`},isspace:{$meth:b(c),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isspace() -> bool

Return True if all characters in B are whitespace
and there is at least one character in B, False otherwise.`},istitle:{$meth:function(){let m=!1,g=!1;for(let x=0;x<this.v.length;x++){let C=this.v[x];if(d(C)){if(m)return Sk.builtin.bool.false$;m=!0,g=!0}else if(l(C)){if(!m)return Sk.builtin.bool.false$;g=!0}else m=!1}return g?Sk.builtin.bool.true$:Sk.builtin.bool.false$},$flags:{NoArgs:!0},$textsig:null,$doc:`B.istitle() -> bool

Return True if B is a titlecased string and there is at least one
character in B, i.e. uppercase characters may only follow uncased
characters and lowercase characters only cased ones. Return False
otherwise.`},isupper:{$meth:R(d,l),$flags:{NoArgs:!0},$textsig:null,$doc:`B.isupper() -> bool

Return True if all cased characters in B are uppercase and there is
at least one cased character in B, False otherwise.`},join:{$meth(k){let m=[],g=0;return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(k),x=>{if(!(x instanceof Sk.builtin.bytes))throw new Sk.builtin.TypeError("sequence item "+g+": expected a bytes-like object, "+Sk.abstr.typeName(x)+" found");g++,m.length&&m.push(...this.v),m.push(...x.v)}),()=>new Sk.builtin.bytes(new Uint8Array(m)))},$flags:{OneArg:!0},$textsig:"($self, iterable_of_bytes, /)",$doc:`Concatenate any number of bytes objects.

The bytes whose method is called is inserted in between each pair.

The result is returned as a new bytes object.

Example: b'.'.join([b'ab', b'pq', b'rs']) -> b'ab.pq.rs'.`},ljust:{$meth:h("ljust",!1,!1),$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:`B.ljust(width[, fillchar]) -> copy of B

Return B left justified in a string of length width. Padding is
done using the specified fill character (default is a space).`},lower:{$meth:f(k=>d(k)?k+32:k),$flags:{NoArgs:!0},$textsig:null,$doc:`B.lower() -> copy of B

Return a copy of B with all ASCII characters converted to lowercase.`},lstrip:{$meth:N(!0,!1),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, bytes=None, /)",$doc:`Strip leading bytes contained in the argument.

If the argument is omitted or None, strip leading  ASCII whitespace.`},partition:{$meth:v(!1),$flags:{OneArg:!0},$textsig:"($self, sep, /)",$doc:`Partition the bytes into three parts using the given separator.

This will search for the separator sep in the bytes. If the separator is found,
returns a 3-tuple containing the part before the separator, the separator
itself, and the part after it.

If the separator is not found, returns a 3-tuple containing the original bytes
object and two empty bytes objects.`},replace:{$meth(k,m,g){k=this.get$raw(k),m=this.get$raw(m),g=g===void 0?-1:Sk.misceval.asIndexSized(g,Sk.builtin.OverflowError),g=g<0?1/0:g;let x=[],C=0,L=0;for(;L<this.v.length&&C<g;){let P=this.find$subleft(k,L,this.v.length);if(P===-1)break;for(let J=L;J<P;J++)x.push(this.v[J]);x.push(...m),L=P+k.length,C++}for(L;L<this.v.length;L++)x.push(this.v[L]);return new Sk.builtin.bytes(new Uint8Array(x))},$flags:{MinArgs:2,MaxArgs:3},$textsig:"($self, old, new, count=-1, /)",$doc:`Return a copy with all occurrences of substring old replaced by new.

  count
    Maximum number of occurrences to replace.
    -1 (the default value) means replace all occurrences.

If the optional argument count is given, only the first count occurrences are
replaced.`},rfind:{$meth(k,m,g){return new Sk.builtin.int_(this.find$right(k,m,g))},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.rfind(sub[, start[, end]]) -> int

Return the highest index in B where subsection sub is found,
such that sub is contained within B[start,end].  Optional
arguments start and end are interpreted as in slice notation.

Return -1 on failure.`},rindex:{$meth:function(m,g,x){let C=this.find$right(m,g,x);if(C===-1)throw new Sk.builtin.ValueError("subsection not found");return new Sk.builtin.int_(C)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.rindex(sub[, start[, end]]) -> int

Return the highest index in B where subsection sub is found,
such that sub is contained within B[start,end].  Optional
arguments start and end are interpreted as in slice notation.

Raise ValueError when the subsection is not found.`},rjust:{$meth:h("rjust",!0,!1),$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:`B.rjust(width[, fillchar]) -> copy of B

Return B right justified in a string of length width. Padding is
done using the specified fill character (default is a space)`},rpartition:{$meth:v(!0),$flags:{OneArg:!0},$textsig:"($self, sep, /)",$doc:`Partition the bytes into three parts using the given separator.

This will search for the separator sep in the bytes, starting at the end. If
the separator is found, returns a 3-tuple containing the part before the
separator, the separator itself, and the part after it.

If the separator is not found, returns a 3-tuple containing two empty bytes
objects and the original bytes object.`},rsplit:{$meth:function(m,g){({sep:m,maxsplit:g}=this.get$splitArgs(m,g));let x=[],C=0,L=this.v.length;if(m!==null){for(;L>=0&&C<g;){let P=this.find$subright(m,0,L);if(P===-1)break;x.push(new Sk.builtin.bytes(this.v.subarray(P+m.length,L))),L=P,C++}x.push(new Sk.builtin.bytes(this.v.subarray(0,L)))}else{for(L--;C<g;){for(;c(this.v[L]);)L--;if(L<0)break;let P=L+1;for(L--;L>=0&&!c(this.v[L]);)L--;x.push(new Sk.builtin.bytes(this.v.subarray(L+1,P))),C++}if(L>=0){for(;c(this.v[L]);)L--;L>=0&&x.push(new Sk.builtin.bytes(this.v.subarray(0,L+1)))}}return new Sk.builtin.list(x.reverse())},$flags:{NamedArgs:["sep","maxsplit"],Defaults:[Sk.builtin.none.none$,-1]},$textsig:"($self, /, sep=None, maxsplit=-1)",$doc:`Return a list of the sections in the bytes, using sep as the delimiter.

  sep
    The delimiter according which to split the bytes.
    None (the default value) means split on ASCII whitespace characters
    (space, tab, return, newline, formfeed, vertical tab).
  maxsplit
    Maximum number of splits to do.
    -1 (the default value) means no limit.

Splitting is done starting at the end of the bytes and working to the front.`},rstrip:{$meth:N(!1,!0),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, bytes=None, /)",$doc:`Strip trailing bytes contained in the argument.

If the argument is omitted or None, strip trailing ASCII whitespace.`},split:{$meth:function(m,g){({sep:m,maxsplit:g}=this.get$splitArgs(m,g));let x=[],C=this.v.length,L=0,P=0;if(m!==null){for(;P<C&&L<g;){let J=this.find$subleft(m,P,C);if(J===-1)break;x.push(new Sk.builtin.bytes(this.v.subarray(P,J))),P=J+m.length,L++}x.push(new Sk.builtin.bytes(this.v.subarray(P,C)))}else{for(;L<g;){for(;c(this.v[P]);)P++;if(P===C)break;let J=P;for(P++;P<C&&!c(this.v[P]);)P++;x.push(new Sk.builtin.bytes(this.v.subarray(J,P))),L++}if(P<C){for(;c(this.v[P]);)P++;P<C&&x.push(new Sk.builtin.bytes(this.v.subarray(P,C)))}}return new Sk.builtin.list(x)},$flags:{NamedArgs:["sep","maxsplit"],Defaults:[Sk.builtin.none.none$,-1]},$textsig:"($self, /, sep=None, maxsplit=-1)",$doc:`Return a list of the sections in the bytes, using sep as the delimiter.

  sep
    The delimiter according which to split the bytes.
    None (the default value) means split on ASCII whitespace characters
    (space, tab, return, newline, formfeed, vertical tab).
  maxsplit
    Maximum number of splits to do.
    -1 (the default value) means no limit.`},splitlines:{$meth(k){k=Sk.misceval.isTrue(k);let m=[],g=0,x,C=0,L=this.v.length;for(;C<L;){let P=this.v[C];if(P===13){let J=this.v[C+1]===10;k?x=J?C+2:C+1:x=C,m.push(new Sk.builtin.bytes(this.v.subarray(g,x))),C=g=J?C+2:C+1}else P===10?(x=k?C+1:C,m.push(new Sk.builtin.bytes(this.v.subarray(g,x))),C=g=C+1):C++}return g<L&&m.push(new Sk.builtin.bytes(this.v.subarray(g,L))),new Sk.builtin.list(m)},$flags:{NamedArgs:["keepends"],Defaults:[!1]},$textsig:"($self, /, keepends=False)",$doc:`Return a list of the lines in the bytes, breaking at line boundaries.

Line breaks are not included in the resulting list unless keepends is given and
true.`},startswith:{$meth:F("startswith",(k,m)=>m.length<=k.length&&m.every((g,x)=>g===k[x])),$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`B.startswith(prefix[, start[, end]]) -> bool

Return True if B starts with the specified prefix, False otherwise.
With optional start, test B beginning at that position.
With optional end, stop comparing B at that position.
prefix can also be a tuple of bytes to try.`},strip:{$meth:N(!0,!0),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, bytes=None, /)",$doc:`Strip leading and trailing bytes contained in the argument.

If the argument is omitted or None, strip leading and trailing ASCII whitespace.`},swapcase:{$meth:f(k=>d(k)?k+32:l(k)?k-32:k),$flags:{NoArgs:!0},$textsig:null,$doc:`B.swapcase() -> copy of B

Return a copy of B with uppercase ASCII characters converted
to lowercase ASCII and vice versa.`},title:{$meth(){let k=this.v.length,m=new Uint8Array(k),g=!1;for(let x=0;x<k;x++){let C=this.v[x];d(C)?(m[x]=g?C+32:C,g=!0):l(C)?(m[x]=g?C:C-32,g=!0):(m[x]=C,g=!1)}return new Sk.builtin.bytes(m)},$flags:{NoArgs:!0},$textsig:null,$doc:`B.title() -> copy of B

Return a titlecased version of B, i.e. ASCII words start with uppercase
characters, all remaining cased characters have lowercase.`},upper:{$meth:f(k=>l(k)?k-32:k),$flags:{NoArgs:!0},$textsig:null,$doc:`B.upper() -> copy of B

Return a copy of B with all ASCII characters converted to uppercase.`},zfill:{$meth(k){k=Sk.misceval.asIndexSized(k,Sk.builtin.IndexError);let m=k-this.v.length;if(m<=0)return new Sk.builtin.bytes(this.v);let g=new Uint8Array(k),x=0,C;for((this.v[0]===43||this.v[0]===45)&&(g[0]=this.v[0],x++),g.fill(48,x,x+m),C=x,x=x+m;x<k;x++,C++)g[x]=this.v[C];return new Sk.builtin.bytes(g)},$flags:{OneArg:!0},$textsig:null,$doc:`B.zfill(width) -> copy of B

Pad a numeric string B with zeros on the left, to fill a field
of the specified width.  B is never truncated.`}},classmethods:{fromhex:{$meth:function(m){if(!Sk.builtin.checkString(m))throw new Sk.builtin.TypeError("fromhex() argument must be str, not "+Sk.abstr.typeName(m));m=m.$jsstr();let g=/\s+/g,x=/^[abcdefABCDEF0123456789]{2}$/,C=[],L=0;function P(K){for(let j=L;j<K;j+=2){let V=m.substr(j,2);if(!x.test(V))throw new Sk.builtin.ValueError("non-hexadecimal number found in fromhex() arg at position "+(j+1));C.push(parseInt(V,16))}}let J;for(;(J=g.exec(m))!==null;)P(J.index),L=g.lastIndex;return P(m.length),new this(C)},$flags:{OneArg:!0},$textsig:"($type, string, /)",$doc:`Create a bytes object from a string of hexadecimal numbers.

Spaces between two numbers are accepted.
Example: bytes.fromhex('B9 01EF') -> b'\\\\xb9\\\\x01\\\\xef'.`}}});function w(k,m,g){if(m===void 0)m="utf-8";else if(Sk.builtin.checkString(m))m=m.$jsstr();else throw new Sk.builtin.TypeError(k+"() argument "+("bytesstr".includes(k)?2:1)+" must be str not "+Sk.abstr.typeName(m));if(g===void 0)g="strict";else if(Sk.builtin.checkString(g))g=g.$jsstr();else throw new Sk.builtin.TypeError(k+"() argument "+("bytesstr".includes(k)?3:2)+" must be str not "+Sk.abstr.typeName(g));return{encoding:m,errors:g}}function T(k,m,g){let x=k.$jsstr();if(m=r(m),!(g==="strict"||g==="ignore"||g==="replace"))throw new Sk.builtin.NotImplementedError("'"+g+"' error handling not implemented in Skulpt");let C;if(m==="ascii")C=A(x,g);else if(m==="utf-8")C=o.encode(x);else throw new Sk.builtin.LookupError("unknown encoding: "+m);return new Sk.builtin.bytes(C)}function A(k,m){let g=[];for(let x in k){let C=k.charCodeAt(x);if(C>127)if(m==="strict"){let L=S(C);throw new Sk.builtin.UnicodeEncodeError("'ascii' codec can't encode character '"+L+"' in position "+x+": ordinal not in range(128)")}else m==="replace"&&g.push(63);else g.push(C)}return new Uint8Array(g)}function S(k){var m;return k<=265?m="\\x":m="\\u",k=k.toString(16),k.length===3&&(k=k.slice(1,3)),k.length===1?k=m+"0"+k:k=m+k,k}function O(k,m){let g="";for(let x=0;x<k.length;x++){let C=k[x];if(C>127){if(m==="strict")throw new Sk.builtin.UnicodeDecodeError("'ascii' codec can't decode byte 0x"+C.toString(16)+" in position "+x+": ordinal not in range(128)");m==="replace"&&(g+="\uFFFD")}else g+=String.fromCharCode(C)}return g}function D(k,m){let g=p.decode(k);if(m==="replace")return g;if(m==="strict"){let x=g.indexOf("\uFFFD");if(x===-1)return g;throw new Sk.builtin.UnicodeDecodeError("'utf-8' codec can't decode byte 0x"+k[x].toString(16)+" in position "+x+": invalid start byte")}return g.replace(/�/g,"")}function B(k,m){if({encoding:k,errors:m}=w("decode",k,m),k=r(k),!(m==="strict"||m==="ignore"||m==="replace"))throw new Sk.builtin.NotImplementedError("'"+m+"' error handling not implemented in Skulpt");let g;if(k==="ascii")g=O(this.v,m);else if(k==="utf-8")g=D(this.v,m);else throw new Sk.builtin.LookupError("unknown encoding: "+k);return new Sk.builtin.str(g)}function F(k,m){return function(g,x,C){if(!(g instanceof Sk.builtin.bytes||g instanceof Sk.builtin.tuple))throw new Sk.builtin.TypeError(k+" first arg must be bytes or a tuple of bytes, not "+Sk.abstr.typeName(g));if({start:x,end:C}=Sk.builtin.slice.startEnd$wrt(this,x,C),C<x)return Sk.builtin.bool.false$;let L=this.v.subarray(x,C);if(g instanceof Sk.builtin.tuple){for(let P=Sk.abstr.iter(g),J=P.tp$iternext();J!==void 0;J=P.tp$iternext())if(J=this.get$raw(J),m(L,J))return Sk.builtin.bool.true$;return Sk.builtin.bool.false$}else return m(L,g.v)?Sk.builtin.bool.true$:Sk.builtin.bool.false$}}function s(k){return function(g,x,C){if(g=this.get$tgt(g),{start:x,end:C}=Sk.builtin.slice.startEnd$wrt(this,x,C),C<x)return-1;let L;return typeof g=="number"?(L=k?this.v.lastIndexOf(g,C-1):this.v.indexOf(g,x),L>=x&&L<C?L:-1):k?this.find$subright(g,x,C):this.find$subleft(g,x,C)}}function v(k){return function(g){g=this.get$raw(g);let x;if(k){if(x=this.find$subright(g,0,this.v.length),x<0)return new Sk.builtin.tuple([new Sk.builtin.bytes,new Sk.builtin.bytes,this])}else if(x=this.find$subleft(g,0,this.v.length),x<0)return new Sk.builtin.tuple([this,new Sk.builtin.bytes,new Sk.builtin.bytes]);return new Sk.builtin.tuple([new Sk.builtin.bytes(this.v.subarray(0,x)),new Sk.builtin.bytes(g),new Sk.builtin.bytes(this.v.subarray(x+g.length))])}}function N(k,m){return function(x){let C;x===void 0||x===Sk.builtin.none.none$?C=new Uint8Array([9,10,11,12,13,32,133]):C=this.get$raw(x);let L=0,P=this.v.length;if(k)for(;L<P&&C.includes(this.v[L]);)L++;if(m)for(;P>L&&C.includes(this.v[P-1]);)P--;let J=new Uint8Array(P-L);for(let K=0;K<J.length;K++)J[K]=this.v[K+L];return new Sk.builtin.bytes(J)}}function h(k,m,g){return function(C,L){if(L===void 0)L=32;else{if(!(L instanceof Sk.builtin.bytes)||L.v.length!=1)throw new Sk.builtin.TypeError(k+"() argument 2 must be a byte string of length 1, not "+Sk.abstr.typeName(L));L=L.v[0]}let P=this.v.length;if(C=Sk.misceval.asIndexSized(C,Sk.builtin.OverflowError),C<=P)return new Sk.builtin.bytes(this.v);let J=new Uint8Array(C),K,j;g?(K=Math.floor((C-P)/2),j=(C-P)%2?K+1:K):m?(K=C-P,j=0):(K=0,j=C-P),J.fill(L,0,K);for(let V=0;V<P;V++)J[V+K]=this.v[V];return J.fill(L,C-j),new Sk.builtin.bytes(J)}}function c(k){return k>=9&&k<=13||k===32}function l(k){return k>=97&&k<=122}function d(k){return k>=65&&k<=90}function _(k){return k>=48&&k<=57}function E(k,m){if(m=Sk.misceval.asIndexSized(m,Sk.builtin.OverflowError),m=m<0?1/0:m,k=Sk.builtin.checkNone(k)?null:this.get$raw(k),k!==null&&!k.length)throw new Sk.builtin.ValueError("empty separator");return{sep:k,maxsplit:m}}function b(k,m){return function(){return this.v.length===0?m?Sk.builtin.bool.true$:Sk.builtin.bool.false$:this.v.every(x=>k(x))?Sk.builtin.bool.true$:Sk.builtin.bool.false$}}function R(k,m){return function(){let g=!1;for(let x=0;x<this.v.length;x++){if(m(this.v[x]))return Sk.builtin.bool.false$;!g&&k(this.v[x])&&(g=!0)}return g?Sk.builtin.bool.true$:Sk.builtin.bool.false$}}function f(k){return function(){let g=new Uint8Array(this.v.length);for(let x=0;x<this.v.length;x++)g[x]=k(this.v[x]);return new Sk.builtin.bytes(g)}}var $=Sk.abstr.buildIteratorClass("bytes_iterator",{constructor:function(m){this.$index=0,this.$seq=m.v},iternext(){let k=this.$seq[this.$index++];if(k!==void 0)return new Sk.builtin.int_(k)},methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}});Sk.exportSymbol("Sk.builtin.bytes",Sk.builtin.bytes)}),"./src/check.js":(function(Y,y){Sk.builtin.pyCheckArgs=function(t,n,a,i,r,o){var p=n.length,w="";if(i===void 0&&(i=1/0),r&&(p-=1),o&&(p-=1),p<a||p>i)throw a===i?w=t+"() takes exactly "+a+" arguments":p<a?w=t+"() takes at least "+a+" arguments":a>0?w=t+"() takes at most "+i+" arguments":w=t+"() takes no arguments",w+=" ("+p+" given)",new Sk.builtin.TypeError(w)},Sk.exportSymbol("Sk.builtin.pyCheckArgs",Sk.builtin.pyCheckArgs),Sk.builtin.pyCheckArgsLen=function(t,n,a,i,r,o){var p="";if(i===void 0&&(i=1/0),r&&(n-=1),o&&(n-=1),n<a||n>i)throw a===i?p=t+"() takes exactly "+a+" arguments":n<a?p=t+"() takes at least "+a+" arguments":p=t+"() takes at most "+i+" arguments",p+=" ("+n+" given)",new Sk.builtin.TypeError(p)},Sk.builtin.pyCheckType=function(t,n,a){if(!a)throw new Sk.builtin.TypeError(t+" must be a "+n)},Sk.exportSymbol("Sk.builtin.pyCheckType",Sk.builtin.pyCheckType),Sk.builtin.checkSequence=function(t){return t!=null&&t.mp$subscript!==void 0},Sk.exportSymbol("Sk.builtin.checkSequence",Sk.builtin.checkSequence),Sk.builtin.checkIterable=function(t){return t===void 0?!1:t.tp$iter?t.tp$iter().tp$iternext!==void 0:t.mp$subscript!==void 0},Sk.exportSymbol("Sk.builtin.checkIterable",Sk.builtin.checkIterable),Sk.builtin.checkCallable=function(t){return t!=null&&t.tp$call!==void 0},Sk.builtin.checkNumber=function(t){return typeof t=="number"||t instanceof Sk.builtin.int_||t instanceof Sk.builtin.float_||t instanceof Sk.builtin.lng},Sk.exportSymbol("Sk.builtin.checkNumber",Sk.builtin.checkNumber),Sk.builtin.checkComplex=function(t){return t instanceof Sk.builtin.complex},Sk.exportSymbol("Sk.builtin.checkComplex",Sk.builtin.checkComplex),Sk.builtin.checkInt=function(t){return t instanceof Sk.builtin.int_||typeof t=="number"&&Number.isInteger(t)},Sk.exportSymbol("Sk.builtin.checkInt",Sk.builtin.checkInt),Sk.builtin.checkFloat=function(t){return t instanceof Sk.builtin.float_},Sk.exportSymbol("Sk.builtin.checkFloat",Sk.builtin.checkFloat),Sk.builtin.checkString=function(t){return t instanceof Sk.builtin.str},Sk.exportSymbol("Sk.builtin.checkString",Sk.builtin.checkString),Sk.builtin.checkBytes=function(t){return t instanceof Sk.builtin.bytes},Sk.builtin.checkClass=function(t){return t instanceof Sk.builtin.type},Sk.exportSymbol("Sk.builtin.checkClass",Sk.builtin.checkClass),Sk.builtin.checkBool=function(t){return t instanceof Sk.builtin.bool},Sk.exportSymbol("Sk.builtin.checkBool",Sk.builtin.checkBool),Sk.builtin.checkNone=function(t){return t===Sk.builtin.none.none$},Sk.exportSymbol("Sk.builtin.checkNone",Sk.builtin.checkNone),Sk.builtin.checkFunction=function(t){return t!=null&&t.tp$call!==void 0},Sk.exportSymbol("Sk.builtin.checkFunction",Sk.builtin.checkFunction),Sk.builtin.checkDataDescr=function(t){return t&&t.tp$descr_set!==void 0},Sk.exportSymbol("Sk.builtin.checkDataDescr",Sk.builtin.checkDataDescr),Sk.builtin.checkAnySet=function(t){return t instanceof Sk.builtin.set||t instanceof Sk.builtin.frozenset},Sk.builtin.checkMapping=function(t){return t instanceof Sk.builtin.dict||t instanceof Sk.builtin.mappingproxy||t!=null&&t.mp$subscript!==void 0&&Sk.abstr.lookupSpecial(t,Sk.builtin.str.$keys)!==void 0}}),"./src/compile.js":(function(Y,y){var t;Sk.gensymcount=0;function n(s,v,N,h,c){this.filename=s,this.st=v,this.flags=N,this.canSuspend=h,this.interactive=!1,this.nestlevel=0,this.u=null,this.stack=[],this.result=[],this.allUnits=[],this.source=c?c.split(`
`):!1}function a(){this.ste=null,this.name=null,this.canSuspend=!1,this.doesSuspend=!1,this.private_=null,this.firstlineno=0,this.lineno=0,this.linenoSet=!1,this.localnames=[],this.localtemps=[],this.tempsToSave=[],this.blocknum=0,this.blocks=[],this.curblock=0,this.consts={},this.scopename=null,this.prefixCode="",this.varDeclsCode="",this.switchCode="",this.suffixCode="",this.breakBlocks=[],this.continueBlocks=[],this.exceptBlocks=[],this.finallyBlocks=[]}a.prototype.activateScope=function(){var s=this;t=function(){var v,N=s.blocks[s.curblock];if(N._next===null)for(v=0;v<arguments.length;++v)N.push(arguments[v])}},n.prototype.getSourceLine=function(s){return Sk.asserts.assert(this.source),this.source[s-1]},n.prototype.annotateSource=function(s){var v,N,h;if(this.source){for(h=s.lineno,N=s.col_offset,t(`
//
// line `,h,`:
// `,this.getSourceLine(h),`
// `),v=0;v<N;++v)t(" ");t(`^
//
`),Sk.asserts.assert(s.lineno!==void 0&&s.col_offset!==void 0),t("$currLineNo = ",h,`;
$currColNo = `,N,`;

`)}},n.prototype.gensym=function(s){return s=s||"",s="$"+s,s+=Sk.gensymcount++,s},n.prototype.niceName=function(s){return this.gensym(s.replace("<","").replace(">","").replace(" ","_"))};var i=Sk.builtin.str.reservedWords_;function r(s){return i[s]===void 0?s:s+"_$rw$"}function o(s){return s.replace(/_\$rw\$$/,"")}function p(s,v){var N=v.v,h=null;return s===null||N===null||N.charAt(0)!=="_"||N.charAt(1)!=="_"||N.charAt(N.length-1)==="_"&&N.charAt(N.length-2)==="_"||(h=s.v,h.replace(/_/g,""),h==="")?v:(h=s.v,h.replace(/^_*/,""),h=new Sk.builtin.str("_"+h+N),h)}n.prototype.makeConstant=function(s){var v,N,h="",c;for(v=0;v<arguments.length;++v)h+=arguments[v];for(var l in this.u.consts)if(this.u.consts.hasOwnProperty(l)&&(c=this.u.consts[l],c==h))return l;return N=this.u.scopename+"."+this.gensym("const"),this.u.consts[N]=h,N},n.prototype._gr=function(s,v){var N,h=this.gensym(s);for(this.u.localtemps.push(h),t("var ",h,"="),N=1;N<arguments.length;++N)t(arguments[N]);return t(";"),h},n.prototype.outputInterruptTest=function(){var s="";return(Sk.execLimit!==null||Sk.yieldLimit!==null&&this.u.canSuspend)&&(s+="var $dateNow = Date.now();",Sk.execLimit!==null&&(s+="if ($dateNow - Sk.execStart > Sk.execLimit) {throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg())}"),Sk.yieldLimit!==null&&this.u.canSuspend&&(s+="if ($dateNow - Sk.lastYield > Sk.yieldLimit) {",s+="var $susp = $saveSuspension({data: {type: 'Sk.yield'}, resume: function() {}}, '"+this.filename+"',$currLineNo,$currColNo);",s+="$susp.$blk = $blk;",s+="$susp.optional = true;",s+="return $susp;",s+="}",this.u.doesSuspend=!0)),s},n.prototype._jumpfalse=function(s,v){var N=this._gr("jfalse","(",s,"===false||!Sk.misceval.isTrue(",s,"))");t("if(",N,"){/*test failed */$blk=",v,";continue;}")},n.prototype._jumpundef=function(s,v){t("if(",s,"===undefined){$blk=",v,";continue;}")},n.prototype._jumpnotundef=function(s,v){t("if(",s,"!==undefined){$blk=",v,";continue;}")},n.prototype._jumptrue=function(s,v){var N=this._gr("jtrue","(",s,"===true||Sk.misceval.isTrue(",s,"))");t("if(",N,"){/*test passed */$blk=",v,";continue;}")},n.prototype._jump=function(s){this.u.blocks[this.u.curblock]._next===null&&(t("$blk=",s,";"),this.u.blocks[this.u.curblock]._next=s)},n.prototype._checkSuspension=function(s){var v;this.u.canSuspend?(v=this.newBlock("function return or resume suspension"),this._jump(v),this.setBlock(v),s=s||{lineno:"$currLineNo",col_offset:"$currColNo"},t("if ($ret && $ret.$isSuspension) { return $saveSuspension($ret,'"+this.filename+"',"+s.lineno+","+s.col_offset+"); }"),this.u.doesSuspend=!0,this.u.tempsToSave=this.u.tempsToSave.concat(this.u.localtemps)):t("if ($ret && $ret.$isSuspension) { $ret = Sk.misceval.retryOptionalSuspensionOrThrow($ret); }")},n.prototype.cunpackstarstoarray=function(s,v){if(!s||s.length==0)return"[]";let N=!1;for(let h of s){if(v&&N)throw new Sk.builtin.SyntaxError("Extended argument unpacking is not permitted in Python 2");h.constructor===Sk.astnodes.Starred&&(N=!0)}if(N){let h=this._gr("unpack","[]");for(let c of s)c.constructor!==Sk.astnodes.Starred?t(h,".push(",this.vexpr(c),");"):(t("$ret = Sk.misceval.iterFor(Sk.abstr.iter(",this.vexpr(c.value),"), function(e) { ",h,".push(e); });"),this._checkSuspension());return h}else return"["+s.map(h=>this.vexpr(h)).join(",")+"]"},n.prototype.ctuplelistorset=function(s,v,N){var h,c,l,d;Sk.asserts.assert(N==="tuple"||N==="list"||N==="set");let _=!1,E;for(h=0;h<s.elts.length;h++)if(s.elts[h].constructor===Sk.astnodes.Starred){_=!0,E=h;break}if(s.ctx===Sk.astnodes.Store){if(_){if(!Sk.__future__.python3)throw new Sk.builtin.SyntaxError("assignment unpacking with stars is not supported in Python 2",this.filename,s.lineno);for(h=E+1;h<s.elts.length;h++)if(s.elts[h].constructor===Sk.astnodes.Starred)throw new Sk.builtin.SyntaxError("multiple starred expressions in assignment",this.filename,s.lineno)}let b=_?E:s.elts.length,R=_?s.elts.length-1:b;for(t("$ret = Sk.abstr.sequenceUnpack("+v+","+b+","+R+", "+_+");"),this._checkSuspension(),c=this._gr("items","$ret"),h=0;h<s.elts.length;++h)h===E?this.vexpr(s.elts[h].value,c+"["+h+"]"):this.vexpr(s.elts[h],c+"["+h+"]")}else if(s.ctx===Sk.astnodes.Load||N==="set")if(_){if(!Sk.__future__.python3)throw new Sk.builtin.SyntaxError("List packing with stars is not supported in Python 2");return this._gr("load"+N,"new Sk.builtins['",N,"'](",this.cunpackstarstoarray(s.elts),")")}else if(N==="tuple"){for(d=!0,c=[],h=0;h<s.elts.length;++h)l=this.vexpr(s.elts[h]),d&&l.indexOf("$const")==-1&&(d=!1),c.push(l);if(d)return this.makeConstant("new Sk.builtin.tuple(["+c+"])");for(h=0;h<c.length;++h)c[h]=this._gr("elem",c[h]);return this._gr("load"+N,"new Sk.builtins['",N,"']([",c,"])")}else{for(c=[],h=0;h<s.elts.length;++h)c.push(this._gr("elem",this.vexpr(s.elts[h])));return this._gr("load"+N,"new Sk.builtins['",N,"']([",c,"])")}},n.prototype.cdict=function(s){var v,N,h;if(h=[],s.keys!==null)for(Sk.asserts.assert(s.values.length===s.keys.length),N=0;N<s.values.length;++N)v=this.vexpr(s.values[N]),h.push(this.vexpr(s.keys[N])),h.push(v);return this._gr("loaddict","new Sk.builtins['dict']([",h,"])")},n.prototype.clistcomp=function(s){Sk.asserts.assert(s instanceof Sk.astnodes.ListComp);var v=this._gr("_compr","new Sk.builtins['list']([])");return this.ccompgen("list",v,s.generators,0,s.elt,null,s)},n.prototype.cdictcomp=function(s){Sk.asserts.assert(s instanceof Sk.astnodes.DictComp);var v=this._gr("_dcompr","new Sk.builtins.dict([])");return this.ccompgen("dict",v,s.generators,0,s.value,s.key,s)},n.prototype.csetcomp=function(s){Sk.asserts.assert(s instanceof Sk.astnodes.SetComp);var v=this._gr("_setcompr","new Sk.builtins.set([])");return this.ccompgen("set",v,s.generators,0,s.elt,null,s)},n.prototype.ccompgen=function(s,v,N,h,c,l,d){var _=this.newBlock(s+" comp start"),E=this.newBlock(s+" comp skip"),b=this.newBlock(s+" comp anchor"),R=N[h],f=this.vexpr(R.iter),$=this._gr("iter","Sk.abstr.iter(",f,")"),k,m,g,x,C,L,P;for(this._jump(_),this.setBlock(_),t("$ret = Sk.abstr.iternext(",$,", true);"),this._checkSuspension(d),L=this._gr("next","$ret"),this._jumpundef(L,b),C=this.vexpr(R.target,L),P=R.ifs?R.ifs.length:0,x=0;x<P;++x)g=this.vexpr(R.ifs[x]),this._jumpfalse(g,_);return++h<N.length&&this.ccompgen(s,v,N,h,c,l,d),h>=N.length&&(k=this.vexpr(c),s==="dict"?(m=this.vexpr(l),t(v,".mp$ass_subscript(",m,",",k,");")):s==="list"?t(v,".v.push(",k,");"):s==="set"&&t(v,".v.mp$ass_subscript(",k,", true);"),this._jump(E),this.setBlock(E)),this._jump(_),this.setBlock(b),v},n.prototype.cyield=function(s){if(this.u.ste.blockType!==Sk.SYMTAB_CONSTS.FunctionBlock)throw new Sk.builtin.SyntaxError("'yield' outside function",this.filename,s.lineno);var v="Sk.builtin.none.none$",N;return s.value&&(v=this.vexpr(s.value)),N=this.newBlock("after yield"),t("return [/*resume*/",N,",/*ret*/",v,"];"),this.setBlock(N),"$gen.gi$sentvalue"},n.prototype.ccompare=function(s){var v,N,h,c,l,d,_;for(Sk.asserts.assert(s.ops.length===s.comparators.length),_=this.vexpr(s.left),d=s.ops.length,l=this.newBlock("done"),c=this._gr("compareres","null"),h=0;h<d;++h)N=this.vexpr(s.comparators[h]),t("$ret = Sk.builtin.bool(Sk.misceval.richCompareBool(",_,",",N,",'",s.ops[h].prototype._astname,"', true));"),this._checkSuspension(s),t(c,"=$ret;"),this._jumpfalse("$ret",l),_=N;return this._jump(l),this.setBlock(l),c},n.prototype.ccall=function(s){var v=this.vexpr(s.func),N=null;let h=this.cunpackstarstoarray(s.args,!Sk.__future__.python3),c="undefined";if(s.keywords&&s.keywords.length>0){let l=!1;N=[];for(let d of s.keywords){if(l&&!Sk.__future__.python3)throw new SyntaxError("Advanced unpacking of function arguments is not supported in Python 2");d.arg?(N.push("'"+d.arg.v+"'"),N.push(this.vexpr(d.value))):l=!0}if(c="["+N.join(",")+"]",l){c=this._gr("keywordArgs",c);for(let d of s.keywords)d.arg||(t("$ret = Sk.abstr.mappingUnpackIntoKeywordArray(",c,",",this.vexpr(d.value),",",v,");"),this._checkSuspension())}}return Sk.__future__.super_args&&s.func.id&&s.func.id.v==="super"&&h==="[]"&&(t('if (typeof self === "undefined" || self.toString().indexOf("Window") > 0) { throw new Sk.builtin.RuntimeError("super(): no arguments") };'),h="[$gbl.__class__,self]"),t("$ret = (",v,".tp$call)?",v,".tp$call(",h,",",c,") : Sk.misceval.applyOrSuspend(",v,",undefined,undefined,",c,",",h,");"),this._checkSuspension(s),this._gr("call","$ret")},n.prototype.cslice=function(s){var v,N,h;return Sk.asserts.assert(s instanceof Sk.astnodes.Slice),Sk.__future__.python3?(h=s.lower?this.vexpr(s.lower):"Sk.builtin.none.none$",N=s.upper?this.vexpr(s.upper):"Sk.builtin.none.none$",v=s.step?this.vexpr(s.step):"Sk.builtin.none.none$"):(h=s.lower?this.vexpr(s.lower):s.step?"Sk.builtin.none.none$":"new Sk.builtin.int_(0)",N=s.upper?this.vexpr(s.upper):s.step?"Sk.builtin.none.none$":"new Sk.builtin.int_(2147483647)",v=s.step?this.vexpr(s.step):"Sk.builtin.none.none$"),this._gr("slice","new Sk.builtins['slice'](",h,",",N,",",v,")")},n.prototype.eslice=function(s){var v,N,h;for(Sk.asserts.assert(s instanceof Array),N=[],v=0;v<s.length;v++)N.push(this.vslicesub(s[v]));return this._gr("extslice","new Sk.builtins['tuple']([",N,"])")},n.prototype.vslicesub=function(s){var v;switch(s.constructor){case Sk.astnodes.Index:v=this.vexpr(s.value);break;case Sk.astnodes.Slice:v=this.cslice(s);break;case Sk.astnodes.Ellipsis:Sk.asserts.fail("todo compile.js Ellipsis;");break;case Sk.astnodes.ExtSlice:v=this.eslice(s.dims);break;default:Sk.asserts.fail("invalid subscript kind")}return v},n.prototype.vslice=function(s,v,N,h){var c=this.vslicesub(s);return this.chandlesubscr(v,N,c,h)},n.prototype.chandlesubscr=function(s,v,N,h){if(s===Sk.astnodes.Load||s===Sk.astnodes.AugLoad)return t("$ret = Sk.abstr.objectGetItem(",v,",",N,", true);"),this._checkSuspension(),this._gr("lsubscr","$ret");s===Sk.astnodes.Store||s===Sk.astnodes.AugStore?(t("$ret = Sk.abstr.objectSetItem(",v,",",N,",",h,", true);"),this._checkSuspension()):s===Sk.astnodes.Del?t("Sk.abstr.objectDelItem(",v,",",N,");"):Sk.asserts.fail("handlesubscr fail")},n.prototype.cboolop=function(s){var v,N,h,c,l,d,_,E;for(Sk.asserts.assert(s instanceof Sk.astnodes.BoolOp),s.op===Sk.astnodes.And?E=this._jumpfalse:E=this._jumptrue,d=this.newBlock("end of boolop"),l=s.values,c=l.length,N=0;N<c;++N)v=this.vexpr(l[N]),N===0&&(h=this._gr("boolopsucc",v)),t(h,"=",v,";"),E.call(this,v,d);return this._jump(d),this.setBlock(d),h},n.prototype.cjoinedstr=function(s){let v;Sk.asserts.assert(s instanceof Sk.astnodes.JoinedStr);for(let N of s.values){let h=this.vexpr(N);v?t(v,"=",v,".sq$concat(",h,");"):v=this._gr("joinedstr",h)}return v||(v="Sk.builtin.str.$emptystr"),v},n.prototype.cformattedvalue=function(s){let v=this.vexpr(s.value);switch(s.conversion){case"s":v=this._gr("value","new Sk.builtin.str(",v,")");break;case"a":v=this._gr("value","Sk.builtin.ascii(",v,")");break;case"r":v=this._gr("value","Sk.builtin.repr(",v,")");break}let N=s.format_spec?this.vexpr(s.format_spec):"Sk.builtin.str.$emptystr";return this._gr("formatted","Sk.abstr.objectFormat("+v+","+N+")")};function w(s){let v='"';for(let N=0;N<s.length;N++){let h=s.charCodeAt(N);h==10?v+="\\n":h==92?v+="\\\\":h==34||h<32||h>=127&&h<256?v+="\\x"+("0"+h.toString(16)).substr(-2):h>=256?v+="\\u"+("000"+h.toString(16)).substr(-4):v+=s.charAt(N)}return v+='"',v}n.prototype.vexpr=function(s,v,N,h){var c,l,d,_,E;switch(s.lineno>this.u.lineno&&(this.u.lineno=s.lineno,this.u.linenoSet=!1),s.constructor){case Sk.astnodes.BoolOp:return this.cboolop(s);case Sk.astnodes.BinOp:return this._gr("binop","Sk.abstr.numberBinOp(",this.vexpr(s.left),",",this.vexpr(s.right),",'",s.op.prototype._astname,"')");case Sk.astnodes.UnaryOp:return this._gr("unaryop","Sk.abstr.numberUnaryOp(",this.vexpr(s.operand),",'",s.op.prototype._astname,"')");case Sk.astnodes.Lambda:return this.clambda(s);case Sk.astnodes.IfExp:return this.cifexp(s);case Sk.astnodes.Dict:return this.cdict(s);case Sk.astnodes.ListComp:return this.clistcomp(s);case Sk.astnodes.DictComp:return this.cdictcomp(s);case Sk.astnodes.SetComp:return this.csetcomp(s);case Sk.astnodes.GeneratorExp:return this.cgenexp(s);case Sk.astnodes.Yield:return this.cyield(s);case Sk.astnodes.Compare:return this.ccompare(s);case Sk.astnodes.Call:return _=this.ccall(s),this.annotateSource(s),_;case Sk.astnodes.Num:if(typeof s.n=="number")return s.n;if(s.n instanceof Sk.builtin.lng)return this.makeConstant("new Sk.builtin.lng('"+s.n.v.toString()+"')");if(s.n instanceof Sk.builtin.int_)return typeof s.n.v=="number"?this.makeConstant("new Sk.builtin.int_("+s.n.v+")"):this.makeConstant("new Sk.builtin.int_('"+s.n.v.toString()+"')");if(s.n instanceof Sk.builtin.float_)return E=s.n.v===0&&1/s.n.v===-1/0?"-0":s.n.v,this.makeConstant("new Sk.builtin.float_("+E+")");if(s.n instanceof Sk.builtin.complex){var b=s.n.real===0&&1/s.n.real===-1/0?"-0":s.n.real,R=s.n.imag===0&&1/s.n.imag===-1/0?"-0":s.n.imag;return this.makeConstant("new Sk.builtin.complex("+b+", "+R+")")}Sk.asserts.fail("unhandled Num type");case Sk.astnodes.Bytes:if(Sk.__future__.python3){let f=[],$=s.s.$jsstr();for(let k=0;k<$.length;k++)f.push($.charCodeAt(k));return this.makeConstant("new Sk.builtin.bytes([",f.join(", "),"])")}case Sk.astnodes.Str:return this.makeConstant("new Sk.builtin.str(",w(s.s.$jsstr()),")");case Sk.astnodes.Attribute:switch(s.ctx!==Sk.astnodes.AugLoad&&s.ctx!==Sk.astnodes.AugStore&&(d=this.vexpr(s.value)),c=s.attr.$r().v,c=c.substring(1,c.length-1),c=p(this.u.private_,new Sk.builtin.str(c)).v,l=this.makeConstant("new Sk.builtin.str('"+c+"')"),s.ctx){case Sk.astnodes.AugLoad:return t("$ret = ",N,".tp$getattr(",l,", true);"),this._checkSuspension(s),t(`
if ($ret === undefined) {`),t(`
throw new Sk.builtin.AttributeError(`,N,`.sk$attrError() + " has no attribute '" + `,l,`.$jsstr() + "'");`),t(`
};`),this._gr("lattr","$ret");case Sk.astnodes.Load:return t("$ret = ",d,".tp$getattr(",l,", true);"),this._checkSuspension(s),t(`
if ($ret === undefined) {`),t(`
throw new Sk.builtin.AttributeError(`,d,`.sk$attrError() + " has no attribute '" + `,l,`.$jsstr() + "'");`),t(`
};`),this._gr("lattr","$ret");case Sk.astnodes.AugStore:t("$ret = undefined;"),t("if(",v,"!==undefined){"),t("$ret = ",N,".tp$setattr(",l,",",v,", true);"),t("}"),this._checkSuspension(s);break;case Sk.astnodes.Store:t("$ret = ",d,".tp$setattr(",l,",",v,", true);"),this._checkSuspension(s);break;case Sk.astnodes.Del:t("$ret = ",d,".tp$setattr(",l,", undefined, true);"),this._checkSuspension(s);break;case Sk.astnodes.Param:default:Sk.asserts.fail("invalid attribute expression")}break;case Sk.astnodes.Subscript:switch(s.ctx){case Sk.astnodes.AugLoad:return t("$ret = Sk.abstr.objectGetItem(",N,",",h,", true);"),this._checkSuspension(s),this._gr("gitem","$ret");case Sk.astnodes.Load:case Sk.astnodes.Store:case Sk.astnodes.Del:return this.vslice(s.slice,s.ctx,this.vexpr(s.value),v);case Sk.astnodes.AugStore:t("$ret=undefined;"),t("if(",v,"!==undefined){"),t("$ret=Sk.abstr.objectSetItem(",N,",",h,",",v,", true)"),t("}"),this._checkSuspension(s);break;case Sk.astnodes.Param:default:Sk.asserts.fail("invalid subscript expression")}break;case Sk.astnodes.Name:return this.nameop(s.id,s.ctx,v);case Sk.astnodes.NameConstant:if(s.ctx===Sk.astnodes.Store||s.ctx===Sk.astnodes.AugStore||s.ctx===Sk.astnodes.Del)throw new Sk.builtin.SyntaxError("can not assign to a constant name");switch(s.value){case Sk.builtin.none.none$:return"Sk.builtin.none.none$";case Sk.builtin.bool.true$:return"Sk.builtin.bool.true$";case Sk.builtin.bool.false$:return"Sk.builtin.bool.false$";default:Sk.asserts.fail("invalid named constant")}break;case Sk.astnodes.List:return this.ctuplelistorset(s,v,"list");case Sk.astnodes.Tuple:return this.ctuplelistorset(s,v,"tuple");case Sk.astnodes.Set:return this.ctuplelistorset(s,v,"set");case Sk.astnodes.Starred:throw s.ctx===Sk.astnodes.Store?new Sk.builtin.SyntaxError("starred assignment target must be in a list or tuple",this.filename,s.lineno):new Sk.builtin.SyntaxError("can't use starred expression here",this.filename,s.lineno);case Sk.astnodes.JoinedStr:return this.cjoinedstr(s);case Sk.astnodes.FormattedValue:return this.cformattedvalue(s);default:Sk.asserts.fail("unhandled case "+s.constructor.name+" vexpr")}},n.prototype.vseqexpr=function(s,v){var N,h;for(Sk.asserts.assert(v===void 0||s.length===v.length),h=[],N=0;N<s.length;++N)h.push(this.vexpr(s[N],v===void 0?void 0:v[N]));return h},n.prototype.caugassign=function(s){var v,N,h,c,l,d,_;switch(Sk.asserts.assert(s instanceof Sk.astnodes.AugAssign),_=s.target,_.constructor){case Sk.astnodes.Attribute:return v=this.vexpr(_.value),d=new Sk.astnodes.Attribute(_.value,_.attr,Sk.astnodes.AugLoad,_.lineno,_.col_offset),l=this.vexpr(d,void 0,v),c=this.vexpr(s.value),h=this._gr("inplbinopattr","Sk.abstr.numberInplaceBinOp(",l,",",c,",'",s.op.prototype._astname,"')"),d.ctx=Sk.astnodes.AugStore,this.vexpr(d,h,v);case Sk.astnodes.Subscript:return v=this.vexpr(_.value),N=this.vslicesub(_.slice),d=new Sk.astnodes.Subscript(_.value,N,Sk.astnodes.AugLoad,_.lineno,_.col_offset),l=this.vexpr(d,void 0,v,N),c=this.vexpr(s.value),h=this._gr("inplbinopsubscr","Sk.abstr.numberInplaceBinOp(",l,",",c,",'",s.op.prototype._astname,"')"),d.ctx=Sk.astnodes.AugStore,this.vexpr(d,h,v,N);case Sk.astnodes.Name:return v=this.nameop(_.id,Sk.astnodes.Load),c=this.vexpr(s.value),h=this._gr("inplbinop","Sk.abstr.numberInplaceBinOp(",v,",",c,",'",s.op.prototype._astname,"')"),this.nameop(_.id,Sk.astnodes.Store,h);default:Sk.asserts.fail("unhandled case in augassign")}},n.prototype.exprConstant=function(s){switch(s.constructor){case Sk.astnodes.Num:return Sk.misceval.isTrue(s.n)?1:0;case Sk.astnodes.Str:return Sk.misceval.isTrue(s.s)?1:0;case Sk.astnodes.Name:default:return-1}},n.prototype.newBlock=function(s){var v=this.u.blocknum++;return this.u.blocks[v]=[],this.u.blocks[v]._name=s||"<unnamed>",this.u.blocks[v]._next=null,v},n.prototype.setBlock=function(s){Sk.asserts.assert(s>=0&&s<this.u.blocknum),this.u.curblock=s},n.prototype.pushBreakBlock=function(s){Sk.asserts.assert(s>=0&&s<this.u.blocknum),this.u.breakBlocks.push(s)},n.prototype.popBreakBlock=function(){this.u.breakBlocks.pop()},n.prototype.pushContinueBlock=function(s){Sk.asserts.assert(s>=0&&s<this.u.blocknum),this.u.continueBlocks.push(s)},n.prototype.popContinueBlock=function(){this.u.continueBlocks.pop()},n.prototype.pushExceptBlock=function(s){Sk.asserts.assert(s>=0&&s<this.u.blocknum),this.u.exceptBlocks.push(s)},n.prototype.popExceptBlock=function(){this.u.exceptBlocks.pop()},n.prototype.pushFinallyBlock=function(s){Sk.asserts.assert(s>=0&&s<this.u.blocknum),Sk.asserts.assert(this.u.breakBlocks.length===this.u.continueBlocks.length),this.u.finallyBlocks.push({blk:s,breakDepth:this.u.breakBlocks.length})},n.prototype.popFinallyBlock=function(){this.u.finallyBlocks.pop()},n.prototype.peekFinallyBlock=function(){return this.u.finallyBlocks.length>0?this.u.finallyBlocks[this.u.finallyBlocks.length-1]:void 0},n.prototype.setupExcept=function(s){t("$exc.push(",s,");")},n.prototype.endExcept=function(){t("$exc.pop();")},n.prototype.outputLocals=function(s){var v,N,h,c={};for(h=0;s.argnames&&h<s.argnames.length;++h)c[s.argnames[h]]=!0;for(s.localnames.sort(),N=[],h=0;h<s.localnames.length;++h)v=s.localnames[h],c[v]===void 0&&(N.push(v),c[v]=!0);return N.length>0?"var "+N.join(",")+"; /* locals */":""},n.prototype.outputSuspensionHelpers=function(s){var v,N,h=[],c=s.localnames.concat(s.tempsToSave),l={},d=s.ste.blockType===Sk.SYMTAB_CONSTS.FunctionBlock&&s.ste.childHasFree,_=(c.length>0?"var "+c.join(",")+";":"")+"var $wakeFromSuspension = function() {var susp = "+s.scopename+".$wakingSuspension; "+s.scopename+".$wakingSuspension = undefined;$blk=susp.$blk; $loc=susp.$loc; $gbl=susp.$gbl; $exc=susp.$exc; $err=susp.$err; $postfinally=susp.$postfinally;$currLineNo=susp.$lineno; $currColNo=susp.$colno; Sk.lastYield=Date.now();"+(d?"$cell=susp.$cell;":"");for(v=0;v<c.length;v++)N=c[v],l[N]===void 0&&(_+=N+"=susp.$tmps."+N+";",l[N]=!0);for(_+="try { $ret=susp.child.resume(); } catch(err) { if (!(err instanceof Sk.builtin.BaseException)) { err = new Sk.builtin.ExternalError(err); } err.traceback.push({lineno: $currLineNo, colno: $currColNo, filename: '"+this.filename+"'}); if($exc.length>0) { $err=err; $blk=$exc.pop(); } else { throw err; } }};",_+="var $saveSuspension = function($child, $filename, $lineno, $colno) {var susp = new Sk.misceval.Suspension(); susp.child=$child;susp.resume=function(){"+s.scopename+".$wakingSuspension=susp; return "+s.scopename+"("+(s.ste.generator?"$gen":"")+"); };susp.data=susp.child.data;susp.$blk=$blk;susp.$loc=$loc;susp.$gbl=$gbl;susp.$exc=$exc;susp.$err=$err;susp.$postfinally=$postfinally;susp.$filename=$filename;susp.$lineno=$lineno;susp.$colno=$colno;susp.optional=susp.child.optional;"+(d?"susp.$cell=$cell;":""),l={},v=0;v<c.length;v++)N=c[v],l[N]===void 0&&(h.push('"'+N+'":'+N),l[N]=!0);return _+="susp.$tmps={"+h.join(",")+"};return susp;};",_},n.prototype.outputAllUnits=function(){var s,v,N,h,c="",l,d;for(h=0;h<this.allUnits.length;++h){for(N=this.allUnits[h],c+=N.prefixCode,c+=this.outputLocals(N),N.doesSuspend&&(c+=this.outputSuspensionHelpers(N)),c+=N.varDeclsCode,c+=N.switchCode,v=N.blocks,d=Object.create(null),s=0;s<v.length;++s)if(l=s,!(l in d))for(;;)if(d[l]=!0,c+="case "+l+": /* --- "+v[l]._name+" --- */",c+=v[l].join(""),v[l]._next!==null)if(!(v[l]._next in d))c+="/* allowing case fallthrough */",l=v[l]._next;else{c+="/* jump */ continue;";break}else{c+="throw new Sk.builtin.SystemError('internal error: unterminated block');";break}c+=N.suffixCode}return c},n.prototype.cif=function(s){var v,N,h,c;Sk.asserts.assert(s instanceof Sk.astnodes.If),c=this.exprConstant(s.test),c===0?s.orelse&&s.orelse.length>0&&this.vseqstmt(s.orelse):c===1?this.vseqstmt(s.body):(h=this.newBlock("end of if"),s.orelse&&s.orelse.length>0&&(N=this.newBlock("next branch of if")),v=this.vexpr(s.test),s.orelse&&s.orelse.length>0?(this._jumpfalse(v,N),this.vseqstmt(s.body),this._jump(h),this.setBlock(N),this.vseqstmt(s.orelse)):(this._jumpfalse(v,h),this.vseqstmt(s.body)),this._jump(h),this.setBlock(h))},n.prototype.cwhile=function(s){var v,N,h,c,l=this.exprConstant(s.test);if(l===0)s.orelse&&this.vseqstmt(s.orelse);else{if(c=this.newBlock("while test"),this._jump(c),this.setBlock(c),h=this.newBlock("after while"),N=s.orelse.length>0?this.newBlock("while orelse"):null,v=this.newBlock("while body"),this.annotateSource(s),this._jumpfalse(this.vexpr(s.test),N||h),this._jump(v),this.pushBreakBlock(h),this.pushContinueBlock(c),this.setBlock(v),(Sk.debugging||Sk.killableWhile)&&this.u.canSuspend){var d="Sk.delay",_=this.newBlock("debug breakpoint for line "+s.lineno);t("if (Sk.breakpoints('"+this.filename+"',"+s.lineno+","+s.col_offset+")) {","var $susp = $saveSuspension({data: {type: '"+d+"'}, resume: function() {}}, '"+this.filename+"',"+s.lineno+","+s.col_offset+");","$susp.$blk = "+_+";","$susp.optional = true;","return $susp;","}"),this._jump(_),this.setBlock(_),this.u.doesSuspend=!0}this.vseqstmt(s.body),this._jump(c),this.popContinueBlock(),this.popBreakBlock(),s.orelse.length>0&&(this.setBlock(N),this.vseqstmt(s.orelse),this._jump(h)),this.setBlock(h)}},n.prototype.cfor=function(s){var v,N,h,c,l=this.newBlock("for start"),d=this.newBlock("for cleanup"),_=this.newBlock("for end");if(this.pushBreakBlock(_),this.pushContinueBlock(l),c=this.vexpr(s.iter),this.u.ste.generator?(h="$loc."+this.gensym("iter"),t(h,"=Sk.abstr.iter(",c,");")):(h=this._gr("iter","Sk.abstr.iter(",c,")"),this.u.tempsToSave.push(h)),this._jump(l),this.setBlock(l),t("$ret = Sk.abstr.iternext(",h,this.u.canSuspend?", true":", false",");"),this._checkSuspension(s),N=this._gr("next","$ret"),this._jumpundef(N,d),v=this.vexpr(s.target,N),(Sk.debugging||Sk.killableFor)&&this.u.canSuspend){var E="Sk.delay",b=this.newBlock("debug breakpoint for line "+s.lineno);t("if (Sk.breakpoints('"+this.filename+"',"+s.lineno+","+s.col_offset+")) {","var $susp = $saveSuspension({data: {type: '"+E+"'}, resume: function() {}}, '"+this.filename+"',"+s.lineno+","+s.col_offset+");","$susp.$blk = "+b+";","$susp.optional = true;","return $susp;","}"),this._jump(b),this.setBlock(b),this.u.doesSuspend=!0}this.vseqstmt(s.body),this._jump(l),this.setBlock(d),this.popContinueBlock(),this.popBreakBlock(),this.vseqstmt(s.orelse),this._jump(_),this.setBlock(_)},n.prototype.craise=function(s){if(s.exc){var v=this._gr("exc",this.vexpr(s.exc)),N=this.newBlock("exception now instantiated"),h=this._gr("isclass",v+".prototype instanceof Sk.builtin.BaseException");if(this._jumpfalse(h,N),s.inst){var c=this._gr("inst",this.vexpr(s.inst));t("if(!(",c," instanceof Sk.builtin.tuple)) {",c,"= new Sk.builtin.tuple([",c,"]);","}"),t("$ret = Sk.misceval.callsimOrSuspendArray(",v,",",c,".v);")}else t("$ret = Sk.misceval.callsimOrSuspend(",v,");");this._checkSuspension(s),t(v,"=$ret;"),this._jump(N),this.setBlock(N),t("if (",v," instanceof Sk.builtin.BaseException) {throw ",v,";} else {throw new Sk.builtin.TypeError('exceptions must derive from BaseException');};")}else t("throw $err;")},n.prototype.outputFinallyCascade=function(s){var v;this.u.finallyBlocks.length==0?t("if($postfinally!==undefined) { if ($postfinally.returning) { return $postfinally.returning; } else { $blk=$postfinally.gotoBlock; $postfinally=undefined; continue; } }"):(v=this.peekFinallyBlock(),t("if($postfinally!==undefined) {","if ($postfinally.returning",v.breakDepth==s.breakDepth?"|| $postfinally.isBreak":"",") {","$blk=",v.blk,";continue;","} else {","$blk=$postfinally.gotoBlock;$postfinally=undefined;continue;","}","}"))},n.prototype.ctry=function(s){var v,N,h,c,l,d,_,E,b=s.handlers.length,R,f,$,k;s.finalbody&&(R=this.newBlock("finalbody"),f=this.newBlock("finalexh"),$=this._gr("finally_reraise","undefined"),this.u.tempsToSave.push($),this.pushFinallyBlock(R),k=this.peekFinallyBlock(),this.setupExcept(f));var m=[];for(E=0;E<b;++E)m.push(this.newBlock("except_"+E+"_"));for(_=this.newBlock("unhandled"),d=this.newBlock("orelse"),l=this.newBlock("end"),m.length!=0&&this.setupExcept(m[0]),this.vseqstmt(s.body),m.length!=0&&this.endExcept(),this._jump(d),E=0;E<b;++E){if(this.setBlock(m[E]),c=s.handlers[E],!c.type&&E<b-1)throw new Sk.builtin.SyntaxError("default 'except:' must be last",this.filename,c.lineno);c.type&&(h=this.vexpr(c.type),N=E==b-1?_:m[E+1],v=this._gr("instance","Sk.misceval.isTrue(Sk.builtin.isinstance($err, ",h,"))"),this._jumpfalse(v,N)),c.name&&this.vexpr(c.name,"$err"),this.vseqstmt(c.body),this._jump(l)}this.setBlock(_),t("throw $err;"),this.setBlock(d),this.vseqstmt(s.orelse),this._jump(l),this.setBlock(l),s.finalbody&&(this.endExcept(),this._jump(R),this.setBlock(f),t($,"=$err;"),this._jump(R),this.setBlock(R),this.popFinallyBlock(),this.vseqstmt(s.finalbody),t("if(",$,"!==undefined) { throw ",$,";}"),this.outputFinallyCascade(k))},n.prototype.cwith=function(s,v){var N,h,c,l,d=this.newBlock("withexh"),_=this.newBlock("withtidyup"),E=this.newBlock("withcarryon"),b;N=this._gr("mgr",this.vexpr(s.items[v].context_expr)),t("$ret = Sk.abstr.lookupSpecial(",N,",Sk.builtin.str.$exit);"),this._checkSuspension(s),h=this._gr("exit","$ret"),this.u.tempsToSave.push(h),t("$ret = Sk.abstr.lookupSpecial(",N,",Sk.builtin.str.$enter);"),this._checkSuspension(s),t("$ret = Sk.misceval.callsimOrSuspendArray($ret);"),this._checkSuspension(s),c=this._gr("value","$ret"),this.pushFinallyBlock(_),b=this.u.finallyBlocks[this.u.finallyBlocks.length-1],this.setupExcept(d),s.items[v].optional_vars&&this.nameop(s.items[v].optional_vars.id,Sk.astnodes.Store,c),v+1<s.items.length?this.cwith(s,v+1):this.vseqstmt(s.body),this.endExcept(),this._jump(_),this.setBlock(d),t("$ret = Sk.misceval.applyOrSuspend(",h,",undefined,Sk.builtin.getExcInfo($err),undefined,[]);"),this._checkSuspension(s),this._jumptrue("$ret",E),t("throw $err;"),this.setBlock(_),this.popFinallyBlock(),t("$ret = Sk.misceval.callsimOrSuspendArray(",h,",[Sk.builtin.none.none$,Sk.builtin.none.none$,Sk.builtin.none.none$]);"),this._checkSuspension(s),this.outputFinallyCascade(b),this._jump(E),this.setBlock(E)},n.prototype.cassert=function(s){var v=this.vexpr(s.test),N=this.newBlock("end");this._jumptrue(v,N),t("throw new Sk.builtin.AssertionError(",s.msg?this.vexpr(s.msg):"",");"),this.setBlock(N)},n.prototype.cimportas=function(s,v,N){var h,c=s.v,l=c.indexOf("."),d=N;if(l!==-1)for(c=c.substr(l+1);l!==-1;)l=c.indexOf("."),h=l!==-1?c.substr(0,l):c,d=this._gr("lattr","Sk.abstr.gattr(",d,", new Sk.builtin.str('",h,"'))"),c=c.substr(l+1);return this.nameop(v,Sk.astnodes.Store,d)},n.prototype.cimport=function(s){var v,N,h,c,l,d=s.names.length;for(l=0;l<d;++l)c=s.names[l],t("$ret = Sk.builtin.__import__(",c.name.$r().v,",$gbl,$loc,[],",Sk.__future__.absolute_import?0:-1,");"),this._checkSuspension(s),h=this._gr("module","$ret"),c.asname?this.cimportas(c.name,c.asname,h):(N=c.name,v=N.v.indexOf("."),v!==-1&&(N=new Sk.builtin.str(N.v.substr(0,v))),this.nameop(N,Sk.astnodes.Store,h))},n.prototype.cfromimport=function(s){var v,N,h,c,l,d,_=s.names.length,E=[],b=s.level;for(b==0&&!Sk.__future__.absolute_import&&(b=-1),d=0;d<_;++d)E[d]="'"+r(s.names[d].name.v)+"'";for(t("$ret = Sk.builtin.__import__(",s.module.$r().v,",$gbl,$loc,[",E,"],",b,");"),this._checkSuspension(s),l=this._gr("module","$ret"),d=0;d<_;++d){if(h=s.names[d],c="'"+h.name.v+"'",d===0&&h.name.v==="*"){Sk.asserts.assert(_===1),t("Sk.importStar(",l,",$loc, $gbl);");return}N=this._gr("item","Sk.abstr.gattr(",l,", new Sk.builtin.str(",c,"), undefined)"),v=h.name,h.asname&&(v=h.asname),this.nameop(v,Sk.astnodes.Store,N)}},n.prototype.buildcodeobj=function(s,v,N,h,c,l){var d,_,E=[],b,R,f,$,k,m,g,x,C,L,P,J,K,j,V,G,X=[],Q=[],Z=[],te=null,ae=null;if(N&&(X=this.vseqexpr(N)),h&&h.defaults&&(Q=this.vseqexpr(h.defaults)),h&&h.kw_defaults&&(Z=h.kw_defaults.map(re=>re?this.vexpr(re):"undefined")),h&&h.vararg&&(te=h.vararg),h&&h.kwarg&&(ae=h.kwarg),!Sk.__future__.python3&&h&&h.kwonlyargs&&h.kwonlyargs.length!=0)throw new Sk.builtin.SyntaxError("Keyword-only arguments are not supported in Python 2");if(G=this.enterScope(v,s,s.lineno,this.canSuspend),V=this.u.ste.generator,j=this.u.ste.hasFree,K=this.u.ste.childHasFree,J=this.newBlock("codeobj entry"),this.u.prefixCode="var "+G+"=(function "+this.niceName(v.v)+"$(",P=[],V){if(ae)throw new Sk.builtin.SyntaxError(v.v+"(): keyword arguments in generators not supported",this.filename,s.lineno);if(te)throw new Sk.builtin.SyntaxError(v.v+"(): variable number of arguments in generators not supported",this.filename,s.lineno);P.push("$gen")}else{for(ae&&(P.push("$kwa"),this.u.tempsToSave.push("$kwa")),L=0;h&&L<h.args.length;++L)P.push(this.nameop(h.args[L].arg,Sk.astnodes.Param));for(L=0;h&&h.kwonlyargs&&L<h.kwonlyargs.length;++L)P.push(this.nameop(h.kwonlyargs[L].arg,Sk.astnodes.Param));te&&P.push(this.nameop(h.vararg.arg,Sk.astnodes.Param))}let le=!V;if(j&&(le||P.push("$free"),this.u.tempsToSave.push("$free")),le?this.u.prefixCode+="$posargs,$kwargs":this.u.prefixCode+=P.join(","),this.u.prefixCode+="){",V&&(this.u.prefixCode+=`
// generator
`),j&&(this.u.prefixCode+=`
// has free
`),K&&(this.u.prefixCode+=`
// has cell
`),le&&(this.u.prefixCode+=`
// fast call
`),C="{}",V&&(J="$gen.gi$resumeat",C="$gen.gi$locals"),x=",$cell={}",K&&V&&(x=",$cell=$gen.gi$cells"),this.u.varDeclsCode+="var $blk="+J+",$exc=[],$loc="+C+x+",$gbl="+(le?"this && this.func_globals":"this")+(le&&j?",$free=this && this.func_closure":"")+",$err=undefined,$ret=undefined,$postfinally=undefined,$currLineNo=undefined,$currColNo=undefined;",Sk.execLimit!==null&&(this.u.varDeclsCode+="if (typeof Sk.execStart === 'undefined') {Sk.execStart = Date.now()}"),Sk.yieldLimit!==null&&this.u.canSuspend&&(this.u.varDeclsCode+="if (typeof Sk.lastYield === 'undefined') {Sk.lastYield = Date.now()}"),this.u.varDeclsCode+="if ("+G+".$wakingSuspension!==undefined) { $wakeFromSuspension(); } else {",le){!ae&&!te&&(!h||!h.kwonlyargs||h.kwonlyargs.length===0)?this.u.varDeclsCode+="var $args = ((!$kwargs || $kwargs.length===0) && $posargs.length==="+P.length+") ? $posargs : this.$resolveArgs($posargs,$kwargs)":this.u.varDeclsCode+=`
var $args = this.$resolveArgs($posargs,$kwargs)
`;for(let re=0;re<P.length;re++)this.u.varDeclsCode+=","+P[re]+"=$args["+re+"]";this.u.varDeclsCode+=`;
`}if(V&&Q.length>0)for(g=h.args.length-Q.length,L=0;L<Q.length;++L)m=this.nameop(h.args[L+g].arg,Sk.astnodes.Param),this.u.varDeclsCode+="if("+m+"===undefined)"+m+"="+G+".$defaults["+L+"];";for(L=0;h&&L<h.args.length;++L)if(k=h.args[L].arg,this.isCell(k)){let re=r(p(this.u.private_,k).v);this.u.varDeclsCode+="$cell."+re+"="+re+";"}for(L=0;h&&h.kwonlyargs&&L<h.kwonlyargs.length;++L)if(k=h.kwonlyargs[L].arg,this.isCell(k)){let re=r(p(this.u.private_,k).v);this.u.varDeclsCode+="$cell."+re+"="+re+";"}if(te&&this.isCell(te.arg)){let re=r(p(this.u.private_,te.arg).v);this.u.varDeclsCode+="$cell."+re+"="+re+";"}if(ae&&(this.u.localnames.push(ae.arg.v),this.u.varDeclsCode+=ae.arg.v+"=new Sk.builtins['dict']($kwa);",this.isCell(ae.arg))){let re=r(p(this.u.private_,ae.arg).v);this.u.varDeclsCode+="$cell."+re+"="+re+";"}if(this.u.varDeclsCode+="}",Sk.__future__.python3&&l&&(this.u.varDeclsCode+="$gbl.__class__=$gbl."+l.v+";"),this.u.switchCode="while(true){try{",this.u.switchCode+=this.outputInterruptTest(),this.u.switchCode+="switch($blk){",this.u.suffixCode="} }catch(err){ if (!(err instanceof Sk.builtin.BaseException)) { err = new Sk.builtin.ExternalError(err); } err.traceback.push({lineno: $currLineNo, colno: $currColNo, filename: '"+this.filename+"'}); if ($exc.length>0) { $err = err; $blk=$exc.pop(); continue; } else { throw err; }} }});",c.call(this,G),h){for(let re of h.args)E.push(re.arg.v);for(let re of h.kwonlyargs||[])E.push(re.arg.v);this.u.argnames=E}if(this.exitScope(),Q.length>0&&t(G,".$defaults=[",Q.join(","),"];"),h&&h.kwonlyargs&&h.kwonlyargs.length>0&&(t(G,".co_argcount=",h.args.length,";"),t(G,".co_kwonlyargcount=",h.kwonlyargs.length,";"),t(G,".$kwdefs=[",Z.join(","),"];")),E.length>0?t(G,".co_varnames=['",E.join("','"),"'];"):t(G,".co_varnames=[];"),t(G,".co_docstring=",this.cDocstringOfCode(s),";"),ae&&t(G,".co_kwargs=1;"),te&&t(G,".co_varargs=1;"),V||t(G,".co_fastcall=1;"),_="",j&&(_=",$cell",d=this.u.ste.hasFree,d&&(_+=",$free")),V)return h&&h.args.length>0?this._gr("gener",`new Sk.builtins['function']((function(){var $origargs=Array.prototype.slice.call(arguments);Sk.builtin.pyCheckArgsLen("`,v.v,'",arguments.length,',h.args.length-Q.length,",",h.args.length,");return new Sk.builtins['generator'](",G,",$gbl,$origargs",_,");}))"):this._gr("gener",`new Sk.builtins['function']((function(){Sk.builtin.pyCheckArgsLen("`,v.v,`",arguments.length,0,0);return new Sk.builtins['generator'](`,G,",$gbl,[]",_,");}))");if(X.length>0){t("$ret = new Sk.builtins['function'](",G,",$gbl",_,");");for(let re of X.reverse())t("$ret = Sk.misceval.callsimOrSuspendArray(",re,",[$ret]);"),this._checkSuspension();return this._gr("funcobj","$ret")}return this._gr("funcobj","new Sk.builtins['function'](",G,",$gbl",_,")")},n.prototype.maybeCDocstringOfBody=function(s){if(s.length===0)return null;let v=s[0];if(v.constructor!==Sk.astnodes.Expr)return null;let N=v.value;return N.constructor!==Sk.astnodes.Str?null:this.vexpr(N)},n.prototype.cDocstringOfCode=function(s){switch(s.constructor){case Sk.astnodes.AsyncFunctionDef:case Sk.astnodes.FunctionDef:return this.maybeCDocstringOfBody(s.body)||"Sk.builtin.none.none$";case Sk.astnodes.Lambda:case Sk.astnodes.GeneratorExp:return"Sk.builtin.none.none$";default:Sk.asserts.fail(`unexpected node kind ${s.constructor.name}`)}},n.prototype.cfunction=function(s,v){var N;Sk.asserts.assert(s instanceof Sk.astnodes.FunctionDef),N=this.buildcodeobj(s,s.name,s.decorator_list,s.args,function(h){this.vseqstmt(s.body),t("return Sk.builtin.none.none$;")},v),this.nameop(s.name,Sk.astnodes.Store,N)},n.prototype.clambda=function(s){var v;return Sk.asserts.assert(s instanceof Sk.astnodes.Lambda),v=this.buildcodeobj(s,new Sk.builtin.str("<lambda>"),null,s.args,function(N){var h=this.vexpr(s.body);t("return ",h,";")}),v},n.prototype.cifexp=function(s){var v=this.newBlock("next of ifexp"),N=this.newBlock("end of ifexp"),h=this._gr("res","null"),c=this.vexpr(s.test);return this._jumpfalse(c,v),t(h,"=",this.vexpr(s.body),";"),this._jump(N),this.setBlock(v),t(h,"=",this.vexpr(s.orelse),";"),this._jump(N),this.setBlock(N),h},n.prototype.cgenexpgen=function(s,v,N){var h,c,l,d,_,E,b,R=this.newBlock("start for "+v),f=this.newBlock("skip for "+v),$=this.newBlock("if cleanup for "+v),k=this.newBlock("end for "+v),m=s[v],g;for(v===0?g="$loc.$iter0":(b=this.vexpr(m.iter),g="$loc."+this.gensym("iter"),t(g,"=","Sk.abstr.iter(",b,");")),this._jump(R),this.setBlock(R),this.annotateSource(N),t("$ret = Sk.abstr.iternext(",g,this.u.canSuspend?", true":", false",");"),this._checkSuspension(N),E=this._gr("next","$ret"),this._jumpundef(E,k),_=this.vexpr(m.target,E),d=m.ifs?m.ifs.length:0,l=0;l<d;++l)this.annotateSource(m.ifs[l]),c=this.vexpr(m.ifs[l]),this._jumpfalse(c,R);++v<s.length&&this.cgenexpgen(s,v,N),v>=s.length&&(this.annotateSource(N),h=this.vexpr(N),t("return [",f,"/*resume*/,",h,"/*ret*/];"),this.setBlock(f)),this._jump(R),this.setBlock(k),v===1&&t("return Sk.builtin.none.none$;")},n.prototype.cgenexp=function(s){var v=this.buildcodeobj(s,new Sk.builtin.str("<genexpr>"),null,null,function(h){this.cgenexpgen(s.generators,0,s.elt)}),N=this._gr("gener","Sk.misceval.callsimArray(",v,");");return t(N,".gi$locals.$iter0=Sk.abstr.iter(",this.vexpr(s.generators[0].iter),");"),N},n.prototype.cclass=function(s){var v,N,h,c,l;Sk.asserts.assert(s instanceof Sk.astnodes.ClassDef),l=this.vseqexpr(s.decorator_list),c=this.vseqexpr(s.bases),h=this.enterScope(s.name,s,s.lineno),N=this.newBlock("class entry"),this.u.prefixCode="var "+h+"=(function $"+s.name.v+"$class_outer($globals,$locals,$cell){var $gbl=$globals,$loc=$locals;$free=$globals;",this.u.switchCode+="(function $"+s.name.v+"$_closure($cell){",this.u.switchCode+="var $blk="+N+",$exc=[],$ret=undefined,$postfinally=undefined,$currLineNo=undefined,$currColNo=undefined;",Sk.execLimit!==null&&(this.u.switchCode+="if (typeof Sk.execStart === 'undefined') {Sk.execStart = Date.now()}"),Sk.yieldLimit!==null&&this.u.canSuspend&&(this.u.switchCode+="if (typeof Sk.lastYield === 'undefined') {Sk.lastYield = Date.now()}"),this.u.switchCode+="while(true){try{",this.u.switchCode+=this.outputInterruptTest(),this.u.switchCode+="switch($blk){",this.u.suffixCode="}}catch(err){ if (!(err instanceof Sk.builtin.BaseException)) { err = new Sk.builtin.ExternalError(err); } err.traceback.push({lineno: $currLineNo, colno: $currColNo, filename: '"+this.filename+"'}); if ($exc.length>0) { $err = err; $blk=$exc.pop(); continue; } else { throw err; }}}",this.u.suffixCode+="}).call(null, $cell);});",this.u.private_=s.name,this.cbody(s.body,s.name),t("return;"),this.exitScope(),t("$ret = Sk.misceval.buildClass($gbl,",h,",",s.name.$r().v,",[",c,"], $cell);");for(let d of l)t("$ret = Sk.misceval.callsimOrSuspendArray(",d,", [$ret]);"),this._checkSuspension();this.nameop(s.name,Sk.astnodes.Store,"$ret")},n.prototype.ccontinue=function(s){var v=this.peekFinallyBlock(),N;if(this.u.continueBlocks.length==0)throw new Sk.builtin.SyntaxError("'continue' outside loop",this.filename,s.lineno);N=this.u.continueBlocks[this.u.continueBlocks.length-1],Sk.asserts.assert(this.u.breakBlocks.length===this.u.continueBlocks.length),v&&v.breakDepth==this.u.continueBlocks.length?t("$postfinally={isBreak:true,gotoBlock:",N,"};"):this._jump(N)},n.prototype.cbreak=function(s){var v=this.peekFinallyBlock(),N;if(this.u.breakBlocks.length===0)throw new Sk.builtin.SyntaxError("'break' outside loop",this.filename,s.lineno);N=this.u.breakBlocks[this.u.breakBlocks.length-1],v&&v.breakDepth==this.u.breakBlocks.length?t("$postfinally={isBreak:true,gotoBlock:",N,"};"):this._jump(N)},n.prototype.vstmt=function(s,v){var N,h,c,l;switch(this.u.lineno=s.lineno,this.u.linenoSet=!1,this.u.localtemps=[],Sk.debugging&&this.u.canSuspend&&(l=this.newBlock("debug breakpoint for line "+s.lineno),t("if (Sk.breakpoints('"+this.filename+"',"+s.lineno+","+s.col_offset+")) {","var $susp = $saveSuspension({data: {type: 'Sk.debug'}, resume: function() {}}, '"+this.filename+"',"+s.lineno+","+s.col_offset+");","$susp.$blk = "+l+";","$susp.optional = true;","return $susp;","}"),this._jump(l),this.setBlock(l),this.u.doesSuspend=!0),this.annotateSource(s),s.constructor){case Sk.astnodes.FunctionDef:this.cfunction(s,v);break;case Sk.astnodes.ClassDef:this.cclass(s);break;case Sk.astnodes.Return:if(this.u.ste.blockType!==Sk.SYMTAB_CONSTS.FunctionBlock)throw new Sk.builtin.SyntaxError("'return' outside function",this.filename,s.lineno);h=s.value?this.vexpr(s.value):"Sk.builtin.none.none$",this.u.finallyBlocks.length==0?t("return ",h,";"):(t("$postfinally={returning:",h,"};"),this._jump(this.peekFinallyBlock().blk));break;case Sk.astnodes.Delete:this.vseqexpr(s.targets);break;case Sk.astnodes.Assign:for(c=s.targets.length,h=this.vexpr(s.value),N=0;N<c;++N)this.vexpr(s.targets[N],h);break;case Sk.astnodes.AnnAssign:h=this.vexpr(s.value),this.vexpr(s.target,h),this.vexpr(s.annotation);break;case Sk.astnodes.AugAssign:return this.caugassign(s);case Sk.astnodes.Print:this.cprint(s);break;case Sk.astnodes.For:return this.cfor(s);case Sk.astnodes.While:return this.cwhile(s);case Sk.astnodes.If:return this.cif(s);case Sk.astnodes.Raise:return this.craise(s);case Sk.astnodes.Try:return this.ctry(s);case Sk.astnodes.With:return this.cwith(s,0);case Sk.astnodes.Assert:return this.cassert(s);case Sk.astnodes.Import:return this.cimport(s);case Sk.astnodes.ImportFrom:return this.cfromimport(s);case Sk.astnodes.Global:break;case Sk.astnodes.Expr:this.vexpr(s.value);break;case Sk.astnodes.Pass:break;case Sk.astnodes.Break:this.cbreak(s);break;case Sk.astnodes.Continue:this.ccontinue(s);break;case Sk.astnodes.Debugger:t("debugger;");break;default:Sk.asserts.fail("unhandled case in vstmt: "+JSON.stringify(s))}},n.prototype.vseqstmt=function(s){var v;for(v=0;v<s.length;++v)this.vstmt(s[v])};var T=0,A=1,S=2,O=3,D=0,B=1,F=2;n.prototype.isCell=function(s){var v=r(p(this.u.private_,s).v),N=this.u.ste.getScope(v),h=null;return N===Sk.SYMTAB_CONSTS.CELL},n.prototype.nameop=function(s,v,N){var h,c,l,d,_,E,b;if((v===Sk.astnodes.Store||v===Sk.astnodes.AugStore||v===Sk.astnodes.Del)&&s.v==="__debug__")throw new Sk.builtin.SyntaxError("can not assign to __debug__",this.filename,this.u.lineno);if(Sk.asserts.assert(s.v!=="None"),s.v==="NotImplemented")return"Sk.builtin.NotImplemented.NotImplemented$";switch(b=p(this.u.private_,s).v,b=r(b),E=0,_=O,d=this.u.ste.getScope(b),l=null,d){case Sk.SYMTAB_CONSTS.FREE:l="$free",_=S;break;case Sk.SYMTAB_CONSTS.CELL:l="$cell",_=S;break;case Sk.SYMTAB_CONSTS.LOCAL:this.u.ste.blockType===Sk.SYMTAB_CONSTS.FunctionBlock&&!this.u.ste.generator&&(_=T);break;case Sk.SYMTAB_CONSTS.GLOBAL_IMPLICIT:this.u.ste.blockType===Sk.SYMTAB_CONSTS.FunctionBlock&&(_=A);break;case Sk.SYMTAB_CONSTS.GLOBAL_EXPLICIT:_=A;default:break}switch(Sk.asserts.assert(d||s.v.charAt(1)==="_"),c=b,this.u.ste.generator||this.u.ste.blockType!==Sk.SYMTAB_CONSTS.FunctionBlock?b="$loc."+b:(_===T||_===O)&&this.u.localnames.push(b),_){case T:switch(v){case Sk.astnodes.Load:case Sk.astnodes.Param:return t("if (",b," === undefined) { throw new Sk.builtin.UnboundLocalError('local variable \\'",b,`\\' referenced before assignment'); }
`),b;case Sk.astnodes.Store:t(b,"=",N,";");break;case Sk.astnodes.Del:t("delete ",b,";");break;default:Sk.asserts.fail("unhandled")}break;case O:switch(v){case Sk.astnodes.Load:return this._gr("loadname",b,"!==undefined?",b,":Sk.misceval.loadname('",c,"',$gbl);");case Sk.astnodes.Store:t(b,"=",N,";");break;case Sk.astnodes.Del:t("delete ",b,";");break;case Sk.astnodes.Param:return b;default:Sk.asserts.fail("unhandled")}break;case A:switch(v){case Sk.astnodes.Load:return this._gr("loadgbl","Sk.misceval.loadname('",c,"',$gbl)");case Sk.astnodes.Store:t("$gbl.",c,"=",N,";");break;case Sk.astnodes.Del:t("delete $gbl.",c);break;default:Sk.asserts.fail("unhandled case in name op_global")}break;case S:switch(v){case Sk.astnodes.Load:return l+"."+c;case Sk.astnodes.Store:t(l,".",c,"=",N,";");break;case Sk.astnodes.Param:return c;default:Sk.asserts.fail("unhandled case in name op_deref")}break;default:Sk.asserts.fail("unhandled case")}},n.prototype.enterScope=function(s,v,N,h){var c,l=new a;return l.ste=this.st.getStsForAst(v),l.name=s,l.firstlineno=N,l.canSuspend=h||!1,this.u&&this.u.private_&&(l.private_=this.u.private_),this.stack.push(this.u),this.allUnits.push(l),c=this.gensym("scope"),l.scopename=c,this.u=l,this.u.activateScope(),this.nestlevel++,c},n.prototype.exitScope=function(){var s,v=this.u;if(this.nestlevel--,this.stack.length-1>=0?this.u=this.stack.pop():this.u=null,this.u&&this.u.activateScope(),v.name.v!=="<module>"&&(s=v.name.$r().v,s=s.substring(1,s.length-1),t(v.scopename,".co_name=new Sk.builtins['str']('",s,"');"),this.stack.length&&this.u.ste.blockType=="class")){let h=this.u.name.v;t(v.scopename,".co_qualname=new Sk.builtins['str']('"+h+"."+s+"');")}for(var N in v.consts)v.consts.hasOwnProperty(N)&&(v.suffixCode+=N+" = "+v.consts[N]+";")},n.prototype.cbody=function(s,v){var N=0;let h=this.maybeCDocstringOfBody(s);for(h!==null&&(t("$loc.__doc__ = ",h,";"),N=1);N<s.length;++N)this.vstmt(s[N],v)},n.prototype.cprint=function(s){var v,N,h;for(Sk.asserts.assert(s instanceof Sk.astnodes.Print),h="null",s.dest&&(h=this.vexpr(s.dest)),N=s.values.length,v=0;v<N;++v)t("$ret = Sk.misceval.print_(","new Sk.builtins['str'](",this.vexpr(s.values[v]),").v);"),this._checkSuspension(s);s.nl&&(t("$ret = Sk.misceval.print_(",'"\\n");'),this._checkSuspension(s))},n.prototype.cmod=function(s){var v=this.enterScope(new Sk.builtin.str("<module>"),s,0,this.canSuspend),N=this.newBlock("module entry");return this.u.prefixCode="var "+v+"=(function($forcegbl){",this.u.varDeclsCode="var $gbl = $forcegbl || {}, $blk="+N+",$exc=[],$loc=$gbl,$cell={},$err=undefined;$loc.__file__=new Sk.builtins.str('"+this.filename+"');var $ret=undefined,$postfinally=undefined,$currLineNo=undefined,$currColNo=undefined;",Sk.execLimit!==null&&(this.u.varDeclsCode+="if (typeof Sk.execStart === 'undefined') {Sk.execStart = Date.now()}"),Sk.yieldLimit!==null&&this.u.canSuspend&&(this.u.varDeclsCode+="if (typeof Sk.lastYield === 'undefined') {Sk.lastYield = Date.now()}"),this.u.varDeclsCode+="if ("+v+".$wakingSuspension!==undefined) { $wakeFromSuspension(); }if (Sk.retainGlobals) {    if (Sk.globals) { $gbl = Sk.globals; Sk.globals = $gbl; $loc = $gbl; }    if (Sk.globals) { $gbl = Sk.globals; Sk.globals = $gbl; $loc = $gbl; $loc.__file__=new Sk.builtins.str('"+this.filename+"');}    else { Sk.globals = $gbl; }} else { Sk.globals = $gbl; }",this.u.switchCode="while(true){try{",this.u.switchCode+=this.outputInterruptTest(),this.u.switchCode+="switch($blk){",this.u.suffixCode="}",this.u.suffixCode+="}catch(err){ if (!(err instanceof Sk.builtin.BaseException)) { err = new Sk.builtin.ExternalError(err); } err.traceback.push({lineno: $currLineNo, colno: $currColNo, filename: '"+this.filename+"'}); if ($exc.length>0) { $err = err; $blk=$exc.pop(); continue; } else { throw err; }} } });",s.constructor===Sk.astnodes.Module?(this.cbody(s.body),t("return $loc;")):Sk.asserts.fail("todo; unhandled case in compilerMod"),this.exitScope(),this.result.push(this.outputAllUnits()),v},Sk.compile=function(s,v,N,h){var c=Sk.__future__;Sk.__future__=Object.create(Sk.__future__);var l=Sk.parse(v,s),d=Sk.astFromParse(l.cst,v,l.flags),_={};_.cf_flags=l.flags;var E=Sk.symboltable(d,v),b=new n(v,E,_.cf_flags,h,s),R=b.cmod(d);Sk.__future__=c;var f="$compiledmod = function() {"+b.result.join("")+`
return `+R+";}();";return{funcname:"$compiledmod",code:f}},Sk.exportSymbol("Sk.compile",Sk.compile),Sk.resetCompiler=function(){Sk.gensymcount=0},Sk.exportSymbol("Sk.resetCompiler",Sk.resetCompiler),Sk.fixReserved=r,Sk.exportSymbol("Sk.fixReserved",Sk.fixReserved),Sk.unfixReserved=o,Sk.exportSymbol("Sk.unfixReserved",Sk.unfixReserved),Sk.mangleName=p,Sk.exportSymbol("Sk.mangleName",Sk.mangleName),Sk.reservedWords_=i,Sk.exportSymbol("Sk.reservedWords_",Sk.reservedWords_)}),"./src/complex.js":(function(Y,y){Sk.builtin.complex=Sk.abstr.buildNativeClass("complex",{constructor:function(l,d){Sk.asserts.assert(this instanceof Sk.builtin.complex,"bad call to complex constructor, use 'new'"),this.real=l,this.imag=d},slots:{tp$as_number:!0,tp$doc:`Create a complex number from a real part and an optional imaginary part.

This is equivalent to (real + imag*1j) where imag defaults to 0.`,tp$hash(){let c=new Sk.builtin.float_(this.real).tp$hash(),d=new Sk.builtin.float_(this.imag).tp$hash()*1003+c;return Sk.builtin.int_.withinThreshold(d)?d:new Sk.builtin.int_(JSBI.BigInt(d)).tp$hash()},tp$getattr:Sk.generic.getAttr,tp$new(c,l){return c=Sk.abstr.copyKeywordsToNamedArgs("complex",["real","imag"],c,l,[null,null]),i.call(this,c[0],c[1])},tp$richcompare(c,l){if(l!=="Eq"&&l!=="NotEq"){if(Sk.builtin.checkNumber(c)||a(c))throw new Sk.builtin.TypeError("no ordering relation is defined for complex numbers");return Sk.builtin.NotImplemented.NotImplemented$}return T(function(d,_,E,b){let R=d==E&&_==b;return l==="Eq"?R:!R},!0).call(this,c)},$r(){return F(this,null,"g")},nb$int(){throw new Sk.builtin.TypeError("can't convert complex to int")},nb$long(){throw new Sk.builtin.TypeError("can't convert complex to long")},nb$float(){throw new Sk.builtin.TypeError("can't convert complex to float")},nb$positive(){return new Sk.builtin.complex(this.real,this.imag)},nb$negative(){return new Sk.builtin.complex(-this.real,-this.imag)},nb$bool(){return this.real||this.imag},nb$add:T((c,l,d,_)=>new Sk.builtin.complex(c+d,l+_)),nb$subtract:T((c,l,d,_)=>new Sk.builtin.complex(c-d,l-_)),nb$reflected_subtract:T((c,l,d,_)=>new Sk.builtin.complex(d-c,_-l)),nb$multiply:T((c,l,d,_)=>new Sk.builtin.complex(d*c-_*l,c*_+l*d)),nb$divide:T(A),nb$reflected_divide:T((c,l,d,_)=>A(d,_,c,l)),nb$floor_divide(c){throw new Sk.builtin.TypeError("can't take floor of complex number.")},nb$reflected_floor_divide(c){throw new Sk.builtin.TypeError("can't take floor of complex number.")},nb$remainder(c){throw new Sk.builtin.TypeError("can't mod complex numbers.")},nb$reflected_remainder(c){throw new Sk.builtin.TypeError("can't mod complex numbers.")},nb$divmod(c){throw new Sk.builtin.TypeError("can't take floor or mod of complex number.")},nb$power(c,l){if(l!=null&&!Sk.builtin.checkNone(l))throw new Sk.builtin.ValueError("complex modulo");return S.call(this,c)},nb$abs(){let c=this.real,l=this.imag;if(!v(c)||!v(l))return N(c)?new Sk.builtin.float_(Math.abs(c)):N(l)?new Sk.builtin.float_(Math.abs(l)):new Sk.builtin.float_(NaN);let d=Math.hypot(c,l);if(!v(d))throw new Sk.builtin.OverflowError("absolute value too large");return new Sk.builtin.float_(d)}},getsets:{real:{$get(){return new Sk.builtin.float_(this.real)},$doc:"the real part of a complex number"},imag:{$get(){return new Sk.builtin.float_(this.imag)},$doc:"the imaginary part of a complex number"}},methods:{conjugate:{$meth(){return new Sk.builtin.complex(this.real,-this.imag)},$flags:{NoArgs:!0},$textsig:null,$doc:`complex.conjugate() -> complex

Return the complex conjugate of its argument. (3-4j).conjugate() == 3+4j.`},__getnewargs__:{$meth(){return new Sk.builtin.tuple([new Sk.builtin.float_(this.real),new Sk.builtin.float_(this.imag)])},$flags:{NoArgs:!0},$textsig:null,$doc:Sk.builtin.none.none$},__format__:{$meth(c){if(Sk.builtin.checkString(c))return s(this,c);throw new Sk.builtin.TypeError("__format__ requires str")},$flags:{OneArg:!0},$textsig:null,$doc:`complex.__format__() -> str

Convert to a string according to format_spec.`}}}),Sk.exportSymbol("Sk.builtin.complex",Sk.builtin.complex);function t(c){let l=c.v;if(typeof l=="number")return l;if(c.nb$float&&(l=c.nb$float()),l===void 0)throw new Sk.builtin.TypeError("a float is required");return l.v}function n(c){if(c==null)return null;let l=Sk.abstr.lookupSpecial(c,Sk.builtin.str.$complex);return l!==void 0?Sk.misceval.callsimArray(l,[]):null}let a=Sk.builtin.checkComplex;function i(c,l){let d,_={},E={},b=!1,R=!1,f=c,$=l;if(f!=null&&f.constructor===Sk.builtin.complex&&$==null)return f;if(Sk.builtin.checkString(f)){if($!=null)throw new Sk.builtin.TypeError("complex() can't take second arg if first is a string");return Sk.builtin.complex.complex_subtype_from_string(f,this)}if($!=null&&Sk.builtin.checkString($))throw new Sk.builtin.TypeError("complex() second arg can't be a string");if(d=n(f),d!=null&&d!==Sk.builtin.NotImplemented.NotImplemented$){if(!a(d))throw new Sk.builtin.TypeError("__complex__ should return a complex object");f=d}function k(m){return m.nb$float!==void 0}if(f!=null&&!k(f))throw new Sk.builtin.TypeError("complex() first argument must be a string or a number, not '"+Sk.abstr.typeName(f)+"'");if($!=null&&!k($))throw new Sk.builtin.TypeError("complex() second argument must be a number, not '"+Sk.abstr.typeName(f)+"'");return f==null?(_.real=0,_.imag=0):a(f)?(_.real=f.real,_.imag=f.imag,b=!0):(_.real=t(f),_.imag=0),$==null?(E.real=0,E.imag=0):a($)?(E.real=$.real,E.imag=$.imag,R=!0):(E.real=t($),E.imag=0),R===!0&&(_.real-=E.imag),b===!0&&(E.real+=_.imag),r(_.real,E.real,this)}function r(c,l,d){if(d===Sk.builtin.complex.prototype)return new Sk.builtin.complex(c,l);{let _=new d.constructor;return Sk.builtin.complex.call(_,c,l),_}}let o=/_[eE]|[eE]_|\._|_\.|[+-]_|_j|j_/,p=/_(?=[^_])/g;Sk.builtin.complex.complex_subtype_from_string=function(c,l){l=l||Sk.builtin.complex.prototype;var d,_,E,b=0,R=0,f=!1,$,k;if(Sk.builtin.checkString(c))c=Sk.ffi.remapToJs(c);else if(typeof c!="string")throw new TypeError("provided unsupported string-alike argument");if(c.indexOf("\0")!==-1||c.length===0||c==="")throw new Sk.builtin.ValueError("complex() arg is a malformed string");for(d=0,c=c.replace(/inf|infinity/gi,"Infinity"),c=c.replace(/nan/gi,"NaN"),_=0;c[d]===" ";)d++;if(c[d]==="(")for(f=!0,d++;c[d]===" ";)d++;if(c.indexOf("_")!==-1){if(o.test(c))throw new Sk.builtin.ValueError("could not convert string to complex: '"+c+"'");c=c.charAt(0)+c.substring(1).replace(p,"")}var m=/^(?:[+-]?(?:(?:(?:\d*\.\d+)|(?:\d+\.?))(?:[eE][+-]?\d+)?|NaN|Infinity))/;if(E=c.substr(d),k=E.match(m),k!==null)if(d+=k[0].length,c[d]==="j"||c[d]==="J")R=parseFloat(k[0]),d++;else if(c[d]==="+"||c[d]==="-"){if(b=parseFloat(k[0]),k=c.substr(d).match(m),k!==null?(R=parseFloat(k[0]),d+=k[0].length):(R=c[d]==="+"?1:-1,d++),c[d]!=="j"&&c[d]!=="J")throw new Sk.builtin.ValueError("complex() arg is malformed string");d++}else b=parseFloat(k[0]);else k=k=E.match(/^([+-]?[jJ])/),k!==null&&(k[0].length===1?R=1:R=k[0][0]==="+"?1:-1,d+=k[0].length);for(;c[d]===" ";)d++;if(f){if(c[d]!==")")throw new Sk.builtin.ValueError("complex() arg is malformed string");for(d++;c[d]===" ";)d++}if(c.length!==d)throw new Sk.builtin.ValueError("complex() arg is malformed string");return r(b,R,l)};function w(c){let l=parseFloat(JSBI.toNumber(c));if(l==1/0||l==-1/0)throw new Sk.builtin.OverflowError("int too large to convert to float");return l}function T(c,l){return function(d){let _=this.real,E=this.imag,b=d.real,R,f=d.v;if(typeof b=="number")R=d.imag;else if(typeof f=="number")b=f,R=0;else if(JSBI.__isBigInt(f))l===void 0?b=w(f):b=f.toString(),R=0;else return Sk.builtin.NotImplemented.NotImplemented$;return c(_,E,b,R)}}function A(c,l,d,_){let E,b,R,f,$=Math.abs(d),k=Math.abs(_);if($>=k){if($===0)throw new Sk.builtin.ZeroDivisionError("complex division by zero");E=_/d,b=d+_*E,R=(c+l*E)/b,f=(l-c*E)/b}else k>=$?(E=d/_,b=d*E+_,Sk.asserts.assert(_!==0),R=(c*E+l)/b,f=(l*E-c)/b):(R=NaN,f=NaN);return new Sk.builtin.complex(R,f)}let S=T((c,l,d,_)=>{let E=d|0;return _===0&&d===E?D(c,l,E):O(c,l,d,_)});function O(c,l,d,_){let E,b,R,f;if(d===0&&_===0)R=1,f=0;else if(c===0&&l===0){if(_!==0||d<0)throw new Sk.builtin.ZeroDivisionError("complex division by zero");R=0,f=0}else{let $=Math.hypot(c,l);E=Math.pow($,d);let k=Math.atan2(l,c);b=k*d,_!==0&&(E/=Math.exp(k*_),b+=_*Math.log($)),R=E*Math.cos(b),f=E*Math.sin(b)}return new Sk.builtin.complex(R,f)}function D(c,l,d){if(d>100||d<-100)return O(c,l,d,0);if(d>0)return B(c,l,d);{let _=B(c,l,-d);return A(1,0,_.real,_.imag)}}function B(c,l,d){var _,E;let b=1;for(_=new Sk.builtin.complex(1,0),E=new Sk.builtin.complex(c,l);b>0&&d>=b;)d&b&&(_=new Sk.builtin.complex(_.real*E.real-_.imag*E.imag,_.real*E.imag+E.real*_.imag)),b<<=1,E=new Sk.builtin.complex(E.real*E.real-E.imag*E.imag,2*E.real*E.imag);return _}function F(c,l,d){function _(x,C){let L;return C?L=C<0?-1:1:L=1/C<0?-1:1,L*Math.abs(x)}let E,b="",R="",f=null,$="",k="",m=c.real,g=c.imag;return m===0&&_(1,m)==1?(f="",R=h(g,d,l,0,null)):(b=h(m,d,l,0,null),f=b,R=h(g,d,l,h.Py_DTSF_SIGN,null),g===0&&1/g===-1/0&&R&&R[0]!=="-"&&(R="-"+R),$="(",k=")"),E=""+$+f+R+"j"+k,new Sk.builtin.str(E)}function s(c,l){throw new Sk.builtin.NotImplementedError("__format__ is not implemented for complex type.")}function v(c){return Number.isFinite(c)}function N(c){return c===1/0||c===-1/0}function h(c,l,d,_,E){let b,R,f=!1;switch(l){case"e":case"f":case"g":break;case"E":f=!0,l="e";break;case"F":f=!0,l="f";break;case"r":if(d!==0)throw new Error("Bad internall call");d=17,l="g";break;default:throw new Error("Bad internall call")}if(isNaN(c))b="nan",R=h.Py_DTST_NAN;else if(c===1/0)b="inf",R=h.Py_DTST_INFINITE;else if(c===-1/0)b="-inf",R=h.Py_DTST_INFINITE;else{R=h.Py_DTST_FINITE,_&h.Py_DTSF_ADD_DOT_0&&(l="g");var $="%";$+=_&h.Py_DTSF_ALT?"#":"",d!=null&&($+=".",$+=d),$+=l,$=new Sk.builtin.str($),b=$.nb$remainder(new Sk.builtin.float_(c)),b=b.v}return _&h.Py_DTSF_SIGN&&b[0]!=="-"&&(b="+"+b),f&&(b=b.toUpperCase()),b}h.Py_DTSF_SIGN=1,h.Py_DTSF_ADD_DOT_0=2,h.Py_DTSF_ALT=4,h.Py_DTST_FINITE=0,h.Py_DTST_INFINITE=1,h.Py_DTST_NAN=2}),"./src/constants.js":(function(Y,y){Sk.builtin.str.$empty=new Sk.builtin.str(""),Sk.builtin.str.$emptystr=Sk.builtin.str.$empty,Sk.builtin.str.$utf8=new Sk.builtin.str("utf-8"),Sk.builtin.str.$ascii=new Sk.builtin.str("ascii"),Sk.builtin.str.$default_factory=new Sk.builtin.str("default_factory"),Sk.builtin.str.$imag=new Sk.builtin.str("imag"),Sk.builtin.str.$real=new Sk.builtin.str("real"),Sk.builtin.str.$abs=new Sk.builtin.str("__abs__"),Sk.builtin.str.$bytes=new Sk.builtin.str("__bytes__"),Sk.builtin.str.$call=new Sk.builtin.str("__call__"),Sk.builtin.str.$class=new Sk.builtin.str("__class__"),Sk.builtin.str.$cmp=new Sk.builtin.str("__cmp__"),Sk.builtin.str.$complex=new Sk.builtin.str("__complex__"),Sk.builtin.str.$contains=new Sk.builtin.str("__contains__"),Sk.builtin.str.$copy=new Sk.builtin.str("__copy__"),Sk.builtin.str.$dict=new Sk.builtin.str("__dict__"),Sk.builtin.str.$dir=new Sk.builtin.str("__dir__"),Sk.builtin.str.$doc=new Sk.builtin.str("__doc__"),Sk.builtin.str.$enter=new Sk.builtin.str("__enter__"),Sk.builtin.str.$eq=new Sk.builtin.str("__eq__"),Sk.builtin.str.$exit=new Sk.builtin.str("__exit__"),Sk.builtin.str.$index=new Sk.builtin.str("__index__"),Sk.builtin.str.$init=new Sk.builtin.str("__init__"),Sk.builtin.str.$int_=new Sk.builtin.str("__int__"),Sk.builtin.str.$iter=new Sk.builtin.str("__iter__"),Sk.builtin.str.$file=new Sk.builtin.str("__file__"),Sk.builtin.str.$float_=new Sk.builtin.str("__float__"),Sk.builtin.str.$format=new Sk.builtin.str("__format__"),Sk.builtin.str.$ge=new Sk.builtin.str("__ge__"),Sk.builtin.str.$getattr=new Sk.builtin.str("__getattr__"),Sk.builtin.str.$getattribute=new Sk.builtin.str("__getattribute__"),Sk.builtin.str.$getitem=new Sk.builtin.str("__getitem__"),Sk.builtin.str.$gt=new Sk.builtin.str("__gt__"),Sk.builtin.str.$keys=new Sk.builtin.str("keys"),Sk.builtin.str.$le=new Sk.builtin.str("__le__"),Sk.builtin.str.$len=new Sk.builtin.str("__len__"),Sk.builtin.str.$length_hint=new Sk.builtin.str("__length_hint__"),Sk.builtin.str.$loader=new Sk.builtin.str("__loader__"),Sk.builtin.str.$lt=new Sk.builtin.str("__lt__"),Sk.builtin.str.$module=new Sk.builtin.str("__module__"),Sk.builtin.str.$missing=new Sk.builtin.str("__missing__"),Sk.builtin.str.$name=new Sk.builtin.str("__name__"),Sk.builtin.str.$ne=new Sk.builtin.str("__ne__"),Sk.builtin.str.$new=new Sk.builtin.str("__new__"),Sk.builtin.str.$next=new Sk.builtin.str("__next__"),Sk.builtin.str.$path=new Sk.builtin.str("__path__"),Sk.builtin.str.$qualname=new Sk.builtin.str("__qualname__"),Sk.builtin.str.$repr=new Sk.builtin.str("__repr__"),Sk.builtin.str.$reversed=new Sk.builtin.str("__reversed__"),Sk.builtin.str.$round=new Sk.builtin.str("__round__"),Sk.builtin.str.$setattr=new Sk.builtin.str("__setattr__"),Sk.builtin.str.$setitem=new Sk.builtin.str("__setitem__"),Sk.builtin.str.$str=new Sk.builtin.str("__str__"),Sk.builtin.str.$trunc=new Sk.builtin.str("__trunc__"),Sk.builtin.str.$write=new Sk.builtin.str("write"),Sk.misceval.op2method_={Eq:Sk.builtin.str.$eq,NotEq:Sk.builtin.str.$ne,Gt:Sk.builtin.str.$gt,GtE:Sk.builtin.str.$ge,Lt:Sk.builtin.str.$lt,LtE:Sk.builtin.str.$le}}),"./src/descr.js":(function(Y,y){function t(p,w,T){return Sk.abstr.buildNativeClass(p,{constructor:T.constructor,slots:Object.assign({tp$getattr:Sk.generic.getAttr,$r:i},T.slots),getsets:Object.assign(T.getsets||{},r),proto:Object.assign(T.proto||{},{d$repr_name:w||p,d$check:n,d$set_check:a}),flags:{sk$acceptable_as_base_class:!1}})}function n(p){if(p==null)return this;if(!p.ob$type.$isSubType(this.d$type))throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' requires a '"+this.d$type.prototype.tp$name+"' object but received a '"+Sk.abstr.typeName(p)+"' object")}function a(p){if(!p.ob$type.$isSubType(this.d$type))throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' requires a '"+this.d$type.prototype.tp$name+"' object but received a '"+Sk.abstr.typeName(p)+"' object")}function i(){return new Sk.builtin.str("<"+this.d$repr_name+" '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' objects>")}let r={__doc__:{$get(){return this.d$def.$doc?new Sk.builtin.str(this.d$def.$doc):Sk.builtin.none.none$}},__objclass__:{$get(){return this.d$type}},__name__:{$get(){return new Sk.builtin.str(this.d$name)}}},o={__text_signature__:{$get(){return this.d$def.$textsig?new Sk.builtin.str(this.d$def.$textsig):Sk.builtin.none.none$}}};Sk.builtin.getset_descriptor=t("getset_descriptor",void 0,{constructor:function(w,T){this.d$def=T,this.$get=T.$get,this.$set=T.$set,this.d$type=w,this.d$name=T.$name},slots:{tp$descr_get(p,w){let T;if(T=this.d$check(p))return T;if(this.$get!==void 0)return this.$get.call(p);throw new Sk.builtin.AttributeError("getset_descriptor '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' objects is not readable")},tp$descr_set(p,w){if(this.d$set_check(p),this.$set!==void 0)return this.$set.call(p,w);throw new Sk.builtin.AttributeError("attribute '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' objects is readonly")}}}),Sk.builtin.method_descriptor=t("method_descriptor","method",{constructor:function(w,T){this.d$def=T,this.$meth=T.$meth,this.d$type=w,this.d$name=T.$name||"<native JS>";let A=T.$flags||{};this.$flags=A,A.FastCall&&A.NoKwargs?this.tp$call=this.$methodFastCallNoKwargs:A.FastCall?this.tp$call=this.$methodFastCall:A.NoArgs?this.tp$call=this.$methodCallNoArgs:A.OneArg?this.tp$call=this.$methodCallOneArg:A.NamedArgs?this.tp$call=this.$methodCallNamedArgs:A.MinArgs!==void 0?this.tp$call=this.$methodCallMinArgs:(this.func_code=T.$meth,this.tp$call=this.$defaultCall,this.$memoiseFlags=Sk.builtin.func.prototype.$memoiseFlags,this.$resolveArgs=Sk.builtin.func.prototype.$resolveArgs)},slots:{tp$call(p,w){return this.tp$call(p,w)},tp$descr_get(p,w){let T;return(T=this.d$check(p))?T:new Sk.builtin.sk_method(this.d$def,p)}},getsets:o,proto:{$methodFastCall(p,w){let T=p.shift();return this.m$checkself(T),this.$meth.call(T,p,w)},$methodFastCallNoKwargs(p,w){let T=p.shift();return this.m$checkself(T),Sk.abstr.checkNoKwargs(this.d$name,w),this.$meth.call(T,p)},$methodCallNoArgs(p,w){let T=p.shift();return this.m$checkself(T),Sk.abstr.checkNoArgs(this.d$name,p,w),this.$meth.call(T)},$methodCallOneArg(p,w){let T=p.shift();return this.m$checkself(T),Sk.abstr.checkOneArg(this.d$name,p,w),this.$meth.call(T,p[0])},$methodCallNamedArgs(p,w){let T=p.shift();return this.m$checkself(T),p=Sk.abstr.copyKeywordsToNamedArgs(this.d$name,this.$flags.NamedArgs,p,w,this.$flags.Defaults),this.$meth.call(T,...p)},$methodCallMinArgs(p,w){let T=p.shift();return this.m$checkself(T),Sk.abstr.checkNoKwargs(this.d$name,w),Sk.abstr.checkArgsLen(this.d$name,p,this.$flags.MinArgs,this.$flags.MaxArgs),this.$meth.call(T,...p)},$defaultCall(p,w){return this.m$checkself(p[0]),Sk.builtin.func.prototype.tp$call.call(this,p,w)},m$checkself(p){if(p===void 0)throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' object needs an argument");this.d$check(p)}}}),Sk.builtin.wrapper_descriptor=t("wrapper_descriptor","slot wrapper",{constructor:function(w,T,A){this.d$def=T,this.d$type=w,this.d$name=A.$name=T.$name,this.d$wrapped=A},slots:{tp$descr_get(p,w){let T;return(T=this.d$check(p))?T:new Sk.builtin.method_wrapper(this,p)},tp$call(p,w){if(p.length<1)throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' object needs an argument");let T=p.shift();if(!T.ob$type.$isSubType(this.d$type))throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' requires a '"+this.d$type.prototype.tp$name+"' object but received a '"+Sk.abstr.typeName(T)+"'");return this.raw$call(T,p,w)}},proto:{raw$call(p,w,T){return this.d$wrapped.$name=this.d$name,this.d$def.$wrapper.call(this.d$wrapped,p,w,T)}}}),Sk.builtin.method_wrapper=t("method_wrapper",void 0,{constructor:function(w,T){this.m$descr=w,this.m$self=T,this.d$def=w.d$def,this.d$name=w.d$name,this.d$type=w.d$type},slots:{tp$call(p,w){return this.m$descr.raw$call(this.m$self,p,w)},tp$richcompare(p,w){if(w!=="Eq"&&w!=="NotEq"||!(p instanceof Sk.builtin.method_wrapper))return Sk.builtin.NotImplemented.NotImplemented$;let T=this.m$self===p.m$self&&this.m$descr===p.m$descr;return w==="Eq"?T:!T},$r(){return new Sk.builtin.str("<method-wrapper '"+this.d$name+"' of "+Sk.abstr.typeName(this.m$self)+" object>")}},getsets:{__self__:{$get(){return this.m$self}}}}),Sk.builtin.classmethod_descriptor=t("classmethod_descriptor","method",{constructor:function(w,T){this.d$def=T,this.$meth=T.$meth,this.d$type=w,this.d$name=T.$name||"<native JS>"},slots:{tp$call(p,w){if(p.length<1)throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' of '"+this.d$type.prototype.tp$name+"' object needs an argument");let T=p.shift();return this.tp$descr_get(null,T).tp$call(p,w)},tp$descr_get(p,w,T){if(w===void 0)if(p!==null)w=w||p.ob$type;else throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' for type '"+this.d$type.prototype.tp$name+"' needs an object or a type");if(w.ob$type!==Sk.builtin.type)throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' for type '"+this.d$type.prototype.tp$name+"' needs a type not a '"+Sk.abstr.typeName(w)+"' as arg 2");if(!w.$isSubType(this.d$type))throw new Sk.builtin.TypeError("descriptor '"+this.d$name+"' requires a '"+this.d$type.prototype.tp$name+"' object but received a '"+Sk.abstr.typeName(w)+"' object");return new Sk.builtin.sk_method(this.d$def,w)}},getsets:o}),[Sk.builtin.method_descriptor,Sk.builtin.getset_descriptor,Sk.builtin.wrapper_descriptor,Sk.builtin.method_wrapper,Sk.builtin.classmethod_descriptor].forEach(p=>{Sk.abstr.setUpSlots(p),Sk.abstr.setUpMethods(p),Sk.abstr.setUpGetSets(p)})}),"./src/dict.js":(function(Y,y){var t,n;Sk.builtin.dict=Sk.abstr.buildNativeClass("dict",{constructor:function(g){g===void 0&&(g=[]),Sk.asserts.assert(Array.isArray(g)&&g.length%2===0&&this instanceof Sk.builtin.dict,"bad call to dict constructor"),this.size=0,this.entries=Object.create(null),this.buckets={};for(let x=0;x<g.length;x+=2)this.set$item(g[x],g[x+1]);this.in$repr=!1,this.$version=0},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$as_number:!0,tp$hash:Sk.builtin.none.none$,tp$doc:`dict() -> new empty dictionary
dict(mapping) -> new dictionary initialized from a mapping object's
    (key, value) pairs
dict(iterable) -> new dictionary initialized as if via:
    d = {}
    for k, v in iterable:
        d[k] = v
dict(**kwargs) -> new dictionary initialized with the name=value pairs
    in the keyword argument list.  For example:  dict(one=1, two=2)`,$r(){if(this.in$repr)return new Sk.builtin.str("{...}");this.in$repr=!0;let m=this.$items().map(([g,x])=>Sk.misceval.objectRepr(g)+": "+Sk.misceval.objectRepr(x));return this.in$repr=!1,new Sk.builtin.str("{"+m.join(", ")+"}")},tp$new:Sk.generic.new,tp$init(m,g){return this.update$common(m,g,"dict")},tp$iter(){return new E(this)},tp$richcompare(m,g){let x;if(!(m instanceof Sk.builtin.dict)||g!=="Eq"&&g!=="NotEq")return Sk.builtin.NotImplemented.NotImplemented$;if(m===this)x=!0;else if(this.size!==m.size)x=!1;else{let C;x=this.$items().every(([L,P])=>(C=m.mp$lookup(L),C!==void 0&&(C===P||Sk.misceval.richCompareBool(P,C,"Eq"))))}return g==="Eq"?x:!x},nb$or(m){if(!(m instanceof Sk.builtin.dict))return Sk.builtin.NotImplemented.NotImplemented$;let g=this.dict$copy();return g.dict$merge(m),g},nb$reflected_or(m){if(!(m instanceof Sk.builtin.dict))return Sk.builtin.NotImplemented.NotImplemented$;let g=m.dict$copy();return g.dict$merge(this),g},nb$inplace_or(m){return Sk.misceval.chain(this.update$onearg(m),()=>this)},sq$length(){return this.get$size()},sq$contains(m){return this.mp$lookup(m)!==void 0},mp$subscript(m,g){let x=this.mp$lookup(m);if(x!==void 0)return x;let C=Sk.abstr.lookupSpecial(this,Sk.builtin.str.$missing);if(C!==void 0){let L=Sk.misceval.callsimOrSuspendArray(C,[m]);return g?L:Sk.misceval.retryOptionalSuspensionOrThrow(L)}throw new Sk.builtin.KeyError(m)},mp$ass_subscript(m,g){if(g===void 0){if(this.pop$item(m)===void 0)throw new Sk.builtin.KeyError(m)}else this.set$item(m,g)}},methods:{__reversed__:{$meth(){return new f(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"Return a reverse iterator over the dict keys."},get:{$meth(m,g){return this.mp$lookup(m)||g||Sk.builtin.none.none$},$flags:{MinArgs:1,MaxArgs:2},$textsig:"($self, key, default=None, /)",$doc:"Return the value for key if key is in the dictionary, else default."},setdefault:{$meth(m,g){let x,C=a(m);return x=typeof C=="string"?this.entries[C]:this.get$bucket_item(m,C),x!==void 0?x[1]:(g=g||Sk.builtin.none.none$,typeof C=="string"?this.entries[C]=[m,g]:this.set$bucket_item(m,g,C),this.size++,this.$version++,g)},$flags:{MinArgs:1,MaxArgs:2},$textsig:"($self, key, default=None, /)",$doc:`Insert key with a value of default if key is not in the dictionary.

Return the value for key if key is in the dictionary, else default.`},pop:{$meth(m,g){let x=this.pop$item(m);if(x!==void 0)return x[1];if(g!==void 0)return g;throw new Sk.builtin.KeyError(m)},$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:`D.pop(k[,d]) -> v, remove specified key and return the corresponding value.
If key is not found, d is returned if given, otherwise KeyError is raised`},popitem:{$meth(){let m=this.get$size();if(m===0)throw new Sk.builtin.KeyError("popitem(): dictionary is empty");let[g,x]=this.$items()[m-1];return this.pop$item(g),new Sk.builtin.tuple([g,x])},$flags:{NoArgs:!0},$textsig:null,$doc:`D.popitem() -> (k, v), remove and return some (key, value) pair as a
2-tuple; but raise KeyError if D is empty.`},keys:{$meth(){return new h(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"D.keys() -> a set-like object providing a view on D's keys"},items:{$meth(){return new l(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"D.items() -> a set-like object providing a view on D's items"},values:{$meth(){return new c(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"D.values() -> an object providing a view on D's values"},update:{$meth(m,g){return Sk.misceval.chain(this.update$common(m,g,"update"),()=>Sk.builtin.none.none$)},$flags:{FastCall:!0},$textsig:null,$doc:`D.update([E, ]**F) -> None.  Update D from dict/iterable E and F.
If E is present and has a .keys() method, then does:  for k in E: D[k] = E[k]
If E is present and lacks a .keys() method, then does:  for k, v in E: D[k] = v
In either case, this is followed by: for k in F:  D[k] = F[k]`},clear:{$meth(){this.size=0,this.$version++,this.entries=Object.create(null),this.buckets={}},$flags:{NoArgs:!0},$textsig:null,$doc:"D.clear() -> None.  Remove all items from D."},copy:{$meth(){return this.dict$copy()},$flags:{NoArgs:!0},$textsig:null,$doc:"D.copy() -> a shallow copy of D"}},classmethods:{fromkeys:{$meth:function(g,x){x=x||Sk.builtin.none.none$;let C=this===Sk.builtin.dict?new this:this.tp$call([],[]);return Sk.misceval.chain(C,L=>(C=L,Sk.misceval.iterFor(Sk.abstr.iter(g),P=>C.mp$ass_subscript(P,x,!0))),()=>C)},$flags:{MinArgs:1,MaxArgs:2},$textsig:"($type, iterable, value=None, /)",$doc:"Create a new dictionary with keys from iterable and values set to value."}},proto:{quick$lookup:i,mp$lookup:w,get$size(){return this.size},sk$asarray(){return Object.values(this.entries).map(m=>m[0])},update$common:A,update$onearg(m){return m instanceof Sk.builtin.dict||Sk.abstr.lookupSpecial(m,Sk.builtin.str.$keys)!==void 0?this.dict$merge(m):this.dict$merge_seq(m)},dict$copy(){let m=new Sk.builtin.dict([]);m.size=this.size;let g=Object.entries(this.entries);for(let L in g){let P=g[L][0],J=g[L][1];m.entries[P]=[J[0],J[1]]}let x,C;for(let L in this.buckets){C=this.buckets[L],m.buckets[L]=x=[];for(let P=0;P<C.length;P++)x.push(m.entries["#"+L+"_"+P])}return m},$items(){return Object.values(this.entries)},set$item:O,get$bucket_item:r,pop$bucket_item:o,set$bucket_item:p,pop$item:D,dict$merge:T,dict$merge_seq:S}});function a(m){let g=m.$savedKeyHash;return g!==void 0||(g=Sk.abstr.objectHash(m)),g}function i(m){var g=m.$savedKeyHash,x=this.entries[g];if(x!==void 0)return x[1]}function r(m,g){let x=this.buckets[g];if(x===void 0)return;let C;for(let L=0;L<x.length;L++)if(C=x[L],C!==void 0&&(C[0]===m||Sk.misceval.richCompareBool(m,C[0],"Eq")))return C}function o(m,g){let x=this.buckets[g],C,L;if(x!==void 0){for(let P=0;P<x.length;P++)if(L=x[P],L!==void 0&&(L[0]===m||Sk.misceval.richCompareBool(m,L[0],"Eq"))){let J="#"+g+"_"+P;return delete this.entries[J],x[P]=void 0,x.every(K=>K===void 0)&&delete this.buckets[g],L}}}function p(m,g,x){let C,L=this.buckets[x],P=[m,g];if(L===void 0)this.buckets[x]=[P],C="#"+x+"_0";else{let J=L.indexOf(void 0);J!==-1?(C="#"+x+"_"+J,L[J]=P):(C="#"+x+"_"+L.length,L.push(P))}this.entries[C]=P}function w(m){let g,x=a(m);if(typeof x=="string"?g=this.entries[x]:g=this.get$bucket_item(m,x),g!==void 0)return g[1]}function T(m){let g;if(m.tp$iter===Sk.builtin.dict.prototype.tp$iter){g=m.tp$iter();for(let x=g.tp$iternext();x!==void 0;x=g.tp$iternext()){let C=m.mp$subscript(x);this.set$item(x,C)}}else{let x=Sk.abstr.lookupSpecial(m,Sk.builtin.str.$keys);return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(x,[]),C=>Sk.misceval.iterFor(Sk.abstr.iter(C),L=>Sk.misceval.chain(m.mp$subscript(L,!0),P=>{this.set$item(L,P)})))}}function A(m,g,x){Sk.abstr.checkArgsLen(x,m,0,1);let C=m[0],L;return C!==void 0&&(L=this.update$onearg(C)),Sk.misceval.chain(L,()=>{if(g)for(let P=0;P<g.length;P+=2)this.set$item(new Sk.builtin.str(g[P]),g[P+1])})}function S(m){let g=0;return Sk.misceval.iterFor(Sk.abstr.iter(m),x=>{if(!Sk.builtin.checkIterable(x))throw new Sk.builtin.TypeError("cannot convert dictionary update sequence element #"+g+" to a sequence");let C=Sk.misceval.arrayFromIterable(x);if(C.length!==2)throw new Sk.builtin.ValueError("dictionary update sequence element #"+g+" has length "+C.length+"; 2 is required");this.set$item(C[0],C[1]),g++})}function O(m,g){let x=a(m),C;typeof x=="string"?(C=this.entries[x],C===void 0?(this.entries[x]=[m,g],this.size++,this.$version++):C[1]=g):(C=this.get$bucket_item(m,x),C===void 0?(this.set$bucket_item(m,g,x),this.size++,this.$version++):C[1]=g)}function D(m){let g=a(m),x;if(typeof g=="string"?(x=this.entries[g],delete this.entries[g]):x=this.pop$bucket_item(m,g),x!==void 0)return this.size--,this.$version++,x}function B(m){return new Sk.builtin.set(Sk.misceval.arrayFromIterable(m))}function F(m){return m instanceof h||m instanceof l}function s(m,g){for(let x=Sk.abstr.iter(m),C=x.tp$iternext();C!==void 0;C=x.tp$iternext())if(!Sk.abstr.sequenceContains(g,C))return!1;return!0}let v={tp$getattr:Sk.generic.getAttr,tp$as_number:!0,tp$as_sequence_or_mapping:!0,tp$hash:Sk.builtin.none.none$,$r(){if(this.in$repr)return new Sk.builtin.str("...");this.in$repr=!0;let m=Sk.misceval.arrayFromIterable(this);return m=m.map(g=>Sk.misceval.objectRepr(g)),this.in$repr=!1,new Sk.builtin.str(Sk.abstr.typeName(this)+"(["+m.join(", ")+"])")},tp$richcompare(m,g){if(!(Sk.builtin.checkAnySet(m)||F(m)))return Sk.builtin.NotImplemented.NotImplemented$;let x=this.sq$length(),C=m.sq$length();switch(g){case"NotEq":case"Eq":let L;return this===m?L=!0:x===C&&(L=s(this,m)),g==="NotEq"?!L:L;case"Lt":return x<C&&s(this,m);case"LtE":return x<=C&&s(this,m);case"Gt":return x>C&&s(m,this);case"GtE":return x>=C&&s(m,this)}},nb$subtract(m){let g=B(this);return g.difference.$meth.call(g,m)},nb$and(m){let g=B(this);return g.intersection.$meth.call(g,m)},nb$or(m){let g=B(this);return g.union.$meth.call(g,m)},nb$xor(m){let g=B(this);return g.symmetric_difference.$meth.call(g,m)},sq$length(){return this.dict.get$size()}};function N(m,g,x){let C={constructor:function(P){if(arguments.length!==1)throw new Sk.builtin.TypeError("cannot create '"+Sk.abstr.typeName(this)+"' instances");this.dict=P,this.in$repr=!1}};return C.slots=Object.assign(g,v),C.methods={isdisjoint:{$meth(L){let P=B(this);return P.isdisjoint.$meth.call(P,L)},$flags:{OneArg:!0},$textsig:null,$doc:"Return True if the view and the given iterable have a null intersection."},__reversed__:{$meth:x,$flags:{NoArgs:!0},$textsig:null,$doc:"Return a reverse iterator over the dict keys."}},C.flags={sk$acceptable_as_base:!1},m==="dict_values"&&(delete C.slots.tp$as_number,delete C.slots.tp$richcompare),Sk.abstr.buildNativeClass(m,C)}var h=N("dict_keys",{sq$contains(m){return this.dict.mp$lookup(m)!==void 0},tp$iter(){return new E(this.dict)}},function(){return new f(this.dict)}),c=N("dict_values",{tp$iter(){return new R(this.dict)}},function(){return new k(this.dict)}),l=N("dict_items",{sq$contains(m){if(!(m instanceof Sk.builtin.tuple&&m.sq$length()===2))return!1;let g=m.mp$subscript(new Sk.builtin.int_(0)),x=m.mp$subscript(new Sk.builtin.int_(1)),C=this.dict.mp$lookup(g);return C===void 0?!1:C===x||Sk.misceval.richCompareBool(C,x,"Eq")},tp$iter(){return new b(this.dict)}},function(){return new $(this.dict)});function d(m,g,x){return Sk.abstr.buildIteratorClass(m,{constructor:function(L){this.$index=0,this.$orig=L,this.tp$iternext=()=>(this.$seq=L.$items(),this.$version=L.$version,x&&(this.$seq=this.$seq.reverse()),this.tp$iternext=this.constructor.prototype.tp$iternext,this.tp$iternext())},iternext:g,methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1},proto:{next$item:_}})}function _(){if(this.$version!==this.$orig.$version)throw this.$len!==this.$orig.get$size()?new Sk.builtin.RuntimeError("dict changed size during iteration"):new Sk.builtin.RuntimeError("dictionary keys changed during iteration");return this.$seq[this.$index++]}var E=d("dict_keyiterator",function(){let m=this.next$item();return m&&m[0]}),b=d("dict_itemiterator",function(){let m=this.next$item();return m&&new Sk.builtin.tuple([m[0],m[1]])}),R=d("dict_valueiterator",function(){let m=this.next$item();return m&&m[1]}),f=d("dict_reversekeyiterator",E.prototype.tp$iternext,!0),$=d("dict_reverseitemiterator",b.prototype.tp$iternext,!0),k=d("dict_reversevalueiterator",R.prototype.tp$iternext,!0);Sk.builtin.dict.py2$methods={has_key:{$name:"has_key",$flags:{OneArg:!0},$meth(m){return new Sk.builtin.bool(this.sq$contains(m))},$doc:"D.has_key(k) -> True if D has a key k, else False"},keys:{$name:"keys",$meth(){return new Sk.builtin.list(this.sk$asarray())},$flags:{NoArgs:!0},$textsig:null,$doc:"D.keys() -> a set-like object providing a view on D's keys"},items:{$name:"items",$meth(){return new Sk.builtin.list(this.$items().map(([m,g])=>new Sk.builtin.tuple([m,g])))},$flags:{NoArgs:!0},$textsig:null,$doc:"D.items() -> a set-like object providing a view on D's items"},values:{$name:"values",$meth(){return new Sk.builtin.list(this.$items().map(([m,g])=>g))},$flags:{NoArgs:!0},$textsig:null,$doc:"D.values() -> an object providing a view on D's values"}}}),"./src/enumerate.js":(function(Y,y){Sk.builtin.enumerate=Sk.abstr.buildIteratorClass("enumerate",{constructor:function(n,a){if(!(this instanceof Sk.builtin.enumerate))throw TypeError("Failed to construct 'enumerate': Please use the 'new' operator");return this.$iterable=n,this.$index=a,this},iternext(t){let n=Sk.misceval.chain(this.$iterable.tp$iternext(t),a=>{if(a!==void 0)return new Sk.builtin.tuple([new Sk.builtin.int_(this.$index++),a])});return t?n:Sk.misceval.retryOptionalSuspensionOrThrow(n)},slots:{tp$doc:`Return an enumerate object.

  iterable
    an object supporting iteration

The enumerate object yields pairs containing a count (from start, which
defaults to zero) and a value yielded by the iterable argument.

enumerate is useful for obtaining an indexed list:
    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...`,tp$new(t,n){let[a,i]=Sk.abstr.copyKeywordsToNamedArgs("enumerate",["iterable","start"],t,n,[new Sk.builtin.int_(0)]);if(a=Sk.abstr.iter(a),i=Sk.misceval.asIndexOrThrow(i),this===Sk.builtin.enumerate.prototype)return new Sk.builtin.enumerate(a,i);{let r=new this.constructor;return Sk.builtin.enumerate.call(r,a,i),r}}}}),Sk.exportSymbol("Sk.builtin.enumerate",Sk.builtin.enumerate)}),"./src/env.js":(function(Y,y){Sk.bool_check=function(t,n){if(t==null||typeof t!="boolean")throw new Error("must specify "+n+" and it must be a boolean")},Sk.python2={print_function:!1,division:!1,absolute_import:null,unicode_literals:!1,python3:!1,class_repr:!1,inherit_from_object:!1,super_args:!1,octal_number_literal:!1,bankers_rounding:!1,python_version:!1,dunder_round:!1,exceptions:!1,no_long_type:!1,ceil_floor_int:!1,silent_octal_literal:!0},Sk.python3={print_function:!0,division:!0,absolute_import:null,unicode_literals:!0,python3:!0,class_repr:!0,inherit_from_object:!0,super_args:!0,octal_number_literal:!0,bankers_rounding:!0,python_version:!0,dunder_round:!0,exceptions:!0,no_long_type:!0,ceil_floor_int:!0,silent_octal_literal:!1},Sk.configure=function(t){"use strict";Sk.output=t.output||Sk.output,Sk.asserts.assert(typeof Sk.output=="function"),Sk.debugout=t.debugout||Sk.debugout,Sk.asserts.assert(typeof Sk.debugout=="function"),Sk.uncaughtException=t.uncaughtException||Sk.uncaughtException,Sk.asserts.assert(typeof Sk.uncaughtException=="function"),Sk.read=t.read||Sk.read,Sk.asserts.assert(typeof Sk.read=="function"),Sk.nonreadopen=t.nonreadopen||!1,Sk.asserts.assert(typeof Sk.nonreadopen=="boolean"),Sk.fileopen=t.fileopen||void 0,Sk.asserts.assert(typeof Sk.fileopen=="function"||typeof Sk.fileopen>"u"),Sk.filewrite=t.filewrite||void 0,Sk.asserts.assert(typeof Sk.filewrite=="function"||typeof Sk.filewrite>"u"),Sk.timeoutMsg=t.timeoutMsg||Sk.timeoutMsg,Sk.asserts.assert(typeof Sk.timeoutMsg=="function"),Sk.exportSymbol("Sk.timeoutMsg",Sk.timeoutMsg),Sk.sysargv=t.sysargv||Sk.sysargv,Sk.asserts.assert(Sk.isArrayLike(Sk.sysargv)),Sk.__future__=t.__future__||Sk.python3,Sk.bool_check(Sk.__future__.print_function,"Sk.__future__.print_function"),Sk.bool_check(Sk.__future__.division,"Sk.__future__.division"),Sk.bool_check(Sk.__future__.unicode_literals,"Sk.__future__.unicode_literals"),Sk.bool_check(Sk.__future__.class_repr,"Sk.__future__.class_repr"),Sk.bool_check(Sk.__future__.inherit_from_object,"Sk.__future__.inherit_from_object"),Sk.bool_check(Sk.__future__.super_args,"Sk.__future__.super_args"),Sk.bool_check(Sk.__future__.octal_number_literal,"Sk.__future__.octal_number_literal"),Sk.bool_check(Sk.__future__.bankers_rounding,"Sk.__future__.bankers_rounding"),Sk.bool_check(Sk.__future__.python_version,"Sk.__future__.python_version"),Sk.bool_check(Sk.__future__.dunder_round,"Sk.__future__.dunder_round"),Sk.bool_check(Sk.__future__.exceptions,"Sk.__future__.exceptions"),Sk.bool_check(Sk.__future__.no_long_type,"Sk.__future__.no_long_type"),Sk.bool_check(Sk.__future__.ceil_floor_int,"Sk.__future__.ceil_floor_int"),Sk.bool_check(Sk.__future__.silent_octal_literal,"Sk.__future__.silent_octal_literal"),Sk.imageProxy=t.imageProxy||"http://localhost:8080/320x",Sk.asserts.assert(typeof Sk.imageProxy=="string"||typeof Sk.imageProxy=="function"),Sk.inputfun=t.inputfun||Sk.inputfun,Sk.asserts.assert(typeof Sk.inputfun=="function"),Sk.inputfunTakesPrompt=t.inputfunTakesPrompt||!1,Sk.asserts.assert(typeof Sk.inputfunTakesPrompt=="boolean"),Sk.retainGlobals=t.retainglobals||t.retainGlobals||!1,Sk.asserts.assert(typeof Sk.retainGlobals=="boolean"),Sk.debugging=t.debugging||!1,Sk.asserts.assert(typeof Sk.debugging=="boolean"),Sk.killableWhile=t.killableWhile||!1,Sk.asserts.assert(typeof Sk.killableWhile=="boolean"),Sk.killableFor=t.killableFor||!1,Sk.asserts.assert(typeof Sk.killableFor=="boolean"),Sk.signals=typeof t.signals!==void 0?t.signals:null,Sk.signals===!0?Sk.signals={listeners:[],addEventListener(n){Sk.signals.listeners.push(n)},removeEventListener(n){var a=Sk.signals.listeners.indexOf(n);a>=0&&Sk.signals.listeners.splice(a,1)},signal(n,a){for(var i=0;i<Sk.signals.listeners.length;i++)Sk.signals.listeners[i].call(null,n,a)}}:Sk.signals=null,Sk.asserts.assert(typeof Sk.signals=="object"),Sk.breakpoints=t.breakpoints||function(){return!0},Sk.asserts.assert(typeof Sk.breakpoints=="function"),Sk.setTimeout=t.setTimeout,Sk.setTimeout===void 0&&(typeof setTimeout=="function"?Sk.setTimeout=function(n,a){setTimeout(n,a)}:Sk.setTimeout=function(n,a){n()}),Sk.asserts.assert(typeof Sk.setTimeout=="function"),"execLimit"in t&&(Sk.execLimit=t.execLimit),"yieldLimit"in t&&(Sk.yieldLimit=t.yieldLimit),t.syspath&&(Sk.syspath=t.syspath,Sk.asserts.assert(Sk.isArrayLike(Sk.syspath)),Sk.realsyspath=void 0,Sk.sysmodules=new Sk.builtin.dict([])),Sk.misceval.softspace_=!1,Sk.switch_version(Sk.__future__.python3),Sk.builtin.str.$next=Sk.__future__.python3?new Sk.builtin.str("__next__"):new Sk.builtin.str("next"),Sk.setupOperators(Sk.__future__.python3),Sk.setupDunderMethods(Sk.__future__.python3),Sk.setupObjects(Sk.__future__.python3),Sk.token.setupTokens(Sk.__future__.python3)},Sk.exportSymbol("Sk.configure",Sk.configure),Sk.uncaughtException=function(t){throw t},Sk.uncaughtException=function(t){throw t},Sk.exportSymbol("Sk.uncaughtException",Sk.uncaughtException),Sk.timeoutMsg=function(){return"Program exceeded run time limit."},Sk.exportSymbol("Sk.timeoutMsg",Sk.timeoutMsg),Sk.execLimit=Number.POSITIVE_INFINITY,Sk.yieldLimit=Number.POSITIVE_INFINITY,Sk.output=function(t){},Sk.read=function(t){if(Sk.builtinFiles===void 0)throw"skulpt-stdlib.js has not been loaded";if(Sk.builtinFiles.files[t]===void 0)throw"File not found: '"+t+"'";return Sk.builtinFiles.files[t]},Sk.sysargv=[],Sk.getSysArgv=function(){return Sk.sysargv},Sk.exportSymbol("Sk.getSysArgv",Sk.getSysArgv),Sk.syspath=[],Sk.inBrowser=Sk.global.document!==void 0,Sk.debugout=function(t){},(function(){Sk.global.write!==void 0?Sk.output=Sk.global.write:Sk.global.console!==void 0&&Sk.global.console.log!==void 0?Sk.output=function(t){Sk.global.console.log(t)}:Sk.global.print!==void 0&&(Sk.output=Sk.global.print),Sk.global.console!==void 0&&Sk.global.console.log!==void 0?Sk.debugout=function(t){Sk.global.console.log(t)}:Sk.global.print!==void 0&&(Sk.debugout=Sk.global.print)})(),Sk.inputfun=function(t){return window.prompt(t)},Sk.setup_method_mappings=function(){},Sk.setupDictIterators=function(t){},Sk.switch_version=function(t){let n={float_:{method_names:["__round__"],2:[!1],3:[!0]},int_:{method_names:["__round__"],2:[!1],3:[!0]},list:{method_names:["clear","copy","sort"],2:[!1,!1,!0],3:[!0,!0,!0]},dict:{method_names:["has_key","keys","items","values"],2:[!0,!0,!0,!0],3:[!1,!0,!0,!0]}};for(let a in n){let i=Sk.builtin[a],r=n[a].method_names,o=n[a][3];if(t&&i.py3$methods===void 0)return;if(i.py3$methods===void 0){i.py3$methods={};for(let T=0;T<r.length;T++){let A=r[T];o[T]&&(i.py3$methods[A]=i.prototype[A].d$def)}}let p,w;t?(p=o,w=i.py3$methods):(p=n[a][2],w=i.py2$methods);for(let T=0;T<r.length;T++){let A=r[T];delete i.prototype[A],p[T]&&(i.prototype[A]=new Sk.builtin.method_descriptor(i,w[A]))}}},Sk.exportSymbol("Sk.__future__",Sk.__future__),Sk.exportSymbol("Sk.inputfun",Sk.inputfun)}),"./src/errors.js":(function(Y,y){Sk.builtin.BaseException=Sk.abstr.buildNativeClass("BaseException",{constructor:function(...n){Sk.asserts.assert(this instanceof Sk.builtin.BaseException,"bad call to exception constructor, use 'new'");let a=n[0];typeof a=="string"&&(a=new Sk.builtin.str(a)),this.args=new Sk.builtin.tuple(a?[a]:[]),this.traceback=[],this.$d=new Sk.builtin.dict,n.length>=3&&this.traceback.push({lineno:n[2],filename:n[1]||"<unknown>"})},slots:{tp$getattr:Sk.generic.getAttr,tp$doc:"Common base class for all exceptions",tp$new(t,n){let a;return this.hp$type?(a=new this.constructor,Sk.builtin.BaseException.call(a)):a=new this.constructor,a.args=new Sk.builtin.tuple(t.slice()),a},tp$init(t,n){Sk.abstr.checkNoKwargs(Sk.abstr.typeName(this),n)},$r(){let t=this.tp$name;return t+="("+this.args.v.map(n=>Sk.misceval.objectRepr(n)).join(", ")+")",new Sk.builtin.str(t)},tp$str(){return this.args.v.length<=1?new Sk.builtin.str(this.args.v[0]):this.args.$r()}},getsets:{args:{$get(){return this.args}},__dict__:Sk.generic.getSetDict},proto:{toString(){let t=this.tp$name;return t+=": "+this.tp$str().v,this.traceback.length!==0?t+=" on line "+this.traceback[0].lineno:t+=" at <unknown>",t}}}),Sk.exportSymbol("Sk.builtin.BaseException",Sk.builtin.BaseException),Sk.builtin.Exception=Sk.abstr.buildNativeClass("Exception",{constructor:function(...n){Sk.builtin.BaseException.apply(this,n)},base:Sk.builtin.BaseException}),Sk.exportSymbol("Sk.builtin.Exception",Sk.builtin.Exception),Sk.builtin.AssertionError=Sk.abstr.buildNativeClass("AssertionError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.AssertionError",Sk.builtin.AssertionError),Sk.builtin.AttributeError=Sk.abstr.buildNativeClass("AttributeError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.ImportError=Sk.abstr.buildNativeClass("ImportError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.IndentationError=Sk.abstr.buildNativeClass("IndentationError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.IndexError=Sk.abstr.buildNativeClass("IndexError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.LookupError=Sk.abstr.buildNativeClass("LookupError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.KeyError=Sk.abstr.buildNativeClass("KeyError",{constructor:function(...n){Sk.builtin.LookupError.apply(this,n)},base:Sk.builtin.LookupError}),Sk.builtin.NameError=Sk.abstr.buildNativeClass("NameError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.UnboundLocalError=Sk.abstr.buildNativeClass("UnboundLocalError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.OverflowError=Sk.abstr.buildNativeClass("OverflowError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.SyntaxError=Sk.abstr.buildNativeClass("SyntaxError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.RuntimeError=Sk.abstr.buildNativeClass("RuntimeError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.RuntimeError",Sk.builtin.RuntimeError),Sk.builtin.SuspensionError=Sk.abstr.buildNativeClass("SuspensionError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.SuspensionError",Sk.builtin.SuspensionError),Sk.builtin.SystemExit=Sk.abstr.buildNativeClass("SystemExit",{constructor:function(...n){Sk.builtin.BaseException.apply(this,n)},base:Sk.builtin.BaseException}),Sk.exportSymbol("Sk.builtin.SystemExit",Sk.builtin.SystemExit),Sk.builtin.TypeError=Sk.abstr.buildNativeClass("TypeError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.TypeError",Sk.builtin.TypeError),Sk.builtin.ValueError=Sk.abstr.buildNativeClass("ValueError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.ValueError",Sk.builtin.ValueError),Sk.builtin.ZeroDivisionError=Sk.abstr.buildNativeClass("ZeroDivisionError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.builtin.TimeLimitError=Sk.abstr.buildNativeClass("TimeLimitError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.TimeLimitError",Sk.builtin.TimeLimitError),Sk.builtin.IOError=Sk.abstr.buildNativeClass("IOError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.IOError",Sk.builtin.IOError),Sk.builtin.NotImplementedError=Sk.abstr.buildNativeClass("NotImplementedError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.NotImplementedError",Sk.builtin.NotImplementedError),Sk.builtin.NegativePowerError=Sk.abstr.buildNativeClass("NegativePowerError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.NegativePowerError",Sk.builtin.NegativePowerError),Sk.builtin.ExternalError=Sk.abstr.buildNativeClass("ExternalError",{constructor:function(...n){if(this.nativeError=n[0],!Sk.builtin.checkString(this.nativeError)&&(n[0]=this.nativeError.toString(),n[0].startsWith("RangeError: Maximum call")))return n[0]="Maximum call stack size exceeded",new Sk.builtin.RecursionError(...n);Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.ExternalError",Sk.builtin.ExternalError),Sk.builtin.RecursionError=Sk.abstr.buildNativeClass("RecursionError",{constructor:function(...n){Sk.builtin.RuntimeError.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.RecursionError",Sk.builtin.RecursionError),Sk.builtin.OperationError=Sk.abstr.buildNativeClass("OperationError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.OperationError",Sk.builtin.OperationError),Sk.builtin.SystemError=Sk.abstr.buildNativeClass("SystemError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.SystemError",Sk.builtin.SystemError),Sk.builtin.UnicodeDecodeError=Sk.abstr.buildNativeClass("UnicodeDecodeError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.UnicodeDecodeError",Sk.builtin.UnicodeDecodeError),Sk.builtin.UnicodeEncodeError=Sk.abstr.buildNativeClass("UnicodeEncodeError",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.UnicodeEncodeError",Sk.builtin.UnicodeEncodeError),Sk.builtin.StopIteration=Sk.abstr.buildNativeClass("StopIteration",{constructor:function(...n){Sk.builtin.Exception.apply(this,n)},base:Sk.builtin.Exception}),Sk.exportSymbol("Sk.builtin.StopIteration",Sk.builtin.StopIteration),Sk.builtin.getExcInfo=function(t){var n=[t.ob$type||Sk.builtin.none.none$,t,Sk.builtin.none.none$];return new Sk.builtin.tuple(n)}}),"./src/ffi.js":(function(Y,y){Sk.ffi=Sk.ffi||{},Sk.ffi.remapToPy=function(t){var n,a,i,r;if(t===null||typeof t>"u")return Sk.builtin.none.none$;if(t.ob$type||t instanceof Sk.misceval.Suspension)return t;if(Object.prototype.toString.call(t)==="[object Array]"){for(r=[],i=0;i<t.length;++i)r.push(Sk.ffi.remapToPy(t[i]));return new Sk.builtin.list(r)}if(typeof t=="object"){a=[];for(n in t)a.push(Sk.ffi.remapToPy(n)),a.push(Sk.ffi.remapToPy(t[n]));return new Sk.builtin.dict(a)}if(typeof t=="string")return new Sk.builtin.str(t);if(typeof t=="number")return Sk.builtin.assk$(t);if(typeof t=="boolean")return new Sk.builtin.bool(t);if(typeof t>"u")return Sk.builtin.none.none$;if(typeof t=="function")return new Sk.builtin.func(t);Sk.asserts.fail("unhandled remap type "+typeof t)},Sk.exportSymbol("Sk.ffi.remapToPy",Sk.ffi.remapToPy),Sk.ffi.remapToJs=function(t){var n,a,i;if(t instanceof Sk.builtin.dict)return i={},t.$items().forEach(([r,o])=>{a=Sk.ffi.remapToJs(r),i[a]=Sk.ffi.remapToJs(o)}),i;if(t instanceof Sk.builtin.list||t instanceof Sk.builtin.tuple){for(i=[],n=0;n<t.v.length;++n)i.push(Sk.ffi.remapToJs(t.v[n]));return i}else return t instanceof Sk.builtin.bool?!!t.v:t instanceof Sk.builtin.int_||t instanceof Sk.builtin.float_||t instanceof Sk.builtin.lng?Sk.builtin.asnum$(t):typeof t=="number"||typeof t=="boolean"||typeof t=="string"?t:t===void 0?void 0:t.v},Sk.exportSymbol("Sk.ffi.remapToJs",Sk.ffi.remapToJs),Sk.ffi.callback=function(t){return t===void 0?t:function(){return Sk.misceval.apply(t,void 0,void 0,void 0,Array.prototype.slice.call(arguments,0))}},Sk.exportSymbol("Sk.ffi.callback",Sk.ffi.callback),Sk.ffi.stdwrap=function(t,n){var a=new t;return a.v=n,a},Sk.exportSymbol("Sk.ffi.stdwrap",Sk.ffi.stdwrap),Sk.ffi.basicwrap=function(t){if(t instanceof Sk.builtin.int_||t instanceof Sk.builtin.float_||t instanceof Sk.builtin.lng)return Sk.builtin.asnum$(t);if(typeof t=="number"||typeof t=="boolean")return t;if(typeof t=="string")return new Sk.builtin.str(t);Sk.asserts.fail("unexpected type for basicwrap")},Sk.exportSymbol("Sk.ffi.basicwrap",Sk.ffi.basicwrap),Sk.ffi.unwrapo=function(t){if(t!==void 0)return t.v},Sk.exportSymbol("Sk.ffi.unwrapo",Sk.ffi.unwrapo),Sk.ffi.unwrapn=function(t){return t===null?null:t.v},Sk.exportSymbol("Sk.ffi.unwrapn",Sk.ffi.unwrapn)}),"./src/file.js":(function(Y,y){Sk.builtin.file=function(t,n,a){var i,r;if(!(this instanceof Sk.builtin.file))return new Sk.builtin.file(t,n,a);if(this.mode=n,this.name=Sk.ffi.remapToJs(t),this.closed=!1,this.name==="/dev/stdout")this.data$=Sk.builtin.none.none$,this.fileno=1;else if(this.name==="/dev/stdin")this.fileno=0;else if(this.name==="/dev/stderr")this.fileno=2;else{if(Sk.inBrowser)if(this.fileno=10,r=document.getElementById(t.v),r==null)if(n.v=="w"||n.v=="a")this.data$="";else throw new Sk.builtin.IOError("[Errno 2] No such file or directory: '"+t.v+"'");else r.nodeName.toLowerCase()=="textarea"?this.data$=r.value:this.data$=r.textContent;else this.fileno=11,this.data$=Sk.read(t.v);this.lineList=this.data$.split(`
`),this.lineList=this.lineList.slice(0,-1);for(i in this.lineList)this.lineList[i]=this.lineList[i]+`
`;this.currentLine=0}return this.pos$=0,Sk.fileopen&&this.fileno>=10&&Sk.fileopen(this),this},Sk.abstr.setUpInheritance("file",Sk.builtin.file,Sk.builtin.object),Sk.abstr.setUpBuiltinMro(Sk.builtin.file),Sk.builtin.file.prototype.$r=function(){return new Sk.builtin.str("<"+(this.closed?"closed":"open")+"file '"+this.name+"', mode '"+Sk.ffi.remapToJs(this.mode)+"'>")},Sk.builtin.file.prototype.tp$iter=function(){var t=this.lineList,n=this.currentLine,a={tp$iter:function(){return a},$obj:this,$index:n,$lines:t,tp$iternext:function(){if(!(a.$index>=a.$lines.length))return new Sk.builtin.str(a.$lines[a.$index++])}};return a},Sk.abstr.setUpSlots(Sk.builtin.file),Sk.builtin.file.prototype.__enter__=new Sk.builtin.func(function(n){return n}),Sk.builtin.file.prototype.__exit__=new Sk.builtin.func(function(n){return Sk.misceval.callsimArray(Sk.builtin.file.prototype.close,[n])}),Sk.builtin.file.prototype.close=new Sk.builtin.func(function(n){return n.closed=!0,Sk.builtin.none.none$}),Sk.builtin.file.prototype.flush=new Sk.builtin.func(function(n){}),Sk.builtin.file.prototype.fileno=new Sk.builtin.func(function(n){return this.fileno}),Sk.builtin.file.prototype.isatty=new Sk.builtin.func(function(n){return!1}),Sk.builtin.file.prototype.read=new Sk.builtin.func(function(n,a){var i,r=n.data$.length,o;if(n.closed)throw new Sk.builtin.ValueError("I/O operation on closed file");return a===void 0?o=r:o=Sk.ffi.remapToJs(a),i=new Sk.builtin.str(n.data$.substr(n.pos$,o)),a===void 0?n.pos$=r:n.pos$+=Sk.ffi.remapToJs(a),n.pos$>=r&&(n.pos$=r),i}),Sk.builtin.file.$readline=function(t,n,a){if(t.fileno===0){var i,r,o=Sk.ffi.remapToJs(a);return o=o||"",i=Sk.inputfun(o),i instanceof Promise||i&&typeof i.then=="function"?(r=new Sk.misceval.Suspension,r.resume=function(){if(r.data.error)throw r.data.error;return new Sk.builtin.str(r.data.result)},r.data={type:"Sk.promise",promise:i},r):new Sk.builtin.str(i)}else{var p="";return t.currentLine<t.lineList.length&&(p=t.lineList[t.currentLine],t.currentLine++),new Sk.builtin.str(p)}},Sk.builtin.file.prototype.readline=new Sk.builtin.func(function(n,a){return Sk.builtin.file.$readline(n,a,void 0)}),Sk.builtin.file.prototype.readlines=new Sk.builtin.func(function(n,a){if(n.fileno===0)return new Sk.builtin.NotImplementedError("readlines ins't implemented because the web doesn't support Ctrl+D");var i,r=[];for(i=n.currentLine;i<n.lineList.length;i++)r.push(new Sk.builtin.str(n.lineList[i]));return new Sk.builtin.list(r)}),Sk.builtin.file.prototype.seek=new Sk.builtin.func(function(n,a,i){var r=Sk.ffi.remapToJs(a);return i===void 0&&(i=0),i===0?n.pos$=r:(i==1||i==2)&&(n.pos$=n.data$.length+r),Sk.builtin.none.none$}),Sk.builtin.file.prototype.tell=new Sk.builtin.func(function(n){return Sk.ffi.remapToPy(n.pos$)}),Sk.builtin.file.prototype.truncate=new Sk.builtin.func(function(n,a){Sk.asserts.fail()}),Sk.builtin.file.prototype.write=new Sk.builtin.func(function(n,a){var i=Sk.ffi.remapToJs(n.mode);if(i==="w"||i==="wb"||i==="a"||i==="ab")if(Sk.filewrite){if(n.closed)throw new Sk.builtin.ValueError("I/O operation on closed file");n.fileno===1?Sk.output(Sk.ffi.remapToJs(a)):Sk.filewrite(n,a)}else n.fileno===1?Sk.output(Sk.ffi.remapToJs(a)):Sk.asserts.fail();else throw new Sk.builtin.IOError("File not open for writing");return Sk.builtin.none.none$}),Sk.exportSymbol("Sk.builtin.file",Sk.builtin.file)}),"./src/filter.js":(function(Y,y){Sk.builtin.filter_=Sk.abstr.buildIteratorClass("filter",{constructor:function(n,a){this.$func=n,this.$iterable=a},iternext(t){let n=Sk.misceval.iterFor(this.$iterable,a=>Sk.misceval.chain(this.check$filter(a),i=>i?new Sk.misceval.Break(i):void 0));return t?n:Sk.misceval.retryOptionalSuspensionOrThrow(n)},slots:{tp$doc:`Return an iterator yielding those items of iterable for which function(item)
is true. If function is None, return the items that are true.`,tp$new(t,n){let[a,i]=Sk.abstr.copyKeywordsToNamedArgs("filter",["predicate","iterable"],t,n,[]);if(a=Sk.builtin.checkNone(a)?null:a,i=Sk.abstr.iter(i),this===Sk.builtin.filter_.prototype)return new Sk.builtin.filter_(a,i);{let r=new this.constructor;return Sk.builtin.filter_.call(r,a,i),r}}},proto:{check$filter(t){let n;return this.$func===null?n=t:n=Sk.misceval.callsimOrSuspendArray(this.$func,[t]),Sk.misceval.chain(n,a=>Sk.misceval.isTrue(a)?t:void 0)}}}),Sk.exportSymbol("Sk.builtin.filter_",Sk.builtin.filter_)}),"./src/float.js":(function(Y,y){var t;let n=Object.create(null,{Infinity:{value:314159},"-Infinity":{value:-314159},NaN:{value:0}});Sk.builtin.float_=Sk.abstr.buildNativeClass("float",{constructor:function(F){if(Sk.asserts.assert(this instanceof Sk.builtin.float_,"bad call to float use 'new'"),typeof F=="number")this.v=F;else if(F===void 0)this.v=0;else if(typeof F=="string")this.v=parseFloat(F);else{if(F.nb$float)return F.nb$float();Sk.asserts.fail("bad argument to float constructor")}},slots:{tp$gettattr:Sk.generic.getAttr,tp$as_number:!0,tp$doc:"Convert a string or number to a floating point number, if possible.",tp$hash(){let B=this.v,F=n[B];return F!==void 0||(Number.isInteger(B)?F=this.nb$int().tp$hash():F=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER-Number.MAX_SAFE_INTEGER/2),n[this.v]=F),F},$r(){return new Sk.builtin.str(this.str$(10,!0))},tp$new(B,F){if(F&&F.length)throw new Sk.builtin.TypeError("float() takes no keyword arguments");if(B&&B.length>1)throw new Sk.builtin.TypeError("float expected at most 1 arguments, got "+B.length);let s=B[0],v;if(s===void 0?v=new Sk.builtin.float_(0):s.nb$float?v=s.nb$float():Sk.builtin.checkString(s)&&(v=r(s.v)),v===void 0)throw new Sk.builtin.TypeError("float() argument must be a string or a number");if(this===Sk.builtin.float_.prototype)return v;{let N=new this.constructor;return N.v=v.v,N}},nb$int(){let B=this.v;if(B<0?B=Math.ceil(B):B=Math.floor(B),!Number.isInteger(B))throw new Sk.builtin.ValueError("cannot convert float "+Sk.misceval.objectRepr(this)+" to integer");return Sk.builtin.int_.withinThreshold(B)?new Sk.builtin.int_(B):new Sk.builtin.int_(JSBI.BigInt(B))},nb$float:o,nb$long(){return new Sk.builtin.lng(this.nb$int().v)},nb$add:p((B,F)=>new Sk.builtin.float_(B+F)),nb$subtract:p((B,F)=>new Sk.builtin.float_(B-F)),nb$reflected_subtract:p((B,F)=>new Sk.builtin.float_(F-B)),nb$multiply:p((B,F)=>new Sk.builtin.float_(B*F)),nb$divide:p(T),nb$reflected_divide:p((B,F)=>T(F,B)),nb$floor_divide:p(A),nb$reflected_floor_divide:p((B,F)=>A(F,B)),nb$remainder:p(S),nb$reflected_remainder:p((B,F)=>S(F,B)),nb$divmod:p((B,F)=>new Sk.builtin.tuple([A(B,F),S(B,F)])),nb$reflected_divmod:p((B,F)=>new Sk.builtin.tuple([A(F,B),S(F,B)])),nb$power:w(O),nb$reflected_power:w((B,F)=>O(F,B)),nb$abs(){return new Sk.builtin.float_(Math.abs(this.v))},nb$negative(){return new Sk.builtin.float_(-this.v)},nb$positive(){return new Sk.builtin.float_(this.v)},nb$bool(){return this.v!==0},nb$isnegative(){return this.v<0},nb$ispositive(){return this.v>=0},ob$eq:p((B,F)=>B==F),ob$ne:p((B,F)=>B!=F),ob$gt:p((B,F)=>B>F),ob$ge:p((B,F)=>B>=F),ob$lt:p((B,F)=>B<F),ob$le:p((B,F)=>B<=F)},getsets:{real:{$get:o,$doc:"the real part of a complex number"},imag:{$get(){return new Sk.builtin.float_(0)},$doc:"the imaginary part of a complex number"}},methods:{conjugate:{$meth:o,$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return self, the complex conjugate of any float."},__trunc__:{$meth(){return this.nb$int()},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return the Integral closest to x between 0 and x."},__round__:{$meth(B){return this.round$(B)},$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, ndigits=None, /)",$doc:`Return the Integral closest to x, rounding half toward even.

When an argument is passed, work like built-in round(x, ndigits).`},is_integer:{$meth(){return new Sk.builtin.bool(Number.isInteger(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return True if the float is an integer."},__getnewargs__:{$meth(){return new Sk.builtin.tuple([this])},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:Sk.builtin.none.none$},__format__:{$meth:Sk.formatting.mkNumber__format__(!0),$flags:{OneArg:!0},$textsig:"($self, format_spec, /)",$doc:Sk.builtin.none.none$}}});let a=/_[eE]|[eE]_|\._|_\.|[+-]_|__/,i=/_(?=[^_])/g;function r(B){let F,s=B;if(B.indexOf("_")!==-1){if(a.test(B))throw new Sk.builtin.ValueError("could not convert string to float: '"+B+"'");s=B.charAt(0)+B.substring(1).replace(i,"")}if(B.match(/^-inf$/i)?F=-1/0:B.match(/^[+]?inf$/i)?F=1/0:B.match(/^[-+]?nan$/i)?F=NaN:isNaN(s)||(F=parseFloat(s),Number.isNaN(F)&&(F=void 0)),F===void 0)throw new Sk.builtin.ValueError("could not convert string to float: "+Sk.misceval.objectRepr(new Sk.builtin.str(B)));return new Sk.builtin.float_(F)}function o(){return new Sk.builtin.float_(this.v)}Sk.builtin.float_.PyFloat_Check=function(B){return B===void 0?!1:!!(Sk.builtin.checkNumber(B)||Sk.builtin.checkFloat(B)||B.ob$type.$isSubType(Sk.builtin.float_))},Sk.builtin.float_.prototype.toFixed=function(B){return B=Sk.builtin.asnum$(B),this.v.toFixed(B)};function p(B){return function(F){let s=this.v,v=F.v;if(typeof v!="number")if(JSBI.__isBigInt(v))v=D(v);else return Sk.builtin.NotImplemented.NotImplemented$;return B(s,v)}}function w(B){let F=p(B);return function(s,v){if(v!==void 0&&!Sk.builtin.checkNone(v))throw new Sk.builtin.TypeError("pow() 3rd argument not allowed unless all arguments are integers");return F.call(this,s)}}function T(B,F){if(F===0)throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");return B===1/0?F===1/0||B===-1/0?new Sk.builtin.float_(NaN):F<0?new Sk.builtin.float_(-1/0):new Sk.builtin.float_(1/0):B===-1/0?F===1/0||B===-1/0?new Sk.builtin.float_(NaN):F<0?new Sk.builtin.float_(1/0):new Sk.builtin.float_(-1/0):new Sk.builtin.float_(B/F)}function A(B,F){if(B===1/0||B===-1/0)return new Sk.builtin.float_(NaN);if(F===0)throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");return F===1/0?B<0?new Sk.builtin.float_(-1):new Sk.builtin.float_(0):F===-1/0?B<0||B!==0?new Sk.builtin.float_(0):new Sk.builtin.float_(-1):new Sk.builtin.float_(Math.floor(B/F))}function S(B,F){if(F===0)throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");if(B===0)return new Sk.builtin.float_(0);if(F===1/0)return B===1/0||this.v===-1/0?new Sk.builtin.float_(NaN):B>0?new Sk.builtin.float_(B):new Sk.builtin.float_(1/0);let s=B%F;return B<0?F>0&&s<0&&(s=s+F):F<0&&s!==0&&(s=s+F),s===0&&(F<0?s=-0:1/0/s===-1/0&&(s=0)),new Sk.builtin.float_(s)}function O(B,F){if(B<0&&F%1!==0)throw new Sk.builtin.ValueError("negative number cannot be raised to a fractional power");if(B===0&&F<0)throw new Sk.builtin.ZeroDivisionError("0.0 cannot be raised to a negative power");let s=Math.pow(B,F);if(Math.abs(s)===1/0&&Math.abs(B)!==1/0&&Math.abs(F)!==1/0)throw new Sk.builtin.OverflowError("Numerical result out of range");return new Sk.builtin.float_(s)}Sk.builtin.float_.prototype.round$=function(B){var F,s,v,N,h,c,l;return v=Sk.builtin.asnum$(this),B===void 0?l=0:l=Sk.misceval.asIndexSized(B),Sk.__future__.bankers_rounding?(N=v*Math.pow(10,l),h=Math.round(N),c=(N>0?N:-N)%1===.5?h%2===0?h:h-1:h,F=c/Math.pow(10,l),B===void 0?new Sk.builtin.int_(F):new Sk.builtin.float_(F)):(s=Math.pow(10,l),F=Math.round(v*s)/s,new Sk.builtin.float_(F))},Sk.builtin.float_.prototype.str$=function(B,F){var s,v,N,h,c;if(isNaN(this.v))return"nan";if(F===void 0&&(F=!0),this.v==1/0)return"inf";if(this.v==-1/0&&F)return"-inf";if(this.v==-1/0&&!F)return"inf";if(c=F?this.v:Math.abs(this.v),B===void 0||B===10){if(Sk.__future__.python3?h=c.toPrecision(16):h=c.toPrecision(12),N=h.indexOf("."),v=c.toString().slice(0,N),s=c.toString().slice(N),v.match(/^-?0$/)&&s.slice(1).match(/^0{4,}/)&&(h.length<12?h=c.toExponential():h=c.toExponential(11)),h.indexOf("e")<0&&h.indexOf(".")>=0){for(;h.charAt(h.length-1)=="0";)h=h.substring(0,h.length-1);h.charAt(h.length-1)=="."&&(h=h+"0")}h=h.replace(new RegExp("\\.0+e"),"e","i"),h=h.replace(/(e[-+])([1-9])$/,"$10$2"),h=h.replace(/0+(e.*)/,"$1")}else h=c.toString(B);return this.v===0&&1/this.v===-1/0&&(h="-"+h),h.indexOf(".")<0&&h.indexOf("E")<0&&h.indexOf("e")<0&&(h=h+".0"),h},Sk.builtin.float_.py2$methods={};function D(B){let F=parseFloat(JSBI.toNumber(B));if(F==1/0||F==-1/0)throw new Sk.builtin.OverflowError("int too large to convert to float");return F}}),"./src/formatting.js":(function(Y,y){let t=/^(?:(.)?([<\>\=\^]))?([\+\-\s])?(#)?(0)?(\d+)?(,)?(?:\.(\d+))?([bcdeEfFgGnosxX%])?$/,n={FILL_CHAR:1,FILL_ALIGN:2,SIGN:3,ALT_FORM:4,ZERO_PAD:5,FIELD_WIDTH:6,COMMA:7,PRECISION:8,CONVERSION_TYPE:9};Sk.formatting={};let a=function(T,A,S,O){if(Sk.asserts.assert(typeof A=="string"),T[n.FIELD_WIDTH]){let D=parseInt(T[n.FIELD_WIDTH],10),B=T[n.FILL_CHAR]||(T[n.ZERO_PAD]?"0":" "),F=T[n.FILL_ALIGN]||(T[n.ZERO_PAD]?"=":O?">":"<"),s=D-(A.length+(S?S.length:0));if(s<=0)return A;let v=B.repeat(s);switch(F){case"=":if(T[n.CONVERSION_TYPE]==="s")throw new Sk.builtin.ValueError("'=' alignment not allowed in string format specifier");return S+v+A;case">":return v+S+A;case"<":return S+A+v;case"^":let N=Math.floor(s/2);return v.substring(0,N)+S+A+v.substring(N)}}return S+A},i=function(T,A){return A?"-":T[n.SIGN]==="+"?"+":T[n.SIGN]===" "?" ":""},r=function(T,A,S){if(Sk.asserts.assert(A instanceof Sk.builtin.int_||A instanceof Sk.builtin.lng),T[n.PRECISION])throw new Sk.builtin.ValueError("Precision not allowed in integer format");let O=A.str$(S,!1),D=A.nb$isnegative(),B=i(T,D);if(T[n.ALT_FORM]&&(S===16?B+="0x":S===8?B+="0o":S===2&&(B+="0b")),T[n.CONVERSION_TYPE]==="X"&&(O=O.toUpperCase()),T[n.CONVERSION_TYPE]==="n")O=(+O).toLocaleString();else if(T[n.COMMA]){var F=O.toString().split(".");F[0]=F[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),O=F.join(".")}return a(T,O,B,!0)},o=function(T,A,S){if(!A)return T.str$(10,!0);let O=A.match(t);if(!O)throw new Sk.builtin.ValueError("Invalid format specifier");let D=O[n.CONVERSION_TYPE];if(D||(D=S?"g":"d"),(S?"fFeEgG%":"bcdoxXnfFeEgG%").indexOf(D)==-1)throw new Sk.builtin.ValueError("Unknown format code '"+O[n.CONVERSION_TYPE]+"' for object of type '"+Sk.abstr.typeName(T)+"'");switch(D){case"d":case"n":return r(O,T,10);case"x":case"X":return r(O,T,16);case"o":return r(O,T,8);case"b":return r(O,T,2);case"c":{if(O[n.SIGN])throw new Sk.builtin.ValueError("Sign not allowed with integer format specifier 'c'");if(O[n.ALT_FORM])throw new Sk.builtin.ValueError("Alternate form not allowed with integer format specifier 'c'");if(O[n.COMMA])throw new Sk.builtin.ValueError("Cannot specify ',' with 'c'");if(O[n.PRECISION])throw new Sk.builtin.ValueError("Cannot specify ',' with 'c'");return a(O,String.fromCodePoint(Sk.builtin.asnum$(T)),"",!0)}case"f":case"F":case"e":case"E":case"g":case"G":{if(O[n.ALT_FORM])throw new Sk.builtin.ValueError("Alternate form (#) not allowed in float format specifier");let s=Sk.builtin.asnum$(T);if(typeof s=="string"&&(s=Number(s)),s===1/0)return a(O,"inf","",!0);if(s===-1/0)return a(O,"inf","-",!0);if(isNaN(s))return a(O,"nan","",!0);let v=!1;s<0&&(s=-s,v=!0);let N=["toExponential","toFixed","toPrecision"]["efg".indexOf(D.toLowerCase())],h=O[n.PRECISION]?parseInt(O[n.PRECISION],10):6,c=s[N](h);if("EFG".indexOf(D)!==-1&&(c=c.toUpperCase()),D.toLowerCase()==="g"||!O[n.CONVERSION_TYPE]){let l=c.match(/\.(\d*[1-9])?(0+)$/);if(l){let[d,_,E]=l;c=c.slice(0,_?-E.length:-(E.length+1))}c.indexOf(".")==-1&&!O[n.CONVERSION_TYPE]&&(c+=".0")}if(D.toLowerCase()==="e"&&(c=c.replace(/^([-+]?[0-9]*\.?[0-9]+[eE][-+]?)([0-9])?$/,"$10$2")),O[n.COMMA]){var F=c.toString().split(".");F[0]=F[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),c=F.join(".")}return a(O,c,i(O,v),!0)}case"%":{if(O[n.ALT_FORM])throw new Sk.builtin.ValueError("Alternate form (#) not allowed with format specifier '%'");let s=Sk.builtin.asnum$(T);if(typeof s=="string"&&(s=Number(s)),s===1/0)return a(O,"inf%","",!0);if(s===-1/0)return a(O,"inf%","-",!0);if(isNaN(s))return a(O,"nan%","",!0);let v=!1;s<0&&(s=-s,v=!0);let N=O[n.PRECISION]?parseInt(O[n.PRECISION],10):6,h=(s*100).toFixed(N)+"%";return a(O,h,i(O,v),!0)}default:throw new Sk.builtin.ValueError("Unknown format code '"+O[n.CONVERSION_TYPE]+"'")}};Sk.formatting.mkNumber__format__=T=>function(A){if(!Sk.builtin.checkString(A))throw new Sk.builtin.TypeError("format() argument 2 must be str, not "+Sk.abstr.typeName(A));return new Sk.builtin.str(o(this,A.$jsstr(),T))};function p(T){if(!Sk.builtin.checkString(T))throw new Sk.builtin.TypeError("format() argument 2 must be str, not "+Sk.abstr.typeName(T));let A=T.$jsstr().match(t);if(A[n.CONVERSION_TYPE]&&A[n.CONVERSION_TYPE]!=="s")throw new Sk.builtin.ValueError("Unknown format code '"+A[n.CONVERSION_TYPE]+"' for object of type 'str'");if(A[n.SIGN])throw new Sk.builtin.ValueError("Sign not allowed in string format specifier");if(A[n.ALT_FORM])throw new Sk.builtin.ValueError("Alternate form (#) not allowed with string format specifier");if(A[n.COMMA])throw new Sk.builtin.ValueError("Cannot specify ',' with 's'");let S=this.v;return A[n.PRECISION]&&(S=S.substring(0,A[n.PRECISION])),new Sk.builtin.str(a(A,S,"",!1))}function w(T,A){A=A||[];let S={},O=/{(((?:\d+)|(?:\w+))?((?:\.(\w+))|(?:\[((?:\d+)|(?:\w+))\])?))?(?:\!([rs]))?(?:\:([^}]*))?}/g;for(let s=0;s<A.length;s+=2)S[A[s]]=A[s+1];for(let s in T)S[s]=T[s];let D=0;function B(s,v,N,h,c,l,d,_,E,b){let R;if(l!==void 0&&l!==""){let f=S[N];f.constructor===Array?R=f[l]:/^\d+$/.test(l)?R=Sk.abstr.objectGetItem(f,new Sk.builtin.int_(parseInt(l,10)),!1):R=Sk.abstr.objectGetItem(f,new Sk.builtin.str(l),!1),D++}else c!==void 0&&c!==""?R=Sk.abstr.gattr(S[N||D++],new Sk.builtin.str(c)):N!==void 0&&N!==""?R=S[N]:v===void 0||v===""?(R=S[D],D++):(v instanceof Sk.builtin.int_||v instanceof Sk.builtin.float_||v instanceof Sk.builtin.lng||/^\d+$/.test(v))&&(R=S[v],D++);if(d==="s")R=new Sk.builtin.str(R);else if(d==="r")R=Sk.builtin.repr(R);else if(d!==""&&d!==void 0)throw new Sk.builtin.ValueError("Unknown conversion specifier "+d);return Sk.abstr.objectFormat(R,new Sk.builtin.str(_)).$jsstr()}let F=this.v.replace(O,B);return new Sk.builtin.str(F)}Sk.formatting.format=w,Sk.formatting.formatString=p}),"./src/function.js":(function(Y,y){Sk.builtin.func=Sk.abstr.buildNativeClass("function",{constructor:function(a,i,r,o){if(Sk.asserts.assert(this instanceof Sk.builtin.func,"builtin func should be called as a class with `new`"),this.func_code=a,this.func_globals=i||null,this.$name=a.co_name&&a.co_name.v||a.name||"<native JS>",this.$d=Sk.builtin.dict?new Sk.builtin.dict:void 0,this.$doc=a.co_docstring||Sk.builtin.none.none$,this.$module=Sk.globals&&Sk.globals.__name__||Sk.builtin.none.none$,this.$qualname=a.co_qualname&&a.co_qualname.v||this.$name,o!==void 0)for(let p in o)r[p]=o[p];this.func_closure=r,this.$memoiseFlags(),this.memoised=a.co_fastcall||null,a.co_fastcall?this.tp$call=a.bind(this):this.tp$call=Sk.builtin.func.prototype.tp$call.bind(this)},slots:{tp$getattr:Sk.generic.getAttr,tp$descr_get(n,a){return n===null?this:new Sk.builtin.method(this,n)},$r(){return new Sk.builtin.str("<function "+this.$qualname+">")},tp$call(n,a){if(this.memoised||(this.$memoiseFlags(),this.memoised=!0),this.co_argcount===void 0&&this.co_varnames===void 0&&!this.co_kwargs&&!this.func_closure){if(a&&a.length!==0)throw new Sk.builtin.TypeError(this.$name+"() takes no keyword arguments");return this.func_code.apply(this.func_globals,n)}let i=this.$resolveArgs(n,a);return this.func_closure&&i.push(this.func_closure),this.func_code.apply(this.func_globals,i)}},getsets:{__name__:{$get(){return new Sk.builtin.str(this.$name)},$set(n){if(!Sk.builtin.checkString(n))throw new Sk.builtin.TypeError("__name__ must be set to a string object");this.$name=n.$jsstr()}},__qualname__:{$get(){return new Sk.builtin.str(this.$qualname)},$set(n){if(!Sk.builtin.checkString(n))throw new Sk.builtin.TypeError("__qualname__ must be set to a string object");this.$qualname=n.$jsstr()}},__dict__:Sk.generic.getSetDict,__defaults__:{$get(){return new Sk.builtin.tuple(this.$defaults)}},__doc__:{$get(){return this.$doc},$set(n){this.$doc=n||Sk.builtin.none.none$}}},proto:{$memoiseFlags(){this.co_varnames=this.func_code.co_varnames,this.co_argcount=this.func_code.co_argcount,this.co_argcount===void 0&&this.co_varnames&&(this.co_argcount=this.co_argcount=this.co_varnames.length),this.co_kwonlyargcount=this.func_code.co_kwonlyargcount||0,this.co_varargs=this.func_code.co_varargs,this.co_kwargs=this.func_code.co_kwargs,this.$defaults=this.func_code.$defaults||[],this.$kwdefs=this.func_code.$kwdefs||[]},$resolveArgs:t}});function t(n,a){let i=this.co_argcount;i===void 0&&(i=this.co_varnames?this.co_varnames.length:n.length);let r=this.co_varnames||[],o=this.co_kwonlyargcount||0,p=i+o;if(o===0&&!this.co_kwargs&&(!a||a.length===0)&&!this.co_varargs){if(n.length==i)return n;if(n.length===0&&this.$defaults&&this.$defaults.length===i){for(let S=0;S!=this.$defaults.length;S++)n[S]=this.$defaults[S];return n}}let w;this.co_kwargs&&(w=[]);let T=n.length,A=n.length<=i?n:n.slice(0,i);if(this.co_varargs){let S=n.length>A.length?n.slice(A.length):[];A[p]=new Sk.builtin.tuple(S)}else if(T>i)throw new Sk.builtin.TypeError(this.$name+"() takes "+i+" positional argument"+(i==1?"":"s")+" but "+T+(T==1?" was ":" were ")+" given");if(a){if(this.func_code.no_kw)throw new Sk.builtin.TypeError(this.$name+"() takes no keyword arguments");for(let S=0;S<a.length;S+=2){let O=a[S],D=a[S+1],B=r.indexOf(O);if(B>=0){if(A[B]!==void 0)throw new Sk.builtin.TypeError(this.$name+"() got multiple values for argument '"+O+"'");A[B]=D}else if(w)w.push(new Sk.builtin.str(O),D);else throw new Sk.builtin.TypeError(this.$name+"() got an unexpected keyword argument '"+O+"'")}}{let S=this.$defaults||[],O=0,D=[],B=!1,F=i-S.length;for(;O<F;O++)A[O]===void 0&&(D.push(r[O]),r[O]===void 0&&(B=!0));if(D.length!=0&&(this.co_argcount||this.co_varnames))throw new Sk.builtin.TypeError(this.$name+"() missing "+D.length+" required argument"+(D.length==1?"":"s")+(B?"":": "+D.join(", ")));for(;O<i;O++)A[O]===void 0&&(A[O]=S[O-F])}if(o>0){let S=[],O=this.$kwdefs;for(let D=i;D<p;D++)A[D]===void 0&&(O[D-i]!==void 0?A[D]=O[D-i]:S.push(r[D]));if(S.length!==0)throw new Sk.builtin.TypeError(this.$name+"() missing "+S.length+" required keyword argument"+(S.length==1?"":"s")+": "+S.join(", "))}if(this.func_closure&&r)for(let S=A.length;S<r.length;S++)A.push(void 0);return w&&A.unshift(w),A}}),"./src/generator.js":(function(Y,y){Sk.builtin.generator=Sk.abstr.buildIteratorClass("generator",{constructor:function(n,a,i,r,o){var p,w;if(n){if(!(this instanceof Sk.builtin.generator))throw new TypeError("bad internal call to generator, use 'new'");if(this.func_code=n,this.func_globals=a||null,this.gi$running=!1,this.gi$resumeat=0,this.gi$sentvalue=void 0,this.gi$locals={},this.gi$cells={},i.length>0)for(w=0;w<n.co_varnames.length;++w)this.gi$locals[n.co_varnames[w]]=i[w];if(o!==void 0)for(p in o)r[p]=o[p];this.func_closure=r}},slots:{$r(){return new Sk.builtin.str("<generator object "+this.func_code.co_name.v+">")}},iternext(t,n){var a,i,r=this;return this.gi$running=!0,n===void 0&&(n=Sk.builtin.none.none$),this.gi$sentvalue=n,i=[this],this.func_closure&&i.push(this.func_closure),a=this.func_code.apply(this.func_globals,i),(function o(p){if(p instanceof Sk.misceval.Suspension){if(t)return new Sk.misceval.Suspension(o,p);p=Sk.misceval.retryOptionalSuspensionOrThrow(p)}if(r.gi$running=!1,Sk.asserts.assert(p!==void 0),p!==Sk.builtin.none.none$)r.gi$resumeat=p[0],p=p[1];else return;return p})(a)},methods:{send:{$meth(t){return this.tp$iternext(!0,t)},$flags:{OneArg:!0},$doc:`send(arg) -> send 'arg' into generator,
return next yielded value or raise StopIteration.`}}}),Sk.exportSymbol("Sk.builtin.generator",Sk.builtin.generator),Sk.builtin.makeGenerator=function(t,n){var a,i=new Sk.builtin.generator(null,null,null);i.tp$iternext=t;for(a in n)n.hasOwnProperty(a)&&(i[a]=n[a]);return i},Sk.exportSymbol("Sk.builtin.makeGenerator",Sk.builtin.makeGenerator)}),"./src/generic.js":(function(Y,y){Sk.generic={};var t,n;Sk.generic.getAttr=function(i,r){let o,p=this.ob$type,w=p.$typeLookup(i);if(w!==void 0&&(o=w.tp$descr_get,o!==void 0&&w.tp$descr_set!==void 0))return o.call(w,this,p,r);let T=this.$d;if(T!==void 0){let A=T.quick$lookup(i);if(A!==void 0)return A}if(o!==void 0)return o.call(w,this,p,r);if(w!==void 0)return w},Sk.exportSymbol("Sk.generic.getAttr",Sk.generic.getAttr),Sk.generic.setAttr=function(i,r,o){let p=this.ob$type.$typeLookup(i);if(p!=null){let T=p.tp$descr_set;if(T)return T.call(p,this,r,o)}let w=this.$d;if(w!==void 0){if(w.mp$ass_subscript){if(r!==void 0)return w.mp$ass_subscript(i,r);try{return w.mp$ass_subscript(i)}catch(T){throw T instanceof Sk.builtin.KeyError?new Sk.builtin.AttributeError("'"+Sk.abstr.typeName(this)+"' object has no attribute '"+i.$jsstr()+"'"):T}}else if(typeof w=="object"){let T=i.$mangled;if(r!==void 0){w[T]=r;return}else if(w[T]!==void 0){delete w[T];return}}}throw new Sk.builtin.AttributeError(this.sk$attrError()+" has no attribute '"+i.$jsstr()+"'")},Sk.exportSymbol("Sk.generic.setAttr",Sk.generic.setAttr),Sk.generic.new=function(a){return function(o,p){if(this.constructor===a)return new this.constructor;{let w=new this.constructor;return a.call(w),w}}},Sk.generic.newMethodDef={$meth(a,i){let r,o,p=this.prototype;if(a.length<1)throw r=p.tp$name,new Sk.builtin.TypeError(r+".__new__(): not enough arguments");let w=a.shift();if(w.sk$type===void 0)throw r=p.tp$name,new Sk.builtin.TypeError(r+"__new__(X): X is not a type object ("+Sk.abstr.typeName(w)+")");if(!w.$isSubType(this))throw r=p.tp$name,o=w.prototype.tp$name,new Sk.builtin.TypeError(r+".__new__("+o+"): "+o+" is not a subtype of "+r);let T=w.prototype.sk$staticNew.prototype;if(T.tp$new!==p.tp$new){r=p.tp$name,o=w.prototype.tp$name;let A=T.tp$name;throw new Sk.builtin.TypeError(r+".__new__("+o+") is not safe, use "+A+".__new__()")}return p.tp$new.call(w.prototype,a,i)},$flags:{FastCall:!0},$textsig:"($type, *args, **kwargs)",$name:"__new__"},Sk.generic.selfIter=function(){return this},Sk.generic.iterNextWithArrayCheckSize=function(){if(this.$seq.length!==this.$orig.get$size()){let i=this.tp$name.split("_")[0];throw new Sk.builtin.RuntimeError(i+" changed size during iteration")}else if(this.$index>=this.$seq.length)return;return this.$seq[this.$index++]},Sk.generic.iterNextWithArray=function(){let i=this.$seq[this.$index++];return i===void 0&&(this.tp$iternext=()=>{}),i},Sk.generic.iterLengthHintWithArrayMethodDef={$meth:function(){return new Sk.builtin.int_(this.$seq.length-this.$index)},$flags:{NoArgs:!0}},Sk.generic.iterReverseLengthHintMethodDef={$meth:function(){return new Sk.builtin.int_(this.$index)},$flags:{NoArgs:!0}},Sk.generic.getSetDict={$get(){return this.$d},$set(a){if(a===void 0)this.$d=new Sk.builtin.dict;else if(a instanceof Sk.builtin.dict)this.$d=a;else throw new Sk.builtin.TypeError("__dict__ must be set to a dictionary, not a '"+Sk.abstr.typeName(a)+"'")},$doc:"dictionary for instance variables (if defined)",$name:"__dict__"},Sk.generic.seqCompare=function(a,i){if(this===a&&Sk.misceval.opAllowsEquality(i))return!0;if(!(a instanceof this.sk$builtinBase))return Sk.builtin.NotImplemented.NotImplemented$;let r=this.v,o=a.v,p;if(r.length!==o.length&&(i==="Eq"||i==="NotEq"))return i!=="Eq";for(p=0;p<r.length&&p<o.length&&(r[p]===o[p]||Sk.misceval.richCompareBool(r[p],o[p],"Eq"));++p);let w=r.length,T=o.length;if(p>=w||p>=T)switch(i){case"Lt":return w<T;case"LtE":return w<=T;case"Eq":return w===T;case"NotEq":return w!==T;case"Gt":return w>T;case"GtE":return w>=T;default:Sk.asserts.fail()}return i==="Eq"?!1:i==="NotEq"?!0:Sk.misceval.richCompareBool(r[p],o[p],i)}}),"./src/import.js":(function(Y,y){Sk.sysmodules=new Sk.builtin.dict([]),Sk.realsyspath=void 0,Sk.importSearchPathForName=function(t,n,a){var i,r,o=[],p=t.replace(/\./g,"/"),w,T,A=function(S,O){return Sk.misceval.chain(Sk.misceval.tryCatch(function(){return Sk.read(S)},function(D){}),function(D){if(D!==void 0)return new Sk.misceval.Break({filename:S,code:D,packagePath:O})})};return a===void 0&&(a=Sk.realsyspath),Sk.misceval.iterFor(a.tp$iter(),function(S){return Sk.misceval.chain(A(S.v+"/"+p+n,!1),function(O){return O||A(S.v+"/"+p+"/__init__"+n,S.v+"/"+p)})})},Sk.importSetUpPath=function(t){var n,a;if(!Sk.realsyspath){for(a=[new Sk.builtin.str("src/builtin"),new Sk.builtin.str("src/lib"),new Sk.builtin.str(".")],n=0;n<Sk.syspath.length;++n)a.push(new Sk.builtin.str(Sk.syspath[n]));Sk.realsyspath=new Sk.builtin.list(a)}},Sk.importModuleInternal_=function(t,n,a,i,r,o,p){var w,T,A,S,O,D,B,F=null,s=r!==void 0?r.tp$getattr(Sk.builtin.str.$name):void 0,v=s!==void 0?s.v+".":"",N=r!==void 0?r.tp$getattr(Sk.builtin.str.$path):void 0;if(Sk.importSetUpPath(p),r&&!s){if(o)return;throw new Sk.builtin.ValueError("Attempted to import relative to invalid package (no name)")}return a===void 0&&(a=v+t),O=t.split("."),O.length>1&&(A=O.slice(0,O.length-1).join("."),F=Sk.importModuleInternal_(A,n,void 0,void 0,r,o,p)),D=Sk.misceval.chain(F,function(h){return F=h,T=Sk.sysmodules.quick$lookup(new Sk.builtin.str(a)),T!==void 0?F||T:Sk.misceval.chain(void 0,function(){var c,l,d,_=t,E;if(O.length>1){if(!F)return;S=Sk.sysmodules.mp$subscript(new Sk.builtin.str(v+A)),_=O[O.length-1],N=S.tp$getattr(Sk.builtin.str.$path)}return B=new Sk.builtin.module,typeof i=="string"?(w=t+".py",l=Sk.compile(i,w,"exec",p)):l=Sk.misceval.chain(void 0,function(){if(Sk.onBeforeImport&&typeof Sk.onBeforeImport=="function")return Sk.onBeforeImport(t)},function(b){if(b===!1)throw new Sk.builtin.ImportError("Importing "+t+" is not allowed");if(typeof b=="string")throw new Sk.builtin.ImportError(b);return Sk.importSearchPathForName(_,".js",N)},function(b){return b?{funcname:"$builtinmodule",code:b.code,filename:b.filename,packagePath:b.packagePath}:Sk.misceval.chain(Sk.importSearchPathForName(_,".py",N),function(R){if(b=R,b)return Sk.compile(b.code,b.filename,"exec",p)},function(R){if(R)return R.packagePath=b.packagePath,R})}),l},function(c){var l,d,_;if(c)return Sk.sysmodules.mp$ass_subscript(new Sk.builtin.str(a),B),B.$js=c.code,l=c.code,w==null&&(w=c.filename),(Sk.dateSet==null||!Sk.dateSet)&&(l=`Sk.execStart = Sk.lastYield = new Date();
`+c.code,Sk.dateSet=!0),n&&(d=function(E){var b,R,f,$,k=Sk.js_beautify(E),m=k.split(`
`);for($=1;$<=m.length;++$){for(f=(""+$).length,R="",b=f;b<5;++b)R+=" ";m[$-1]="/* "+R+$+" */ "+m[$-1]}return m.join(`
`)},l=d(l),Sk.debugout(l)),l+=`
`+c.funcname+";",_=Sk.global.eval(l),B.$d={__name__:new Sk.builtin.str(a),__doc__:Sk.builtin.none.none$,__package__:c.packagePath?new Sk.builtin.str(a):A?new Sk.builtin.str(v+A):s||Sk.builtin.none.none$},c.packagePath&&(B.$d.__path__=new Sk.builtin.tuple([new Sk.builtin.str(c.packagePath)])),_(B.$d)},function(c){var l;if(c===void 0){if(o&&!F)return;throw new Sk.builtin.ImportError("No module named "+t)}if(c!==B.$d){for(l in B.$d)c[l]||(c[l]=B.$d[l]);B.$d=c}if(Sk.onAfterImport&&typeof Sk.onAfterImport=="function")try{Sk.onAfterImport(t)}catch{}return F?(S.tp$setattr(new Sk.builtin.str(O[O.length-1]),B),F):(r&&r.tp$setattr(new Sk.builtin.str(t),B),B)})}),p?D:Sk.misceval.retryOptionalSuspensionOrThrow(D)},Sk.importModule=function(t,n,a){return Sk.importModuleInternal_(t,n,void 0,void 0,void 0,!1,a)},Sk.importMain=function(t,n,a){return Sk.dateSet=!1,Sk.filesLoaded=!1,Sk.sysmodules=new Sk.builtin.dict([]),Sk.realsyspath=void 0,Sk.resetCompiler(),Sk.importModuleInternal_(t,n,"__main__",void 0,void 0,!1,a)},Sk.importMainWithBody=function(t,n,a,i){return Sk.dateSet=!1,Sk.filesLoaded=!1,Sk.sysmodules=new Sk.builtin.dict([]),Sk.realsyspath=void 0,Sk.resetCompiler(),Sk.importModuleInternal_(t,n,"__main__",a,void 0,!1,i)},Sk.importBuiltinWithBody=function(t,n,a,i){return Sk.importModuleInternal_(t,n,"__builtin__."+t,a,void 0,!1,i)},Sk.builtin.__import__=function(t,n,a,i,r){var o=Sk.globals,p,w,T;if(r===void 0&&(r=Sk.__future__.absolute_import?0:-1),r!==0&&n.__package__&&n.__package__!==Sk.builtin.none.none$){if(w=n.__package__.v,w&&r>0){if(T=w.split("."),r-1>=T.length)throw new Sk.builtin.ValueError("Attempted relative import beyond toplevel package");T.length-=r-1,w=T.join(".")}p=Sk.sysmodules.quick$lookup(new Sk.builtin.str(w))}if(r>0&&p===void 0)throw new Sk.builtin.ValueError("Attempted relative import in non-package");var A=t.split("."),S=A[0];return Sk.misceval.chain(void 0,function(){if(r!==0&&p!==void 0)return t===""?p:Sk.importModuleInternal_(t,void 0,w+"."+t,void 0,p,r==-1,!0)},function(O){return O===void 0?(p=void 0,w=void 0,Sk.importModuleInternal_(t,void 0,void 0,void 0,void 0,!1,!0)):O},function(O){if(!i||i.length===0)return O;var D,B,F,s;for(F=Sk.sysmodules.mp$subscript(new Sk.builtin.str((w||"")+(w&&t?".":"")+t)),D=0;D<i.length;D++)B=i[D],B!="*"&&F.tp$getattr(new Sk.builtin.str(B))===void 0&&(s=Sk.misceval.chain(s,Sk.importModuleInternal_.bind(null,B,void 0,void 0,void 0,F,!0,!0)));return Sk.misceval.chain(s,function(){return Sk.asserts.assert(F),F})},function(O){return o!==Sk.globals&&(Sk.globals=o),O})},Sk.importStar=function(t,n,a){var i=t.tp$getattr(new Sk.builtin.str("__all__"));if(i)for(let r=Sk.abstr.iter(i),o=r.tp$iternext();o!==void 0;o=r.tp$iternext())n[o.v]=Sk.abstr.gattr(t,o);else{let r=Object.getOwnPropertyNames(t.$d);for(let o in r)r[o].charAt(0)!="_"&&(n[r[o]]=t.$d[r[o]])}},Sk.exportSymbol("Sk.importMain",Sk.importMain),Sk.exportSymbol("Sk.importMainWithBody",Sk.importMainWithBody),Sk.exportSymbol("Sk.importBuiltinWithBody",Sk.importBuiltinWithBody),Sk.exportSymbol("Sk.builtin.__import__",Sk.builtin.__import__),Sk.exportSymbol("Sk.importStar",Sk.importStar)}),"./src/int.js":(function(Y,y){Sk.builtin.int_=Sk.abstr.buildNativeClass("int",{constructor:function(v){Sk.asserts.assert(this instanceof Sk.builtin.int_,"bad call to int use 'new'");let N;if(typeof v=="number"||JSBI.__isBigInt(v))N=v;else if(v===void 0)N=0;else if(typeof v=="string")N=A(v);else{if(v.nb$int)return v.nb$int();Sk.asserts.fail("bad argument to int constructor")}this.v=N},slots:{tp$as_number:!0,tp$doc:`int(x=0) -> integer
int(x, base=10) -> integer

Convert a number or string to an integer, or return 0 if no arguments
are given.  If x is a number, return x.__int__().  For floating point
numbers, this truncates towards zero.

If x is not a number or if base is given, then x must be a string,
bytes, or bytearray instance representing an integer literal in the
given base.  The literal can be preceded by '+' or '-' and be surrounded
by whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.
Base 0 means to interpret the base from the string as an integer literal.
>>> int('0b100', base=0)
4`,$r(){return new Sk.builtin.str(this.v.toString())},tp$hash(){let s=this.v;return typeof s=="number"?s:JSBI.toNumber(JSBI.remainder(s,JSBI.__MAX_SAFE))},tp$new(s,v){let N,h;if(s.length+(v?v.length:0)===1?(N=s[0],h=Sk.builtin.none.none$):(s=Sk.abstr.copyKeywordsToNamedArgs("int",[null,"base"],s,v,[new Sk.builtin.int_(0),Sk.builtin.none.none$]),N=s[0],h=s[1]),N=O(N,h),this===Sk.builtin.int_.prototype)return N;{let c=new this.constructor;return c.v=N.v,c}},tp$getattr:Sk.generic.getAttr,ob$eq:n((s,v)=>s==v,JSBI.equal),ob$ne:n((s,v)=>s!=v,JSBI.notEqual),ob$gt:n((s,v)=>s>v,JSBI.greaterThan),ob$ge:n((s,v)=>s>=v,JSBI.greaterThanOrEqual),ob$lt:n((s,v)=>s<v,JSBI.lessThan),ob$le:n((s,v)=>s<=v,JSBI.lessThanOrEqual),nb$int:i,nb$index(){return this.v},nb$float(){let s=this.v;if(typeof s=="number")return new Sk.builtin.float_(s);{let v=parseFloat(JSBI.toNumber(s));if(v===1/0||v===-1/0)throw new Sk.builtin.OverflowError("int too large to convert to float");return new Sk.builtin.float_(v)}},nb$isnegative(){let s=this.v;return typeof s=="number"?s<0:JSBI.lessThan(s,JSBI.__ZERO)},nb$ispositive(){let s=this.v;return typeof s=="number"?s<0:JSBI.greaterThanOrEqual(s,JSBI.__ZERO)},nb$bool(){return this.v!==0},nb$positive:i,nb$negative:a(s=>-s,JSBI.unaryMinus),nb$add:t((s,v)=>s+v,(s,v)=>JSBI.numberIfSafe(JSBI.add(s,v))),nb$subtract:t((s,v)=>s-v,(s,v)=>JSBI.numberIfSafe(JSBI.subtract(s,v))),nb$multiply:t((s,v)=>s*v,JSBI.multiply),nb$divide(s){return Sk.__future__.division?this.nb$float().nb$divide(s):this.nb$floor_divide(s)},nb$floor_divide:r((s,v)=>Math.floor(s/v),JSBI.divide),nb$remainder:r((s,v)=>s-Math.floor(s/v)*v,JSBI.remainder),nb$divmod(s){let v=this.nb$floor_divide(s),N=this.nb$remainder(s);return v===Sk.builtin.NotImplemented.NotImplemented$||N===Sk.builtin.NotImplemented.NotImplemented$?Sk.builtin.NotImplemented.NotImplemented$:new Sk.builtin.tuple([v,N])},nb$and:p((s,v)=>s&v,JSBI.bitwiseAnd),nb$or:p((s,v)=>s|v,JSBI.bitwiseOr),nb$xor:p((s,v)=>s^v,JSBI.bitwiseXor),nb$abs:a(Math.abs,s=>JSBI.lessThan(s,JSBI.__ZERO)?JSBI.unaryMinus(s):s),nb$lshift:o((s,v)=>{if(v<53){let N=s*2*B[v];return T(N)?N:void 0}},JSBI.leftShift),nb$rshift:o((s,v)=>{let N=s>>v;return s>0&&N<0?N&Math.pow(2,32-v)-1:N},(s,v)=>JSBI.numberIfSafe(JSBI.signedRightShift(s,v))),nb$invert:a(s=>~s,JSBI.bitwiseNot),nb$power(s,v){let N;if(v!==void 0&&Sk.builtin.checkNone(v)&&(v=void 0),s instanceof Sk.builtin.int_&&(v===void 0||v instanceof Sk.builtin.int_)){let h=this.v,c=s.v;if(typeof h=="number"&&typeof c=="number"){let l=Math.pow(h,c);if(T(l)&&(N=c<0?new Sk.builtin.float_(l):new Sk.builtin.int_(l),v===void 0))return N}if(v!==void 0){if(s.nb$isnegative())throw new Sk.builtin.ValueError("pow() 2nd argument cannot be negative when 3rd argument specified");if(v.v===0)throw new Sk.builtin.ValueError("pow() 3rd argument cannot be 0");return N!==void 0?N.nb$remainder(v):new Sk.builtin.int_(JSBI.powermod(S(h),S(c),S(v.v)))}return new Sk.builtin.int_(JSBI.exponentiate(S(h),S(c)))}return Sk.builtin.NotImplemented.NotImplemented$},nb$long(){return new Sk.builtin.lng(this.v)}},getsets:{real:{$get:i,$doc:"the real part of a complex number"},imag:{$get(){return new Sk.builtin.int_(0)},$doc:"the imaginary part of a complex number"}},methods:{conjugate:{$meth:i,$flags:{NoArgs:!0},$textsig:null,$doc:"Returns self, the complex conjugate of any int."},bit_length:{$meth(){return new Sk.builtin.int_(Sk.builtin.bin(this).sq$length()-2)},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Number of bits necessary to represent self in binary.

>>> bin(37)
'0b100101'
>>> (37).bit_length()
6`},to_bytes:{$meth(){throw new Sk.builtin.NotImplementedError("Not yet implemented in Skulpt")},$flags:{FastCall:!0},$textsig:"($self, /, length, byteorder, *, signed=False)",$doc:`Return an array of bytes representing an integer.

  length
    Length of bytes object to use.  An OverflowError is raised if the
    integer is not representable with the given number of bytes.
  byteorder
    The byte order used to represent the integer.  If byteorder is 'big',
    the most significant byte is at the beginning of the byte array.  If
    byteorder is 'little', the most significant byte is at the end of the
    byte array.  To request the native byte order of the host system, use
    \`sys.byteorder' as the byte order value.
  signed
    Determines whether two's complement is used to represent the integer.
    If signed is False and a negative integer is given, an OverflowError
    is raised.`},__trunc__:{$meth:i,$flags:{NoArgs:!0},$textsig:null,$doc:"Truncating an Integral returns itself."},__floor__:{$meth:i,$flags:{NoArgs:!0},$textsig:null,$doc:"Flooring an Integral returns itself."},__ceil__:{$meth:i,$flags:{NoArgs:!0},$textsig:null,$doc:"Ceiling of an Integral returns itself."},__round__:{$meth(s){return this.round$(s)},$flags:{MinArgs:0,MaxArgs:1},$textsig:null,$doc:`Rounding an Integral returns itself.
Rounding with an ndigits argument also returns an integer.`},__getnewargs__:{$meth(){return new Sk.builtin.tuple([new Sk.builtin.int_(this.v)])},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:Sk.builtin.none.none$},__format__:{$meth:Sk.formatting.mkNumber__format__(!1),$flags:{OneArg:!0},$textsig:"($self, format_spec, /)",$doc:Sk.builtin.none.none$}},proto:{str$(s,v){let N;return s===void 0||s===10?N=this.v.toString():N=this.v.toString(s),v||v===void 0||N[0]==="-"&&(N=N.substring(1)),N},round$(s){s===void 0?s=0:s=Sk.misceval.asIndexSized(s);let v=this.v,N=Math.pow(10,-s),h;if(s>0)return new Sk.builtin.int_(v);if(typeof v=="number"&&Sk.__future__.bankers_rounding){let c=v/N,l=Math.round(c),_=((c>0?c:-c)%1===.5?l%2===0?l:l-1:l)*N;return new Sk.builtin.int_(_)}else{if(typeof v=="number")return new Sk.builtin.int_(Math.round(v/N)*N);{let c=JSBI.BigInt(N*10),l=JSBI.BigInt(10);h=JSBI.divide(v,c);let d=JSBI.divide(h,l),_=JSBI.subtract(h,JSBI.multiply(l,d));return JSBI.toNumber(_)<5?h=JSBI.multiply(JSBI.multiply(d,l),c):JSBI.multiply(JSBI.multiply(JSBI.add(d,JSBI.BigInt(1),l),c)),new Sk.builtin.int_(h)}}}}}),Sk.exportSymbol("Sk.builtin.int_",Sk.builtin.int_);function t(s,v){function N(h){if(h instanceof Sk.builtin.int_){let c=this.v,l=h.v;if(typeof c=="number"&&typeof l=="number"){let d=s(c,l);if(T(d))return new Sk.builtin.int_(d)}return c=S(c),l=S(l),new Sk.builtin.int_(v(c,l))}return Sk.builtin.NotImplemented.NotImplemented$}return N}function n(s,v){return function(N){if(N instanceof Sk.builtin.int_){let h=this.v,c=N.v;return typeof h=="number"&&typeof c=="number"?s(h,c):(h=S(h),c=S(c),v(h,c))}return Sk.builtin.NotImplemented.NotImplemented$}}function a(s,v){function N(){let h=this.v;return typeof h=="number"?new Sk.builtin.int_(s(h)):new Sk.builtin.int_(v(h))}return N}function i(){return new Sk.builtin.int_(this.v)}function r(s,v){return function(N){if(N instanceof Sk.builtin.int_){let h=this.v,c=N.v;if(c===0)throw new Sk.builtin.ZeroDivisionError("integer division or modulo by zero");return typeof h=="number"&&typeof c=="number"?new Sk.builtin.int_(s(h,c)):(h=S(h),c=S(c),new Sk.builtin.int_(JSBI.numberIfSafe(v(h,c))))}return Sk.builtin.NotImplemented.NotImplemented$}}function o(s,v){return function(N){if(N instanceof Sk.builtin.int_){let h=this.v,c=N.v;if(h===0)return new Sk.builtin.int_(this.v);if(typeof c=="number"){if(c<0)throw new Sk.builtin.ValueError("negative shift count");if(typeof h=="number"){let l=s(h,c);if(l!==void 0)return new Sk.builtin.int_(l)}c=JSBI.BigInt(c)}else if(JSBI.lessThan(JSBI.BigInt(0)))throw new Sk.builtin.ValueError("negative shift count");return h=S(h),new Sk.builtin.int_(v(h,c))}return Sk.builtin.NotImplemented.NotImplemented$}}function p(s,v){return function(N){if(N instanceof Sk.builtin.int_){let h=this.v,c=N.v;if(typeof h=="number"&&typeof c=="number"){let l=s(h,c);return l<0&&(l=l+4294967296),new Sk.builtin.int_(l)}return h=S(h),c=S(c),new Sk.builtin.int_(JSBI.numberIfSafe(v(h,c)))}return Sk.builtin.NotImplemented.NotImplemented$}}let w=/_(?=[^_])/g;Sk.str2number=function(s,v){var N=s,h=!1,c,l,d;if(s=s.replace(/^\s+|\s+$/g,""),s.charAt(0)==="-"&&(h=!0,s=s.substring(1)),s.charAt(0)==="+"&&(s=s.substring(1)),v==null&&(v=10),(v<2||v>36)&&v!==0)throw new Sk.builtin.ValueError("int() base must be >= 2 and <= 36");if(typeof v=="string"&&(v=Number(v)),s.substring(0,2).toLowerCase()==="0x"){if(v===16||v===0)s=s.substring(2),v=16;else if(v<34)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'")}else if(s.substring(0,2).toLowerCase()==="0b"){if(v===2||v===0)s=s.substring(2),v=2;else if(v<12)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'")}else if(s.substring(0,2).toLowerCase()==="0o"){if(v===8||v===0)s=s.substring(2),v=8;else if(v<25)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'")}else if(s.charAt(0)==="0"){if(s==="0")return 0;(v===8||v===0)&&(v=8)}if(v===0&&(v=10),s.indexOf("_")!==-1){if(s.indexOf("__")!==-1)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'");v!==10?s=s.replace(w,""):s=s.charAt(0)+s.substring(1).replace(w,"")}if(s.length===0)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'");for(c=0;c<s.length;c=c+1)if(l=s.charCodeAt(c),d=v,l>=48&&l<=57?d=l-48:l>=65&&l<=90?d=l-65+10:l>=97&&l<=122&&(d=l-97+10),d>=v)throw new Sk.builtin.ValueError("invalid literal for int() with base "+v+": '"+N+"'");return h&&(s="-"+s),d=parseInt(s,v),T(d)?d:D(s,v)},Sk.builtin.int_.py2$methods={},Sk.longFromStr=function(s,v){if(Sk.__future__.python3)return new Sk.builtin.int_(A(s));{let N=Sk.str2number(s,v);return new Sk.builtin.lng(N)}},Sk.exportSymbol("Sk.longFromStr",Sk.longFromStr);function T(s){return s<=Number.MAX_SAFE_INTEGER&&s>=-Number.MAX_SAFE_INTEGER}Sk.builtin.int_.withinThreshold=T;function A(s){return s<=Number.MAX_SAFE_INTEGER&&s>=-Number.MAX_SAFE_INTEGER?+s:JSBI.BigInt(s)}Sk.builtin.int_.stringToNumberOrBig=A;function S(s){return typeof s=="number"?JSBI.BigInt(s):s}function O(s,v){let N,h;if(v!==Sk.builtin.none.none$?v=Sk.misceval.asIndexOrThrow(v):v=null,s instanceof Sk.builtin.str)return v===null&&(v=10),new Sk.builtin.int_(Sk.str2number(s.v,v));if(v!==null)throw new Sk.builtin.TypeError("int() can't convert non-string with explicit base");if(s.nb$int)return s.nb$int();if(N=Sk.abstr.lookupSpecial(s,Sk.builtin.str.$trunc)){if(h=Sk.misceval.callsimArray(N,[]),!Sk.builtin.checkInt(h))throw new Sk.builtin.TypeError(Sk.builtin.str.$trunc.$jsstr()+" returned non-Integral (type "+Sk.abstr.typeName(s)+")");return new Sk.builtin.int_(h.v)}throw new Sk.builtin.TypeError("int() argument must be a string, a bytes-like object or a number, not '"+Sk.abstr.typeName(s)+"'")}function D(s,v){let N=!1;s[0]==="-"&&(N=!0,s=s.substring(1)),v=JSBI.BigInt(v);let h=JSBI.BigInt(1),c=JSBI.BigInt(0),l,d;for(let _=s.length-1;_>=0;_--)d=s.charCodeAt(_),d>=48&&d<=57?d=d-48:d>=65&&d<=90?d=d-65+10:d>=97&&d<=122&&(d=d-97+10),l=JSBI.multiply(JSBI.BigInt(d),h),c=JSBI.add(c,l),h=JSBI.multiply(h,v);return N&&(c=JSBI.multiply(c,JSBI.BigInt(-1))),c}let B=[.5,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824,2147483648,4294967296,8589934592,17179869184,34359738368,68719476736,137438953472,274877906944,549755813888,1099511627776,2199023255552,4398046511104,8796093022208,17592186044416,35184372088832,70368744177664,0x800000000000,281474976710656,562949953421312,0x4000000000000,0x8000000000000,4503599627370496,9007199254740992];Sk.builtin.lng=Sk.abstr.buildNativeClass("long",{base:Sk.builtin.int_,constructor:function(v){Sk.builtin.int_.call(this,v)},slots:{$r(){return new Sk.builtin.str(this.v.toString()+"L")},tp$as_number:!0,nb$negative(){return new Sk.builtin.lng(F.nb$negative.call(this).v)},nb$positive(){return new Sk.builtin.lng(F.nb$positive.call(this).v)}}});let F=Sk.builtin.int_.prototype}),"./src/list.js":(function(Y,y){Sk.builtin.list=Sk.abstr.buildNativeClass("list",{constructor:function(r){r===void 0?r=[]:Array.isArray(r)||(r=Sk.misceval.arrayFromIterable(r)),Sk.asserts.assert(this instanceof Sk.builtin.list,"bad call to list, use 'new' with an Array of python objects"),this.v=r,this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$hash:Sk.builtin.none.none$,tp$doc:`Built-in mutable sequence.

If no argument is given, the constructor creates a new empty list.
The argument must be an iterable if specified.`,tp$new:Sk.generic.new,tp$init(i,r){return Sk.abstr.checkNoKwargs("list",r),Sk.abstr.checkArgsLen("list",i,0,1),Sk.misceval.chain(Sk.misceval.arrayFromIterable(i[0],!0),o=>{this.v=o})},$r(){if(this.in$repr)return new Sk.builtin.str("[...]");this.in$repr=!0;let i=this.v.map(r=>Sk.misceval.objectRepr(r));return this.in$repr=!1,new Sk.builtin.str("["+i.join(", ")+"]")},tp$richcompare:Sk.generic.seqCompare,tp$iter(){return new n(this)},sq$length(){return this.v.length},sq$concat(i){if(!(i instanceof Sk.builtin.list))throw new Sk.builtin.TypeError("can only concatenate list to list");return new Sk.builtin.list(this.v.concat(i.v))},sq$contains(i){for(let r=this.tp$iter(),o=r.tp$iternext();o!==void 0;o=r.tp$iternext())if(o===i||Sk.misceval.richCompareBool(o,i,"Eq"))return!0;return!1},sq$repeat(i){if(!Sk.misceval.isIndex(i))throw new Sk.builtin.TypeError("can't multiply sequence by non-int of type '"+Sk.abstr.typeName(i)+"'");if(i=Sk.misceval.asIndexSized(i,Sk.builtin.OverflowError),i*this.v.length>Number.MAX_SAFE_INTEGER)throw new Sk.builtin.OverflowError;let r=[];for(let o=0;o<i;o++)for(let p=0;p<this.v.length;p++)r.push(this.v[p]);return new Sk.builtin.list(r)},mp$subscript(i){if(Sk.misceval.isIndex(i)){let r=Sk.misceval.asIndexSized(i,Sk.builtin.IndexError);return r=this.list$inRange(r,"list index out of range"),this.v[r]}else if(i instanceof Sk.builtin.slice){let r=[];return i.sssiter$(this.v.length,o=>{r.push(this.v[o])}),new Sk.builtin.list(r)}throw new Sk.builtin.TypeError("list indices must be integers or slices, not "+Sk.abstr.typeName(i))},mp$ass_subscript(i,r){r===void 0?this.del$subscript(i):this.ass$subscript(i,r)},sq$inplace_concat(i){return i===this?(this.v.push(...this.v),this):Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(i),r=>{this.v.push(r)}),()=>this)},sq$inplace_repeat(i){if(!Sk.misceval.isIndex(i))throw new Sk.builtin.TypeError("can't multiply sequence by non-int of type '"+Sk.abstr.typeName(i)+"'");i=Sk.misceval.asIndexSized(i,Sk.builtin.OverflowError);let r=this.v.length;if(i<=0)this.v.length=0;else if(i*r>Number.MAX_SAFE_INTEGER)throw new Sk.builtin.OverflowError;for(let o=1;o<i;o++)for(let p=0;p<r;p++)this.v.push(this.v[p]);return this}},methods:{__reversed__:{$meth(){return new a(this)},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return a reverse iterator over the list."},clear:{$meth(){return this.v.length=0,Sk.builtin.none.none$},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Remove all items from list."},copy:{$meth(){return new Sk.builtin.list(this.v.slice(0))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return a shallow copy of the list."},append:{$meth(i){return this.v.push(i),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:"($self, object, /)",$doc:"Append object to the end of the list."},insert:{$meth(i,r){i=Sk.misceval.asIndexSized(i,Sk.builtin.OverflowError);let{start:o}=Sk.builtin.slice.startEnd$wrt(this,i);return this.v.splice(o,0,r),Sk.builtin.none.none$},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($self, index, object, /)",$doc:"Insert object before index."},extend:{$meth(i){return i===this?(this.v.push(...this.v),Sk.builtin.none.none$):Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(i),r=>{this.v.push(r)}),()=>Sk.builtin.none.none$)},$flags:{OneArg:!0},$textsig:"($self, iterable, /)",$doc:"Extend list by appending elements from the iterable."},pop:{$meth(i){i===void 0?i=this.v.length-1:i=Sk.misceval.asIndexSized(i,Sk.builtin.OverflowError),i=this.list$inRange(i,"pop index out of range");let r=this.v[i];return this.v.splice(i,1),r},$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, index=-1, /)",$doc:`Remove and return item at index (default last).

Raises IndexError if list is empty or index is out of range.`},remove:{$meth(i){let r=this.list$indexOf(i);if(r===-1)throw new Sk.builtin.ValueError("list.remove(x): x not in list");return this.v.splice(r,1),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:"($self, value, /)",$doc:`Remove first occurrence of value.

Raises ValueError if the value is not present.`},sort:{$meth(i,r){if(i.length)throw new Sk.builtin.TypeError("sort() takes no positional arguments");let[o,p]=Sk.abstr.copyKeywordsToNamedArgs("sort",["key","reverse"],i,r,[Sk.builtin.none.none$,Sk.builtin.bool.false$]);return this.list$sort(void 0,o,p)},$flags:{FastCall:!0},$textsig:"($self, /, *, key=None, reverse=False)",$doc:"Stable sort *IN PLACE*."},index:{$meth(i,r,o){if(r!==void 0&&!Sk.misceval.isIndex(r)||o!==void 0&&!Sk.misceval.isIndex(o))throw new Sk.builtin.TypeError("slice indices must be integers or have an __index__ method");let p=this.list$indexOf(i,r,o);if(p===-1)throw new Sk.builtin.ValueError(Sk.misceval.objectRepr(i)+" is not in list");return new Sk.builtin.int_(p)},$flags:{MinArgs:1,MaxArgs:3},$textsig:"($self, value, start=0, stop=sys.maxsize, /)",$doc:`Return first index of value.

Raises ValueError if the value is not present.`},count:{$meth(i){let r=0,o=this.v.length;for(let p=0;p<o;p++)(this.v[p]===i||Sk.misceval.richCompareBool(this.v[p],i,"Eq"))&&(r+=1);return new Sk.builtin.int_(r)},$flags:{OneArg:!0},$textsig:"($self, value, /)",$doc:"Return number of occurrences of value."},reverse:{$meth(){return this.list$reverse(),Sk.builtin.none.none$},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Reverse *IN PLACE*."}},proto:{sk$asarray(){return this.v.slice(0)},list$sort:t,list$inRange(i,r){if(i<0&&(i+=this.v.length),i>=0&&i<this.v.length)return i;throw new Sk.builtin.IndexError(r)},list$indexOf(i,r,o){({start:r,end:o}=Sk.builtin.slice.startEnd$wrt(this,r,o));for(let p=r;p<o&&p<this.v.length;p++)if(this.v[p]===i||Sk.misceval.richCompareBool(this.v[p],i,"Eq"))return p;return-1},list$reverse(){this.v.reverse()},ass$subscript(i,r){if(Sk.misceval.isIndex(i))this.ass$index(i,r);else if(i instanceof Sk.builtin.slice){let{start:o,stop:p,step:w}=i.slice$indices(this.v.length);w===1?this.ass$slice(o,p,r):this.ass$ext_slice(i,r)}else throw new Sk.builtin.TypeError("list indices must be integers or slices, not "+Sk.abstr.typeName(i))},ass$index(i,r){let o=Sk.misceval.asIndexSized(i,Sk.builtin.IndexError);o=this.list$inRange(o,"list assignment index out of range"),this.v[o]=r},ass$slice(i,r,o){if(!Sk.builtin.checkIterable(o))throw new Sk.builtin.TypeError("can only assign an iterable");let p=Sk.misceval.arrayFromIterable(o);this.v.splice(i,r-i,...p)},ass$ext_slice(i,r){let o=[];if(i.sssiter$(this.v.length,w=>{o.push(w)}),!Sk.builtin.checkIterable(r))throw new Sk.builtin.TypeError("must assign iterable to extended slice");let p=Sk.misceval.arrayFromIterable(r);if(o.length!==p.length)throw new Sk.builtin.ValueError("attempt to assign sequence of size "+p.length+" to extended slice of size "+o.length);for(let w=0;w<o.length;w++)this.v.splice(o[w],1,p[w])},del$subscript(i){if(Sk.misceval.isIndex(i))this.del$index(i);else if(i instanceof Sk.builtin.slice){let{start:r,stop:o,step:p}=i.slice$indices(this.v.length);p===1?this.del$slice(r,o):this.del$ext_slice(i,p>0?1:0)}else throw new Sk.builtin.TypeError("list indices must be integers, not "+Sk.abstr.typeName(i))},del$index(i){let r=Sk.misceval.asIndexSized(i,Sk.builtin.IndexError);r=this.list$inRange(r,"list assignment index out of range"),this.v.splice(r,1)},del$slice(i,r){this.v.splice(i,r-i)},del$ext_slice(i,r){let o=0;i.sssiter$(this.v.length,p=>{this.v.splice(p-o,1),o+=r})}}}),Sk.exportSymbol("Sk.builtin.list",Sk.builtin.list);function t(i,r,o){let p=r!=null&&r!==Sk.builtin.none.none$,w=i!=null&&i!==Sk.builtin.none.none$,T,A;if(o===void 0)T=!1;else if(Sk.builtin.checkInt(o))T=Sk.misceval.isTrue(o);else throw new Sk.builtin.TypeError("an integer is required");let S=new Sk.builtin.timSort(this);this.v=[];let O=new Sk.builtin.int_(0);if(p){w?S.lt=function(B,F){var s=Sk.misceval.callsimArray(i,[B[0],F[0]]);return Sk.misceval.richCompareBool(s,O,"Lt")}:S.lt=function(B,F){return Sk.misceval.richCompareBool(B[0],F[0],"Lt")};for(let B=0;B<S.listlength;B++){A=S.list.v[B];let F=Sk.misceval.callsimArray(r,[A]);S.list.v[B]=[F,A]}}else w&&(S.lt=function(B,F){var s=Sk.misceval.callsimArray(i,[B,F]);return Sk.misceval.richCompareBool(s,O,"Lt")});if(T&&S.list.list$reverse(),S.sort(),T&&S.list.list$reverse(),p)for(let B=0;B<S.listlength;B++)A=S.list.v[B][1],S.list.v[B]=A;let D=this.sq$length()>0;if(this.v=S.list.v,D)throw new Sk.builtin.ValueError("list modified during sort");return Sk.builtin.none.none$}Sk.builtin.list.py2$methods={sort:{$name:"sort",$meth(i,r){let[o,p,w]=Sk.abstr.copyKeywordsToNamedArgs("sort",["cmp","key","reverse"],i,r,[Sk.builtin.none.none$,Sk.builtin.none.none$,Sk.builtin.bool.false$]);return this.list$sort(o,p,w)},$flags:{FastCall:!0},$textsig:"($self, cmp=None, key=None, reverse=False)",$doc:"Stable sort *IN PLACE*."}};var n=Sk.abstr.buildIteratorClass("list_iterator",{constructor:function(r){this.$index=0,this.$seq=r.v},iternext:Sk.generic.iterNextWithArray,methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}}),a=Sk.abstr.buildIteratorClass("list_reverseiterator",{constructor:function(r){this.$index=r.v.length-1,this.$seq=r.v},iternext(){let i=this.$seq[this.$index--];if(i===void 0){this.tp$iternext=()=>{};return}return i},methods:{__length_hint__:Sk.generic.iterReverseLengthHintMethodDef},flags:{sk$acceptable_as_base_class:!1}})}),"./src/main.js":(function(Y,y,t){t("./src/util.js"),Sk.global.strftime=t("./node_modules/strftime/strftime.js"),Sk.global.strptime=t("./support/time-helpers/strptime.js"),t("./support/polyfills/JSBI.js"),t("./node_modules/setimmediate/setImmediate.js"),t("./src/assert-dev.js"),t("./src/env.js"),t("./src/type.js"),t("./src/generic.js"),t("./src/check.js"),t("./src/abstract.js"),t("./src/object.js"),t("./src/slotdefs.js"),t("./src/descr.js"),t("./src/sk_method.js"),[Sk.builtin.object,Sk.builtin.type].forEach(n=>{Sk.abstr.setUpSlots(n),Sk.abstr.setUpMethods(n),Sk.abstr.setUpGetSets(n)}),t("./src/nonetype.js"),t("./src/formatting.js"),t("./src/str.js"),[Sk.builtin.str,Sk.builtin.none,Sk.builtin.NotImplemented,Sk.builtin.object].forEach(n=>{let a=n.prototype;a.__doc__=a.hasOwnProperty("tp$doc")?new Sk.builtin.str(a.tp$doc):Sk.builtin.none.none$}),t("./src/function.js"),t("./src/builtin.js"),t("./src/errors.js"),t("./src/method.js"),t("./src/misceval.js"),t("./src/simple_iterators.js"),t("./src/list.js"),t("./src/bytes.js"),t("./src/tuple.js"),t("./src/dict.js"),t("./src/mappingproxy.js"),t("./src/property_class_static.js"),t("./src/int.js"),t("./src/bool.js"),t("./src/float.js"),t("./src/complex.js"),t("./src/slice.js"),t("./src/set.js"),t("./src/print.js"),t("./src/module.js"),t("./src/structseq.js"),t("./src/generator.js"),t("./src/file.js"),t("./src/ffi.js"),t("./src/range.js"),t("./src/enumerate.js"),t("./src/filter.js"),t("./src/map.js"),t("./src/reversed.js"),t("./src/zip.js"),t("./src/token.js"),t("./src/tokenize.js"),t("./gen/parse_tables.js"),t("./src/parser.js"),t("./gen/astnodes.js"),t("./src/ast.js"),t("./src/symtable.js"),t("./src/compile.js"),t("./src/import.js"),t("./src/timsort.js"),t("./src/super.js"),t("./src/builtindict.js"),t("./src/constants.js")}),"./src/map.js":(function(Y,y){Sk.builtin.map_=Sk.abstr.buildIteratorClass("map",{constructor:function(n,a){this.$func=n,this.$iters=a},iternext(t){let n=[],a=Sk.misceval.chain(Sk.misceval.iterArray(this.$iters,i=>Sk.misceval.chain(i.tp$iternext(t),r=>{if(r===void 0)return new Sk.misceval.Break(!0);n.push(r)})),i=>i?void 0:Sk.misceval.callsimOrSuspendArray(this.$func,n));return t?a:Sk.misceval.retryOptionalSuspensionOrThrow(a)},slots:{tp$doc:`map(func, *iterables) --> map object

Make an iterator that computes the function using arguments from
each of the iterables.  Stops when the shortest iterable is exhausted.`,tp$new(t,n){this===Sk.builtin.map_.prototype&&Sk.abstr.checkNoKwargs("map",n),Sk.abstr.checkArgsLen("map",t,2);let a=t[0],i=[];for(let r=1;r<t.length;r++)i.push(Sk.abstr.iter(t[r]));if(this===Sk.builtin.map_.prototype)return new Sk.builtin.map_(a,i);{let r=new this.constructor;return Sk.builtin.map_.call(r,a,i),r}}}}),Sk.exportSymbol("Sk.builtin.map_",Sk.builtin.map_)}),"./src/mappingproxy.js":(function(Y,y){Sk.builtin.mappingproxy=Sk.abstr.buildNativeClass("mappingproxy",{constructor:function(a){Sk.asserts.assert(this instanceof Sk.builtin.mappingproxy,"bad call to mapping proxy, use 'new'"),this.mapping=new Sk.builtin.dict([]),a!==void 0&&t(this.mapping,a)},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$hash:Sk.builtin.none.none$,tp$new(n,a){Sk.abstr.checkNoKwargs("mappingproxy",a),Sk.abstr.checkOneArg("mappingproxy",n,a);let i=n[0];if(!Sk.builtin.checkMapping(i))throw new Sk.builtin.TypeError("mappingproxy() argument must be a mapping, not "+Sk.abstr.typeName(i));let r=new Sk.builtin.mappingproxy;return r.mapping=i,r},tp$richcompare(n,a){return Sk.misceval.richCompareBool(this.mapping,n,a)},tp$str(){return this.mapping.tp$str()},$r(){return new Sk.builtin.str("mappingproxy("+Sk.misceval.objectRepr(this.mapping)+")")},mp$subscript(n,a){return this.mapping.mp$subscript(n,a)},sq$contains(n){return this.mapping.sq$contains(n)},sq$length(){return this.mapping.sq$length()},tp$iter(){return this.mapping.tp$iter()},tp$as_number:!0,nb$or(n){return n instanceof Sk.builtin.mappingproxy&&(n=n.mapping),Sk.abstr.numberBinOp(this.mapping,n,"BitOr")},nb$reflected_or(n){return n instanceof Sk.builtin.mappingproxy&&(n=n.mapping),Sk.abstr.numberBinOp(n,this.mapping,"BitOr")},nb$inplace_or(n){throw new Sk.builtin.TypeError("'|=' is not supported by "+Sk.abstr.typeName(this)+"; use '|' instead")}},methods:{get:{$meth(n,a){return Sk.misceval.callsimArray(this.mapping.tp$getattr(this.str$get),n,a)},$flags:{FastCall:!0},$textsig:null,$doc:"D.get(k[,d]) -> D[k] if k in D, else d.  d defaults to None."},keys:{$meth(){return Sk.misceval.callsimArray(this.mapping.tp$getattr(this.str$keys),[])},$flags:{NoArgs:!0},$textsig:null,$doc:"D.keys() -> a set-like object providing a view on D's keys"},items:{$meth(){return Sk.misceval.callsimArray(this.mapping.tp$getattr(this.str$items),[])},$flags:{NoArgs:!0},$textsig:null,$doc:"D.items() -> a set-like object providing a view on D's items"},values:{$meth(){return Sk.misceval.callsimArray(this.mapping.tp$getattr(this.str$values),[])},$flags:{NoArgs:!0},$textsig:null,$doc:"D.values() -> a set-like object providing a view on D's values"},copy:{$meth(){return Sk.misceval.callsimArray(this.mapping.tp$getattr(this.str$copy),[])},$flags:{NoArgs:!0},$textsig:null,$doc:"D.copy() -> a shallow copy of D"}},proto:{str$get:new Sk.builtin.str("get"),str$copy:new Sk.builtin.str("copy"),str$keys:new Sk.builtin.str("keys"),str$items:new Sk.builtin.str("items"),str$values:new Sk.builtin.str("values"),mp$lookup(n){return this.mapping.mp$lookup(n)}},flags:{sk$acceptable_as_base_class:!1}});function t(n,a){Object.defineProperties(n,{entries:{get:()=>{let i=Object.create(null);return Object.entries(a).forEach(([r,o])=>{r=Sk.unfixReserved(r),r.includes("$")||(r=new Sk.builtin.str(r),i[r.$savedKeyHash]=[r,o])}),i},configurable:!0},size:{get:()=>Object.keys(a).map(i=>Sk.unfixReserved(i)).filter(i=>!i.includes("$")).length,configurable:!0}})}}),"./src/method.js":(function(Y,y){Sk.builtin.method=Sk.abstr.buildNativeClass("method",{constructor:function(n,a){Sk.asserts.assert(this instanceof Sk.builtin.method,"bad call to method constructor, use 'new'"),this.im_func=n,this.im_self=a,this.im_call=n.tp$call},slots:{$r(){let n=this.im_func.tp$getattr(Sk.builtin.str.$qualname)||this.im_func.tp$getattr(Sk.builtin.str.$name);return n=n&&n.v||"?",new Sk.builtin.str("<bound method "+n+" of "+Sk.misceval.objectRepr(this.im_self)+">")},tp$hash(){let t=Sk.abstr.objectHash(this.im_self),n=Sk.abstr.objectHash(this.im_func);return t+n},tp$call(t,n){var a=this.im_call;if(a===void 0)throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(this.im_func)+"' object is not callable");return t=[this.im_self,...t],a.call(this.im_func,t,n)},tp$new(t,n){Sk.abstr.checkNoKwargs("method",n),Sk.abstr.checkArgsLen("method",t,2,2);let a=t[0],i=t[1];if(!Sk.builtin.checkCallable(a))throw new Sk.builtin.TypeError("first argument must be callable");if(Sk.builtin.checkNone(i))throw new Sk.builtin.TypeError("self must not be None");return new Sk.builtin.method(a,i)},tp$richcompare(t,n){if(n!="Eq"&&n!="NotEq"||!(t instanceof Sk.builtin.method))return Sk.builtin.NotImplemented.NotImplemented$;let a;try{a=Sk.misceval.richCompareBool(this.im_self,t.im_self,"Eq",!1)&&this.im_func==t.im_func}catch{a=!1}return n=="Eq"?a:!a},tp$descr_get(t,n){return this},tp$getattr(t,n){let a=Sk.abstr.lookupSpecial(this,t);return a!==void 0?a:this.im_func.tp$getattr(t,n)}},getsets:{__func__:{$get(){return this.im_func}},__self__:{$get(){return this.im_self}},__doc__:{$get(){return this.im_func.tp$getattr(Sk.builtin.str.$doc)}}},flags:{sk$suitable_as_base_class:!1}})}),"./src/misceval.js":(function(Y,y){Sk.misceval={};var t;Sk.misceval.Suspension=function(r,o,p){this.$isSuspension=!0,r!==void 0&&o!==void 0&&(this.resume=function(){return r(o.resume())}),this.child=o,this.optional=o!==void 0&&o.optional,p===void 0&&o!==void 0?this.data=o.data:this.data=p},Sk.exportSymbol("Sk.misceval.Suspension",Sk.misceval.Suspension),Sk.misceval.retryOptionalSuspensionOrThrow=function(i,r){for(;i instanceof Sk.misceval.Suspension;){if(!i.optional)throw new Sk.builtin.SuspensionError(r||"Cannot call a function that blocks or suspends here");i=i.resume()}return i},Sk.exportSymbol("Sk.misceval.retryOptionalSuspensionOrThrow",Sk.misceval.retryOptionalSuspensionOrThrow),Sk.misceval.isIndex=function(i){return i!=null&&(i.nb$index!==void 0||typeof i=="number"&&Number.isInteger(i))},Sk.exportSymbol("Sk.misceval.isIndex",Sk.misceval.isIndex);function n(i){if(i!=null){if(i.nb$index)return i.nb$index();if(typeof i=="number"&&Number.isInteger(i))return i}}function a(i,r){let o=n(i);if(o!==void 0)return o;throw r=r||"'{tp$name}' object cannot be interpreted as an integer",r=r.replace("{tp$name}",Sk.abstr.typeName(i)),new Sk.builtin.TypeError(r)}Sk.misceval.asIndex=n,Sk.misceval.asIndexSized=function(i,r,o){let p=a(i,o);if(typeof p=="number")return p;if(r==null)return JSBI.lessThan(p,JSBI.__ZERO)?-Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER;throw new r("cannot fit '"+Sk.abstr.typeName(i)+"' into an index-sized integer")},Sk.misceval.asIndexOrThrow=a,Sk.misceval.applySlice=function(i,r,o,p){return Sk.abstr.objectGetItem(i,new Sk.builtin.slice(r,o,null),p)},Sk.exportSymbol("Sk.misceval.applySlice",Sk.misceval.applySlice),Sk.misceval.assignSlice=function(i,r,o,p,w){let T=new Sk.builtin.slice(r,o);return p===null?Sk.abstr.objectDelItem(i,T):Sk.abstr.objectSetItem(i,T,p,w)},Sk.exportSymbol("Sk.misceval.assignSlice",Sk.misceval.assignSlice),Sk.misceval.arrayFromArguments=function(i){var r,o,p,w;if(i.length!=1)return i;if(w=i[0],w instanceof Sk.builtin.set?w=w.tp$iter().$obj:w instanceof Sk.builtin.dict&&(w=Sk.builtin.dict.prototype.keys.func_code(w)),w instanceof Sk.builtin.list||w instanceof Sk.builtin.tuple)return w.v;if(Sk.builtin.checkIterable(w)){for(p=[],r=Sk.abstr.iter(w),o=r.tp$iternext();o!==void 0;o=r.tp$iternext())p.push(o);return p}throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(w)+"' object is not iterable")},Sk.exportSymbol("Sk.misceval.arrayFromArguments",Sk.misceval.arrayFromArguments),Sk.misceval.iterator=Sk.abstr.buildIteratorClass("iterator",{constructor:function(r,o){this.tp$iternext=o?r:function(p){let w=r();return p||!w.$isSuspension?w:Sk.misceval.retryOptionalSuspensionOrThrow(w)}},iternext:function(i){return this.tp$iternext(i)},flags:{sk$acceptable_as_base_class:!1}}),Sk.misceval.swappedOp_={Eq:"Eq",NotEq:"NotEq",Lt:"Gt",LtE:"GtE",Gt:"Lt",GtE:"LtE"},Sk.misceval.opSymbols={Eq:"==",NotEq:"!=",Lt:"<",LtE:"<=",Gt:">",GtE:">=",Is:"is",IsNot:"is not",In_:"in",NotIn:"not in"},Sk.misceval.richCompareBool=function(i,r,o,p){Sk.asserts.assert(i.sk$object&&r.sk$object,"JS object passed to richCompareBool");var w,T,A;let S=i.ob$type,O=r.ob$type,D=O!==S&&O.sk$baseClass===void 0&&O.$isSubType(S);if(!Sk.__future__.python3&&S!==O&&(o==="GtE"||o==="Gt"||o==="LtE"||o==="Lt")){let v=[Sk.builtin.float_,Sk.builtin.int_,Sk.builtin.lng,Sk.builtin.bool],N=[Sk.builtin.dict,Sk.builtin.enumerate,Sk.builtin.filter_,Sk.builtin.list,Sk.builtin.map_,Sk.builtin.str,Sk.builtin.tuple,Sk.builtin.zip_],h=v.indexOf(S),c=N.indexOf(S),l=v.indexOf(O),d=N.indexOf(O);if(i===Sk.builtin.none.none$)switch(o){case"Lt":return!0;case"LtE":return!0;case"Gt":return!1;case"GtE":return!1}if(r===Sk.builtin.none.none$)switch(o){case"Lt":return!1;case"LtE":return!1;case"Gt":return!0;case"GtE":return!0}if(h!==-1&&d!==-1)switch(o){case"Lt":return!0;case"LtE":return!0;case"Gt":return!1;case"GtE":return!1}if(c!==-1&&l!==-1)switch(o){case"Lt":return!1;case"LtE":return!1;case"Gt":return!0;case"GtE":return!0}if(c!==-1&&d!==-1)switch(o){case"Lt":return c<d;case"LtE":return c<=d;case"Gt":return c>d;case"GtE":return c>=d}}if(o==="Is"){if(S===O){if(i===r)return!0;if(S===Sk.builtin.float_)return i.v===r.v;if(S===Sk.builtin.int_)return typeof i.v=="number"&&typeof i.v=="number"?i.v===r.v:JSBI.equal(JSBI.BigInt(i.v),JSBI.BigInt(r.v))}return!1}if(o==="IsNot")return S!==O?!0:S===Sk.builtin.float_?i.v!==r.v:S===Sk.builtin.int_?typeof i.v=="number"&&typeof i.v=="number"?i.v!==r.v:JSBI.notEqual(JSBI.BigInt(i.v),JSBI.BigInt(r.v)):i!==r;if(o==="In")return Sk.misceval.chain(Sk.abstr.sequenceContains(r,i,p),Sk.misceval.isTrue);if(o==="NotIn")return Sk.misceval.chain(Sk.abstr.sequenceContains(r,i,p),function(v){return!Sk.misceval.isTrue(v)});var B={Eq:"ob$eq",NotEq:"ob$ne",Gt:"ob$gt",GtE:"ob$ge",Lt:"ob$lt",LtE:"ob$le"};if(A=B[o],D&&(T=B[Sk.misceval.swappedOp_[o]],r[T]!==i[T]&&(w=r[T](i))!==Sk.builtin.NotImplemented.NotImplemented$)||(w=i[A](r))!==Sk.builtin.NotImplemented.NotImplemented$||!D&&(T=B[Sk.misceval.swappedOp_[o]],(w=r[T](i))!==Sk.builtin.NotImplemented.NotImplemented$))return Sk.misceval.isTrue(w);if(!Sk.__future__.python3){let v=Sk.abstr.lookupSpecial(i,Sk.builtin.str.$cmp);if(v)try{if(w=Sk.misceval.callsimArray(v,[r]),Sk.builtin.checkNumber(w)){if(w=Sk.builtin.asnum$(w),o==="Eq")return w===0;if(o==="NotEq")return w!==0;if(o==="Lt")return w<0;if(o==="Gt")return w>0;if(o==="LtE")return w<=0;if(o==="GtE")return w>=0}if(w!==Sk.builtin.NotImplemented.NotImplemented$)throw new Sk.builtin.TypeError("comparison did not return an int")}catch{throw new Sk.builtin.TypeError("comparison did not return an int")}let N=Sk.abstr.lookupSpecial(r,Sk.builtin.str.$cmp);if(N)try{if(w=Sk.misceval.callsimArray(N,[i]),Sk.builtin.checkNumber(w)){if(w=Sk.builtin.asnum$(w),o==="Eq")return w===0;if(o==="NotEq")return w!==0;if(o==="Lt")return w>0;if(o==="Gt")return w<0;if(o==="LtE")return w>=0;if(o==="GtE")return w<=0}if(w!==Sk.builtin.NotImplemented.NotImplemented$)throw new Sk.builtin.TypeError("comparison did not return an int")}catch{throw new Sk.builtin.TypeError("comparison did not return an int")}if(i===Sk.builtin.none.none$&&r===Sk.builtin.none.none$){if(o==="Eq")return i.v===r.v;if(o==="NotEq")return i.v!==r.v;if(o==="Gt")return i.v>r.v;if(o==="GtE")return i.v>=r.v;if(o==="Lt")return i.v<r.v;if(o==="LtE")return i.v<=r.v}}if(o==="Eq")return i===r;if(o==="NotEq")return i!==r;let F=Sk.abstr.typeName(i),s=Sk.abstr.typeName(r);throw new Sk.builtin.TypeError("'"+Sk.misceval.opSymbols[o]+"' not supported between instances of '"+F+"' and '"+s+"'")},Sk.exportSymbol("Sk.misceval.richCompareBool",Sk.misceval.richCompareBool),Sk.misceval.objectRepr=function(i){if(Sk.asserts.assert(i!==void 0,"trying to repr undefined"),i!==null&&i.$r)return i.$r().v;try{return new Sk.builtin.str(i).v}catch(r){if(r instanceof Sk.builtin.TypeError)return"<unknown>";throw r}},Sk.exportSymbol("Sk.misceval.objectRepr",Sk.misceval.objectRepr),Sk.misceval.opAllowsEquality=function(i){switch(i){case"LtE":case"Eq":case"GtE":return!0}return!1},Sk.exportSymbol("Sk.misceval.opAllowsEquality",Sk.misceval.opAllowsEquality),Sk.misceval.isTrue=function(i){return i===!0||i===Sk.builtin.bool.true$?!0:i===!1||i===Sk.builtin.bool.false$||i==null?!1:i.nb$bool?i.nb$bool():i.sq$length?i.sq$length()!==0:!!i},Sk.exportSymbol("Sk.misceval.isTrue",Sk.misceval.isTrue),Sk.misceval.softspace_=!1,Sk.misceval.print_=function(i){var r;function o(p){return p===`
`||p==="	"||p==="\r"}return Sk.misceval.softspace_&&(i!==`
`&&Sk.output(" "),Sk.misceval.softspace_=!1),r=new Sk.builtin.str(i),Sk.misceval.chain(Sk.importModule("sys",!1,!0),function(p){return Sk.misceval.apply(p.$d.stdout.write,void 0,void 0,void 0,[p.$d.stdout,r])},function(){(r.v.length===0||!o(r.v[r.v.length-1])||r.v[r.v.length-1]===" ")&&(Sk.misceval.softspace_=!0)})},Sk.exportSymbol("Sk.misceval.print_",Sk.misceval.print_),Sk.misceval.loadname=function(i,r){var o,p=r[i];if(p!==void 0)return p;if(o=Sk.builtins[i],o!==void 0)return o;throw new Sk.builtin.NameError("name '"+Sk.unfixReserved(i)+"' is not defined")},Sk.exportSymbol("Sk.misceval.loadname",Sk.misceval.loadname),Sk.misceval.call=function(i,r,o,p,w){return w=Array.prototype.slice.call(arguments,4),Sk.misceval.apply(i,r,o,p,w)},Sk.exportSymbol("Sk.misceval.call",Sk.misceval.call),Sk.misceval.callAsync=function(i,r,o,p,w,T){return T=Array.prototype.slice.call(arguments,5),Sk.misceval.applyAsync(i,r,o,p,w,T)},Sk.exportSymbol("Sk.misceval.callAsync",Sk.misceval.callAsync),Sk.misceval.callOrSuspend=function(i,r,o,p,w){return w=Array.prototype.slice.call(arguments,4),Sk.misceval.applyOrSuspend(i,r,o,p,w)},Sk.exportSymbol("Sk.misceval.callOrSuspend",Sk.misceval.callOrSuspend),Sk.misceval.callsim=function(i,r){return r=Array.prototype.slice.call(arguments,1),Sk.misceval.apply(i,void 0,void 0,void 0,r)},Sk.exportSymbol("Sk.misceval.callsim",Sk.misceval.callsim),Sk.misceval.callsimArray=function(i,r,o){return r=r||[],Sk.misceval.retryOptionalSuspensionOrThrow(Sk.misceval.callsimOrSuspendArray(i,r,o))},Sk.exportSymbol("Sk.misceval.callsimArray",Sk.misceval.callsimArray),Sk.misceval.callsimAsync=function(i,r,o){return o=Array.prototype.slice.call(arguments,2),Sk.misceval.applyAsync(i,r,void 0,void 0,void 0,o)},Sk.exportSymbol("Sk.misceval.callsimAsync",Sk.misceval.callsimAsync),Sk.misceval.callsimOrSuspend=function(i,r){return r=Array.prototype.slice.call(arguments,1),Sk.misceval.applyOrSuspend(i,void 0,void 0,void 0,r)},Sk.exportSymbol("Sk.misceval.callsimOrSuspend",Sk.misceval.callsimOrSuspend),Sk.misceval.callsimOrSuspendArray=function(i,r,o){return r=r||[],i!==void 0&&i.tp$call?i.tp$call(r,o):Sk.misceval.applyOrSuspend(i,void 0,void 0,o,r)},Sk.exportSymbol("Sk.misceval.callsimOrSuspendArray",Sk.misceval.callsimOrSuspendArray),Sk.misceval.apply=function(i,r,o,p,w){var T=Sk.misceval.applyOrSuspend(i,r,o,p,w);return T instanceof Sk.misceval.Suspension?Sk.misceval.retryOptionalSuspensionOrThrow(T):T},Sk.exportSymbol("Sk.misceval.apply",Sk.misceval.apply),Sk.misceval.asyncToPromise=function(i,r){return new Promise(function(o,p){try{var w=i();(function T(A){try{for(var S=function(){try{T(A.resume())}catch(s){p(s)}},O=function(v){try{A.data.result=v,S()}catch(N){p(N)}},D=function(v){try{A.data.error=v,S()}catch(N){p(N)}};A instanceof Sk.misceval.Suspension;){var B=r&&(r[A.data.type]||r["*"]);if(B){var F=B(A);if(F){F.then(T,p);return}}if(A.data.type=="Sk.promise"){A.data.promise.then(O,D);return}else if(A.data.type=="Sk.yield"){Sk.global.setImmediate(S);return}else if(A.data.type=="Sk.delay"){Sk.global.setImmediate(S);return}else if(A.optional)A=A.resume();else throw new Sk.builtin.SuspensionError("Unhandled non-optional suspension of type '"+A.data.type+"'")}o(A)}catch(s){p(s)}})(w)}catch(T){p(T)}})},Sk.exportSymbol("Sk.misceval.asyncToPromise",Sk.misceval.asyncToPromise),Sk.misceval.applyAsync=function(i,r,o,p,w,T){return Sk.misceval.asyncToPromise(function(){return Sk.misceval.applyOrSuspend(r,o,p,w,T)},i)},Sk.exportSymbol("Sk.misceval.applyAsync",Sk.misceval.applyAsync),Sk.misceval.chain=function(i,r){for(var o=1,p=i,w,T;;){if(o==arguments.length)return p;if(p&&p.$isSuspension)break;p=arguments[o](p),o++}for(T=new Array(arguments.length-o),w=0;w<arguments.length-o;w++)T[w]=arguments[o+w];return w=0,(function A(S){for(;w<T.length;){if(S instanceof Sk.misceval.Suspension)return new Sk.misceval.Suspension(A,S);S=T[w](S),w++}return S})(p)},Sk.exportSymbol("Sk.misceval.chain",Sk.misceval.chain),Sk.misceval.tryCatch=function(i,r){var o;try{o=i()}catch(w){return r(w)}if(o instanceof Sk.misceval.Suspension){var p=new Sk.misceval.Suspension(void 0,o);return p.resume=function(){return Sk.misceval.tryCatch(o.resume,r)},p}else return o},Sk.exportSymbol("Sk.misceval.tryCatch",Sk.misceval.tryCatch),Sk.misceval.iterFor=function(i,r,o){var p=o,w=function(T){return p=T,T instanceof Sk.misceval.Break?T:i.tp$iternext(!0)};return(function T(A){for(;A!==void 0;){if(A instanceof Sk.misceval.Suspension)return new Sk.misceval.Suspension(T,A);if(A===Sk.misceval.Break||A instanceof Sk.misceval.Break)return A.brValue;A=Sk.misceval.chain(r(A,p),w)}return p})(i.tp$iternext(!0))},Sk.exportSymbol("Sk.misceval.iterFor",Sk.misceval.iterFor),Sk.misceval.iterArray=function(i,r,o){Sk.asserts.assert(Array.isArray(i),"iterArgs requires an array");let p=0;return Sk.misceval.iterFor({tp$iternext:()=>i[p++]},r,o)},Sk.misceval.arrayFromIterable=function(i,r){if(i===void 0)return[];if(i.hp$type===void 0&&i.sk$asarray!==void 0)return i.sk$asarray();let o=[],p=Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(i),w=>{o.push(w)}),()=>o);return r?p:Sk.misceval.retryOptionalSuspensionOrThrow(p)},Sk.misceval.Break=function(i){if(!(this instanceof Sk.misceval.Break))return new Sk.misceval.Break(i);this.brValue=i},Sk.exportSymbol("Sk.misceval.Break",Sk.misceval.Break),Sk.misceval.applyOrSuspend=function(i,r,o,p,w){var T,A,S;if(i==null||i===Sk.builtin.none.none$)throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(i)+"' object is not callable");if(typeof i=="function"&&i.tp$call===void 0&&(i=new Sk.builtin.func(i)),T=i.tp$call,T!==void 0){if(o)for(A=o.tp$iter(),S=A.tp$iternext();S!==void 0;S=A.tp$iternext())w.push(S);if(r)for(A=Sk.abstr.iter(r),S=A.tp$iternext();S!==void 0;S=A.tp$iternext()){if(!Sk.builtin.checkString(S))throw new Sk.builtin.TypeError("Function keywords must be strings");p.push(S.v),p.push(Sk.abstr.objectGetItem(r,S,!1))}return T.call(i,w,p,r)}if(T=i.__call__,T!==void 0)return w.unshift(i),Sk.misceval.apply(T,r,o,p,w);throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(i)+"' object is not callable")},Sk.exportSymbol("Sk.misceval.applyOrSuspend",Sk.misceval.applyOrSuspend),Sk.misceval.promiseToSuspension=function(i){var r=new Sk.misceval.Suspension;return r.resume=function(){if(r.data.error)throw r.data.error;return r.data.result},r.data={type:"Sk.promise",promise:i},r},Sk.exportSymbol("Sk.misceval.promiseToSuspension",Sk.misceval.promiseToSuspension),Sk.misceval.buildClass=function(i,r,o,p,w){var T,A=Sk.builtin.type,S=w===void 0?{}:w,O={};r(i,O,S),i.__name__&&(O.__module__=i.__name__);var D=new Sk.builtin.str(o),B=new Sk.builtin.tuple(p),F=[],s;for(s in O)O.hasOwnProperty(s)&&(F.push(new Sk.builtin.str(s)),F.push(O[s]));return F=new Sk.builtin.dict(F),T=Sk.misceval.callsimArray(A,[D,B,F]),T},Sk.exportSymbol("Sk.misceval.buildClass",Sk.misceval.buildClass)}),"./src/module.js":(function(Y,y){Sk.builtin.module=Sk.abstr.buildNativeClass("module",{constructor:function(){this.$d={}},slots:{tp$doc:`Create a module object.

The name must be a string; the optional doc argument can have any type.`,tp$getattr(t,n){let a=t.$mangled,i=this.$d[a];if(i!==void 0)return i;let r=this.ob$type.$typeLookup(t);if(r!==void 0){let p=r.tp$descr_get;return p?p.call(r,this,this.ob$type,n):r}let o=this.$d.__getattr__;if(o!==void 0){let p=Sk.misceval.tryCatch(()=>Sk.misceval.callsimOrSuspendArray(o,[t]),w=>{if(!(w instanceof Sk.builtin.AttributeError))throw w});return n?p:Sk.misceval.retryOptionalSuspensionOrThrow(p)}},tp$setattr:Sk.generic.setAttr,tp$new:Sk.generic.new,tp$init(t,n){let[a,i]=Sk.abstr.copyKeywordsToNamedArgs("module",["name","doc"],t,n,[Sk.builtin.none.none$]);Sk.builtin.pyCheckType("module","string",a),this.init$dict(a,i)},$r(){let t=this.get$name();if(t!==void 0){let a=this.get$mod_reprf();if(a!==void 0)return Sk.misceval.callsimOrSuspendArray(a,[this])}t=t===void 0?"'?'":t;let n=this.from$file();return n=n===void 0?this.empty_or$loader():n,new Sk.builtin.str("<module "+t+n+">")}},getsets:{__dict__:{$get(){return new Sk.builtin.mappingproxy(this.$d)}}},methods:{__dir__:{$meth(){let t=this.tp$getattr(Sk.builtin.str.$dict);if(!Sk.builtin.checkMapping(t))throw new Sk.builtin.TypeError("__dict__ is not a dictionary");let n=t.mp$lookup(Sk.builtin.str.$dir);return n!==void 0?Sk.misceval.callsimOrSuspendArray(n,[]):new Sk.builtin.list(Sk.misceval.arrayFromIterable(t))},$flags:{NoArgs:!0},$doc:`__dir__() -> list
specialized dir() implementation`}},proto:{init$dict(t,n){this.$d.__name__=t,this.$d.__doc__=n,this.$d.__package__=Sk.builtin.none.none$,this.$d.__spec__=Sk.builtin.none.none$,this.$d.__loader__=Sk.builtin.none.none$},sk$attrError(){let t=this.get$name();return t===void 0?"module":"module "+t},get$name(){let t=this.tp$getattr(Sk.builtin.str.$name);return t&&Sk.misceval.objectRepr(t)},from$file(){let t=this.tp$getattr(Sk.builtin.str.$file);return t&&" from "+Sk.misceval.objectRepr(t)},empty_or$loader(){if(this.$js&&this.$js.includes("$builtinmodule"))return" (built-in)";let t=this.tp$getattr(Sk.builtin.str.$loader);return t===void 0||Sk.builtin.checkNone(t)?"":" ("+Sk.misceval.objectRepr(t)+")"},get$mod_reprf(){let t=this.tp$getattr(Sk.builtin.str.$loader);return t&&t.tp$getattr(this.str$mod_repr)},str$mod_repr:new Sk.builtin.str("module_repr")}}),Sk.exportSymbol("Sk.builtin.module",Sk.builtin.module)}),"./src/nonetype.js":(function(Y,y){Sk.builtin.none=Sk.abstr.buildNativeClass("NoneType",{constructor:function(){return Sk.builtin.none.none$},slots:{tp$new(t,n){return Sk.abstr.checkNoArgs("NoneType",t,n),Sk.builtin.none.none$},$r(){return new Sk.builtin.str("None")},tp$as_number:!0,nb$bool(){return!1}},flags:{sk$acceptable_as_base_class:!1}}),Sk.builtin.none.none$=Object.create(Sk.builtin.none.prototype,{v:{value:null,enumerable:!0}}),Sk.builtin.NotImplemented=Sk.abstr.buildNativeClass("NotImplementedType",{constructor:function(){return Sk.builtin.NotImplemented.NotImplemented$},slots:{$r(){return new Sk.builtin.str("NotImplemented")},tp$new(t,n){return Sk.abstr.checkNoArgs("NotImplementedType",t,n),Sk.builtin.NotImplemented.NotImplemented$}},flags:{sk$acceptable_as_base_class:!1}}),Sk.builtin.NotImplemented.NotImplemented$=Object.create(Sk.builtin.NotImplemented.prototype,{v:{value:null,enumerable:!0}})}),"./src/object.js":(function(Y,y){let t=new Map;Sk.builtin.object=Sk.abstr.buildNativeClass("object",{constructor:function(){Sk.asserts.assert(this instanceof Sk.builtin.object,"bad call to object, use 'new'")},base:null,slots:{tp$new(n,a){if(n.length||a&&a.length){if(this.tp$new!==Sk.builtin.object.prototype.tp$new)throw new Sk.builtin.TypeError("object.__new__() takes exactly one argument (the type to instantiate)");if(this.tp$init===Sk.builtin.object.prototype.tp$init)throw new Sk.builtin.TypeError(Sk.abstr.typeName(this)+"() takes no arguments")}return new this.constructor},tp$init(n,a){if(n.length||a&&a.length){if(this.tp$init!==Sk.builtin.object.prototype.tp$init)throw new Sk.builtin.TypeError("object.__init__() takes exactly one argument (the instance to initialize)");if(this.tp$new===Sk.builtin.object.prototype.tp$new)throw new Sk.builtin.TypeError(Sk.abstr.typeName(this)+".__init__() takes exactly one argument (the instance to initialize)")}},tp$getattr:Sk.generic.getAttr,tp$setattr:Sk.generic.setAttr,$r(){let n=Sk.abstr.lookupSpecial(this,Sk.builtin.str.$module),a="";return n&&Sk.builtin.checkString(n)&&(a=n.v+"."),new Sk.builtin.str("<"+a+Sk.abstr.typeName(this)+" object>")},tp$str(){return this.$r()},tp$hash(){let n=t.get(this);return n!==void 0||(n=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER-Number.MAX_SAFE_INTEGER/2),t.set(this,n)),n},tp$richcompare(n,a){let i;switch(a){case"Eq":i=this===n||Sk.builtin.NotImplemented.NotImplemented$;break;case"NotEq":i=this.tp$richcompare(n,"Eq"),i!==Sk.builtin.NotImplemented.NotImplemented$&&(i=!Sk.misceval.isTrue(i));break;default:i=Sk.builtin.NotImplemented.NotImplemented$}return i},tp$doc:"The most base type"},getsets:{__class__:{$get(){return this.ob$type},$set(n){if(n===void 0)throw new Sk.builtin.TypeError("can't delete __class__ attribute");if(!Sk.builtin.checkClass(n))throw new Sk.builtin.TypeError("__class__ must be set to a class, not '"+Sk.abstr.typeName(n)+"' object");let a=this.ob$type,i=n;if(!(a.$isSubType(Sk.builtin.module)&&i.$isSubType(Sk.builtin.module))&&(a.sk$klass===void 0||i.sk$klass===void 0))throw new Sk.builtin.TypeError(" __class__ assignment only supported for heap types or ModuleType subclasses");if(n.prototype.sk$builtinBase!==this.sk$builtinBase)throw new Sk.builtin.TypeError("__class__ assignment: '"+Sk.abstr.typeName(this)+"' object layout differs from '"+n.prototype.tp$name+"'");Object.setPrototypeOf(this,n.prototype)},$doc:"the object's class"}},methods:{__dir__:{$meth:function(){let a=[];if(this.$d)if(this.$d instanceof Sk.builtin.dict)a=this.$d.sk$asarray();else for(let r in this.$d)a.push(new Sk.builtin.str(r));let i=Sk.misceval.callsimArray(Sk.builtin.type.prototype.__dir__,[this.ob$type]);return a.push(...i.v),i.v=a,i},$flags:{NoArgs:!0},$doc:"Default dir() implementation."},__format__:{$meth(n){let a;if(Sk.builtin.checkString(n)){if(a=Sk.ffi.remapToJs(n),a!=="")throw new Sk.builtin.NotImplementedError("format spec is not yet implemented")}else throw Sk.__future__.exceptions?new Sk.builtin.TypeError("format() argument 2 must be str, not "+Sk.abstr.typeName(n)):new Sk.builtin.TypeError("format expects arg 2 to be string or unicode, not "+Sk.abstr.typeName(n));return this.tp$str()},$flags:{OneArg:!0},$doc:"Default object formatter."}},proto:{valueOf:Object.prototype.valueOf,toString:function(){return this.tp$str().v},hasOwnProperty:Object.prototype.hasOwnProperty,hp$type:void 0,sk$attrError(){return"'"+this.tp$name+"' object"}}}),(function(){Sk.abstr.setUpInheritance("type",Sk.builtin.type,Sk.builtin.object),Sk.abstr.setUpBuiltinMro(Sk.builtin.type)})()}),"./src/parser.js":(function(Y,y){function t(i,r){return this.filename=i,this.grammar=r,this.p_flags=0,this}t.FUTURE_PRINT_FUNCTION="print_function",t.FUTURE_UNICODE_LITERALS="unicode_literals",t.FUTURE_DIVISION="division",t.FUTURE_ABSOLUTE_IMPORT="absolute_import",t.FUTURE_WITH_STATEMENT="with_statement",t.FUTURE_NESTED_SCOPES="nested_scopes",t.FUTURE_GENERATORS="generators",t.CO_FUTURE_PRINT_FUNCTION=65536,t.CO_FUTURE_UNICODE_LITERALS=131072,t.CO_FUTURE_DIVISON=8192,t.CO_FUTURE_ABSOLUTE_IMPORT=16384,t.CO_FUTURE_WITH_STATEMENT=32768,t.prototype.setup=function(i){var r,o;i=i||this.grammar.start,o={type:i,value:null,context:null,children:[]},r={dfa:this.grammar.dfas[i],state:0,node:o},this.stack=[r],this.used_names={}};function n(i,r){for(var o=i.length;o--;)if(i[o][0]===r[0]&&i[o][1]===r[1])return!0;return!1}t.prototype.addtoken=function(i,r,o){var p,w,T,A,S,O,D,B,F,s,v,N,h,c=this.classify(i,r,o);e:for(;;){for(h=this.stack[this.stack.length-1],N=h.dfa[0],v=h.dfa[1],s=N[h.state],F=0;F<s.length;++F)if(B=s[F][0],D=s[F][1],O=this.grammar.labels[B][0],S=this.grammar.labels[B][1],c===B){for(Sk.asserts.assert(O<256),this.shift(i,r,D,o),A=D;N[A].length===1&&N[A][0][0]===0&&N[A][0][1]===A;){if(this.pop(),this.stack.length===0)return!0;h=this.stack[this.stack.length-1],A=h.state,N=h.dfa[0],v=h.dfa[1]}return!1}else if(O>=256&&(T=this.grammar.dfas[O],w=T[1],w.hasOwnProperty(c))){this.push(O,this.grammar.dfas[O],D,o);continue e}if(n(s,[0,h.state])){if(this.pop(),this.stack.length===0)throw new Sk.builtin.SyntaxError("too much input",this.filename)}else throw p=o[0][0],new Sk.builtin.SyntaxError("bad input",this.filename,p,o)}},t.prototype.classify=function(i,r,o){var p;if(i===Sk.token.tokens.T_NAME&&(this.used_names[r]=!0,p=this.grammar.keywords.hasOwnProperty(r)&&this.grammar.keywords[r],r==="print"&&(this.p_flags&t.CO_FUTURE_PRINT_FUNCTION||Sk.__future__.print_function===!0)&&(p=!1),p))return p;if(p=this.grammar.tokens.hasOwnProperty(i)&&this.grammar.tokens[i],!p){let w="#"+i;for(let T in Sk.token.tokens)if(Sk.token.tokens[T]==i){w=T;break}throw new Sk.builtin.SyntaxError("bad token "+w,this.filename,o[0][0],o)}return p},t.prototype.shift=function(i,r,o,p){var w=this.stack[this.stack.length-1].dfa,T=this.stack[this.stack.length-1].state,A=this.stack[this.stack.length-1].node,S={type:i,value:r,lineno:p[0][0],col_offset:p[0][1],children:null};S&&A.children.push(S),this.stack[this.stack.length-1]={dfa:w,state:o,node:A}},t.prototype.push=function(i,r,o,p){var w=this.stack[this.stack.length-1].dfa,T=this.stack[this.stack.length-1].node,A={type:i,value:null,lineno:p[0][0],col_offset:p[0][1],children:[]};this.stack[this.stack.length-1]={dfa:w,state:o,node:T},this.stack.push({dfa:r,state:0,node:A})},t.prototype.pop=function(){var i,r=this.stack.pop(),o=r.node;o&&(this.stack.length!==0?(i=this.stack[this.stack.length-1].node,i.children.push(o)):(this.rootnode=o,this.rootnode.used_names=this.used_names))};function a(i,r){r===void 0&&(r="file_input");var o=new t(i,Sk.ParseTables);return r==="file_input"?o.setup(Sk.ParseTables.sym.file_input):Sk.asserts.fail("todo;"),o}Sk.parse=function(r,o){var p=Sk.token.tokens.T_COMMENT,w=Sk.token.tokens.T_NL,T=Sk.token.tokens.T_OP,A=Sk.token.tokens.T_ENDMARKER,S=Sk.token.tokens.T_ENCODING,O=!1,D=a(r);function B(F){var s=F.split(`
`).reverse().map(function(v){return v+`
`});return function(){if(s.length===0)throw new Sk.builtin.Exception("EOF");return s.pop()}}if(Sk._tokenize(r,B(o),"utf-8",function(F){var s=F.start[0],v=F.start[1],N=null,h,c,l;F.type===p||F.type===w||F.type===S?(h+=F.value,c=F.end[0],l=F.end[1],F.string[F.string.length-1]===`
`&&(c+=1,l=0)):(F.type===T&&(N=Sk.OpMap[F.string]),D.addtoken(N||F.type,F.string,[F.start,F.end,F.line]),F.type===A&&(O=!0))}),!O)throw new Sk.builtin.SyntaxError("incomplete input",this.filename);return{cst:D.rootnode,flags:D.p_flags}},Sk.parseTreeDump=function(r,o){var p,w;if(o=o||"",w="",w+=o,r.type>=256)for(w+=Sk.ParseTables.number2symbol[r.type]+`
`,p=0;p<r.children.length;++p)w+=Sk.parseTreeDump(r.children[p],o+"  ");else w+=Sk.token.tok_name[r.type]+": "+new Sk.builtin.str(r.value).$r().v+`
`;return w},Sk.exportSymbol("Sk.Parser",t),Sk.exportSymbol("Sk.parse",Sk.parse),Sk.exportSymbol("Sk.parseTreeDump",Sk.parseTreeDump)}),"./src/print.js":(function(Y,y){Sk.builtin.print=function(n,a){let[i,r,o]=Sk.abstr.copyKeywordsToNamedArgs("print",["sep","end","file","flush"],[],a);if(i===void 0||Sk.builtin.checkNone(i))i=" ";else if(Sk.builtin.checkString(i))i=i.$jsstr();else throw new Sk.builtin.TypeError("sep must be None or a string, not "+Sk.abstr.typeName(i));if(r===void 0||Sk.builtin.checkNone(r))r=`
`;else if(Sk.builtin.checkString(r))r=r.$jsstr();else throw new Sk.builtin.TypeError("end must be None or a string, not "+Sk.abstr.typeName(r));let p;if(o!==void 0&&!Sk.builtin.checkNone(o)&&(p=Sk.abstr.lookupSpecial(o,Sk.builtin.str.$write),p===void 0))throw new Sk.builtin.AttributeError("'"+Sk.abstr.typeName(o)+"' object has no attribute 'write'");let w=new Sk.builtin.str(n.map(T=>new Sk.builtin.str(T).toString()).join(i)+r);if(p!==void 0)Sk.misceval.callsimArray(p,[w]);else return Sk.misceval.chain(Sk.importModule("sys",!1,!0),T=>(p=Sk.abstr.lookupSpecial(T.$d.stdout,Sk.builtin.str.$write),p&&Sk.misceval.callsimOrSuspendArray(p,[w])))},Sk.builtin.print.co_fastcall=1}),"./src/property_class_static.js":(function(Y,y){Sk.builtin.property=Sk.abstr.buildNativeClass("property",{constructor:function(n,a,i,r){this.prop$get=n||Sk.builtin.none.none$,this.prop$set=a||Sk.builtin.none.none$,this.prop$del=i||Sk.builtin.none.none$,this.prop$doc=r||n&&n.$doc||Sk.builtin.none.none$},slots:{tp$getattr:Sk.generic.getAttr,tp$new:Sk.generic.new,tp$init(t,n){t=Sk.abstr.copyKeywordsToNamedArgs("property",["fget","fset","fdel","doc"],t,n,new Array(4).fill(Sk.builtin.none.none$)),this.prop$get=t[0],this.prop$set=t[1],this.prop$del=t[2],Sk.builtin.checkNone(t[3])?Sk.builtin.checkNone(t[0])||(this.prop$doc=t[0].$doc||t[3]):this.prop$doc=t[3]},tp$doc:`Property attribute.

  fget
    function to be used for getting an attribute value
  fset
    function to be used for setting an attribute value
  fdel
    function to be used for del'ing an attribute
  doc
    docstring

Typical use is to define a managed attribute x:

class C(object):
    def getx(self): return self._x
    def setx(self, value): self._x = value
    def delx(self): del self._x
    x = property(getx, setx, delx, 'I'm the 'x' property.')

Decorators make defining new properties or modifying existing ones easy:

class C(object):
    @property
    def x(self):
        'I am the 'x' property.'
        return self._x
    @x.setter
    def x(self, value):
        self._x = value
    @x.deleter
    def x(self):
        del self._x`,tp$descr_get(t,n){if(t===null)return this;if(this.prop$get===void 0)throw new Sk.builtin.AttributeError("unreadable attribute");return Sk.misceval.callsimOrSuspendArray(this.prop$get,[t])},tp$descr_set(t,n){let a;if(n==null?a=this.prop$del:a=this.prop$set,Sk.builtin.checkNone(a)){let i=n==null?"delete":"set";throw new Sk.builtin.AttributeError("can't "+i+" attribute")}if(!a.tp$call)throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(a)+"' is not callable");return n==null?a.tp$call([t]):a.tp$call([t,n])}},methods:{getter:{$meth(t){return new Sk.builtin.property(t,this.prop$set,this.prop$del,this.prop$doc)},$flags:{OneArg:!0}},setter:{$meth(t){return new Sk.builtin.property(this.prop$get,t,this.prop$del,this.prop$doc)},$flags:{OneArg:!0}},deleter:{$meth(t){return new Sk.builtin.property(this.prop$get,this.prop$set,t,this.prop$doc)},$flags:{OneArg:!0}}},getsets:{fget:{$get(){return this.prop$get}},fset:{$get(){return this.prop$set}},fdel:{$get(){return this.prop$del}},__doc__:{$get(){return this.prop$doc},$set(t){t=t||Sk.builtin.none.none$,this.prop$doc=t}}}}),Sk.builtin.classmethod=Sk.abstr.buildNativeClass("classmethod",{constructor:function(n){this.cm$callable=n,this.$d=new Sk.builtin.dict},slots:{tp$getattr:Sk.generic.getAttr,tp$new:Sk.generic.new,tp$init(t,n){Sk.abstr.checkNoKwargs("classmethod",n),Sk.abstr.checkArgsLen("classmethod",t,1,1),this.cm$callable=t[0]},tp$doc:`classmethod(function) -> method

Convert a function to be a class method.

A class method receives the class as implicit first argument,
just like an instance method receives the instance.
To declare a class method, use this idiom:

  class C:
      @classmethod
      def f(cls, arg1, arg2, ...):
          ...

It can be called either on the class (e.g. C.f()) or on an instance
(e.g. C().f()).  The instance is ignored except for its class.
If a class method is called for a derived class, the derived class
object is passed as the implied first argument.

Class methods are different than C++ or Java static methods.
If you want those, see the staticmethod builtin.`,tp$descr_get(t,n){let a=this.cm$callable;if(a===void 0)throw new Sk.builtin.RuntimeError("uninitialized classmethod object");n===void 0&&(n=t.ob$type);let i=a.tp$descr_get;return i?i.call(a,n):new Sk.builtin.method(a,n)}},getsets:{__func__:{$get(){return this.cm$callable}},__dict__:Sk.generic.getSetDict}}),Sk.builtin.staticmethod=Sk.abstr.buildNativeClass("staticmethod",{constructor:function(n){this.sm$callable=n,this.$d=new Sk.builtin.dict},slots:{tp$getattr:Sk.generic.getAttr,tp$new:Sk.generic.new,tp$init(t,n){Sk.abstr.checkNoKwargs("staticmethod",n),Sk.abstr.checkArgsLen("staticmethod",t,1,1),this.sm$callable=t[0]},tp$doc:`staticmethod(function) -> method

Convert a function to be a static method.

A static method does not receive an implicit first argument.
To declare a static method, use this idiom:

     class C:
         @staticmethod
         def f(arg1, arg2, ...):
             ...

It can be called either on the class (e.g. C.f()) or on an instance
(e.g. C().f()).  The instance is ignored except for its class.

Static methods in Python are similar to those found in Java or C++.
For a more advanced concept, see the classmethod builtin.`,tp$descr_get(t,n){if(this.sm$callable===void 0)throw new Sk.builtin.RuntimeError("uninitialized staticmethod object");return this.sm$callable}},getsets:{__func__:{$get(){return this.sm$callable}},__dict__:Sk.generic.getSetDict}})}),"./src/range.js":(function(Y,y){Sk.builtin.range_=Sk.abstr.buildNativeClass("range",{constructor:function(o,p,w,T){this.start=o,this.stop=p,this.step=w,this.v=T},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$doc:`range(stop) -> range object
range(start, stop[, step]) -> range object

Return an object that produces a sequence of integers from start (inclusive)
to stop (exclusive) by step.  range(i, j) produces i, i+1, i+2, ..., j-1.
start defaults to 0, and stop is omitted!  range(4) produces 0, 1, 2, 3.
These are exactly the valid indices for a list of 4 elements.
When step is given, it specifies the increment (or decrement).`,tp$new(r,o){return Sk.abstr.checkNoKwargs("range",o),Sk.abstr.checkArgsLen("range",r,1,3),t(r[0],r[1],r[2])},$r(){let r="range("+this.start+", "+this.stop;return this.step!=1&&(r+=", "+this.step),r+=")",new Sk.builtin.str(r)},tp$richcompare(r,o){return o!=="Eq"&&o!=="NotEq"||r.ob$type!==Sk.builtin.range_?Sk.builtin.NotImplemented.NotImplemented$:(r=new Sk.builtin.list(r.v),new Sk.builtin.list(this.v).tp$richcompare(r,o))},tp$iter(){return new n(this)},nb$bool(){return this.v.length!==0},sq$contains(r){let o=this.v;for(let p=0;p<o.length;p++)if(Sk.misceval.richCompareBool(r,o[p],"Eq"))return!0;return!1},sq$length(){return this.v.length},mp$subscript(r){if(Sk.misceval.isIndex(r)){let o=Sk.misceval.asIndexSized(r);if(o<0&&(o=this.v.length+o),o<0||o>=this.v.length)throw new Sk.builtin.IndexError("range object index out of range");return this.v[o]}else if(r.constructor===Sk.builtin.slice){let o=[],p=this.v;r.sssiter$(p.length,S=>{o.push(p[S])});let{start:w,stop:T,step:A}=r.slice$indices(p.length);return w=Sk.misceval.asIndex(p[w])||this.start,T=Sk.misceval.asIndex(p[T])||this.stop,typeof this.step=="number"?A=A*this.step:A=JSBI.multiply(this.step,JSBI.BigInt(A)),new Sk.builtin.range_(w,T,A,o)}throw new Sk.builtin.TypeError("range indices must be integers or slices, not "+Sk.abstr.typeName(r))}},getsets:{start:{$get(){return new Sk.builtin.int_(this.start)}},step:{$get(){return new Sk.builtin.int_(this.step)}},stop:{$get(){return new Sk.builtin.int_(this.stop)}}},methods:{__reversed__:{$meth(){return new a(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"Return a reverse iterator."},count:{$meth(r){let o=0;for(let p=0;p<this.v.length;p++)Sk.misceval.richCompareBool(r,this.v[p],"Eq")&&o++;return new Sk.builtin.int_(o)},$flags:{OneArg:!0},$textsig:null,$doc:"rangeobject.count(value) -> integer -- return number of occurrences of value"},index:{$meth(r){for(let o=0;o<this.v.length;o++)if(Sk.misceval.richCompareBool(r,this.v[o],"Eq"))return new Sk.builtin.int_(o);throw new Sk.builtin.ValueError(Sk.misceval.objectRepr(r)+"is not in range")},$flags:{OneArg:!0},$textsig:null,$doc:`rangeobject.index(value, [start, [stop]]) -> integer -- return index of value.
Raise ValueError if the value is not present.`}},proto:{sk$asarray(){return this.v.slice(0)}},flags:{sk$acceptable_as_base_class:!1}});function t(r,o,p){if(r=r===void 0?r:Sk.misceval.asIndexOrThrow(r),o=o===void 0?o:Sk.misceval.asIndexOrThrow(o),p=p===void 0?p:Sk.misceval.asIndexOrThrow(p),o===void 0&&p===void 0)o=r,r=0,p=1;else if(p===void 0)p=1;else if(p===0)throw new Sk.builtin.ValueError("range() step argument must not be zero");let w=[];if(typeof r=="number"&&typeof o=="number"&&typeof p=="number")if(p>0)for(let T=r;T<o;T+=p)w.push(new Sk.builtin.int_(T));else for(let T=r;T>o;T+=p)w.push(new Sk.builtin.int_(T));else{let T;if(r=T=JSBI.BigInt(r),p=JSBI.BigInt(p),o=JSBI.BigInt(o),JSBI.greaterThan(p,JSBI.__ZERO))for(;JSBI.lessThan(T,o);)w.push(new Sk.builtin.int_(i(T))),T=JSBI.add(T,p);else for(;JSBI.greaterThan(T,o);)w.push(new Sk.builtin.int_(i(T))),T=JSBI.add(T,p);r=i(r),p=i(p),o=i(o)}return new Sk.builtin.range_(r,o,p,w)}var n=Sk.abstr.buildIteratorClass("range_iterator",{constructor:function(o){this.$index=0,this.$seq=o.v},iternext(){return this.$seq[this.$index++]},methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}}),a=Sk.abstr.buildIteratorClass("range_reverseiterator",{constructor:function(o){this.$seq=o.v,this.$index=this.$seq.length-1},iternext(){return this.$seq[this.$index--]},methods:{__length_hint__:Sk.generic.iterReverseLengthHintMethodDef},flags:{sk$acceptable_as_base_class:!1}});function i(r){return JSBI.lessThan(r,JSBI.__MAX_SAFE)&&JSBI.greaterThan(r,JSBI.__MIN_SAFE)?JSBI.toNumber(r):r}Sk.builtin.range=Sk.builtin.xrange=function(o,p,w){let T=t(o,p,w);return new Sk.builtin.list(T.v)}}),"./src/reversed.js":(function(Y,y){Sk.builtin.reversed=Sk.abstr.buildIteratorClass("reversed",{constructor:function(n){return this.$idx=n.sq$length()-1,this.$seq=n,this},iternext(t){if(this.$idx<0)return;let n=Sk.misceval.tryCatch(()=>Sk.abstr.objectGetItem(this.$seq,new Sk.builtin.int_(this.$idx--),t),a=>{if(a instanceof Sk.builtin.IndexError){this.$idx=-1;return}else throw a});return t?n:Sk.misceval.retryOptionalSuspensionOrThrow(n)},slots:{tp$doc:"Return a reverse iterator over the values of the given sequence.",tp$new(t,n){this===Sk.builtin.reversed.prototype&&Sk.abstr.checkNoKwargs("reversed",n),Sk.abstr.checkArgsLen("reversed",t,1,1);let a=t[0],i=Sk.abstr.lookupSpecial(a,Sk.builtin.str.$reversed);if(i!==void 0)return Sk.misceval.callsimArray(i,[]);if(!Sk.builtin.checkSequence(a)||Sk.abstr.lookupSpecial(a,Sk.builtin.str.$len)===void 0)throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(a)+"' object is not a sequence");if(this===Sk.builtin.reversed.prototype)return new Sk.builtin.reversed(a);{let r=new this.constructor;return Sk.builtin.reversed.call(r,a),r}}},methods:{__length_hint__:{$meth:function(){return this.$idx>=0?new Sk.builtin.int_(this.$idx):new Sk.builtin.int_(0)},$flags:{NoArgs:!0}}}})}),"./src/set.js":(function(Y,y){var t={};Sk.builtin.set=Sk.abstr.buildNativeClass("set",{constructor:function(p){p===void 0?p=[]:Array.isArray(p)||(p=Sk.misceval.arrayFromIterable(p)),Sk.asserts.assert(this instanceof Sk.builtin.set,"Bad call to set - must be called with an Array and 'new'");let w=[];for(let T=0;T<p.length;T++)w.push(p[T]),w.push(!0);this.v=new Sk.builtin.dict(w),this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$as_number:!0,tp$as_sequence_or_mapping:!0,tp$hash:Sk.builtin.none.none$,tp$doc:`set() -> new empty set object
set(iterable) -> new set object

Build an unordered collection of unique elements.`,tp$init(o,p){Sk.abstr.checkNoKwargs("set",p),Sk.abstr.checkArgsLen("set",o,0,1),this.set$clear();let w=o[0];return w&&this.set$update(w)},tp$new:Sk.generic.new,$r(){if(this.in$repr)return new Sk.builtin.str(Sk.abstr.typeName(this)+"(...)");this.in$repr=!0;let o=this.sk$asarray().map(p=>Sk.misceval.objectRepr(p));return this.in$repr=!1,Sk.__future__.python3?o.length===0?new Sk.builtin.str(Sk.abstr.typeName(this)+"()"):this.ob$type!==Sk.builtin.set?new Sk.builtin.str(Sk.abstr.typeName(this)+"({"+o.join(", ")+"})"):new Sk.builtin.str("{"+o.join(", ")+"}"):new Sk.builtin.str(Sk.abstr.typeName(this)+"(["+o.join(", ")+"])")},tp$iter(){return new r(this)},tp$richcompare(o,p){if(!Sk.builtin.checkAnySet(o))return Sk.builtin.NotImplemented.NotImplemented$;switch(p){case"NotEq":case"Eq":let w;return this===o?w=!0:this.get$size()!==o.get$size()?w=!1:w=Sk.misceval.isTrue(this.set$issubset(o)),p==="Eq"?w:!w;case"LtE":return this===o||Sk.misceval.isTrue(this.set$issubset(o));case"GtE":return this===o||Sk.misceval.isTrue(o.set$issubset(this));case"Lt":return this.get$size()<o.get$size()&&Sk.misceval.isTrue(this.set$issubset(o));case"Gt":return this.get$size()>o.get$size()&&Sk.misceval.isTrue(o.set$issubset(this))}},nb$subtract:a(function(o){return this.difference.$meth.call(this,o)}),nb$and:a(function(o){return this.intersection.$meth.call(this,o)}),nb$or:a(function(o){return this.union.$meth.call(this,o)}),nb$xor:a(function(o){return this.symmetric_difference.$meth.call(this,o)}),nb$inplace_subtract:a(function(o){return o===this&&(o=o.set$copy()),Sk.misceval.chain(this.difference_update.$meth.call(this,o),()=>this)}),nb$inplace_and:a(function(o){return Sk.misceval.chain(this.intersection_update.$meth.call(this,o),()=>this)}),nb$inplace_or:a(function(o){return Sk.misceval.chain(this.update.$meth.call(this,o),()=>this)}),nb$inplace_xor:a(function(o){return o===this&&(o=o.set$copy()),Sk.misceval.chain(this.symmetric_difference_update.$meth.call(this,o),()=>this)}),sq$length(){return this.get$size()},sq$contains(o){return o=i(o),this.v.sq$contains(o)}},methods:{add:{$meth(o){return this.set$add(o),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:`Add an element to a set.

This has no effect if the element is already present.`},clear:{$meth(){return this.set$clear(),Sk.builtin.none.none$},$flags:{NoArgs:!0},$textsig:null,$doc:"Remove all elements from this set."},copy:{$meth(){return this.set$copy()},$flags:{NoArgs:!0},$textsig:null,$doc:"Return a shallow copy of a set."},discard:{$meth(o){return o=i(o),this.set$discard(o),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:`Remove an element from a set if it is a member.

If the element is not a member, do nothing.`},difference:{$meth(...o){let p=this.set$copy();return Sk.misceval.chain(Sk.misceval.iterArray(o,w=>p.set$difference_update(w)),()=>p)},$flags:{MinArgs:0},$textsig:null,$doc:`Return the difference of two or more sets as a new set.

(i.e. all elements that are in this set but not the others.)`},difference_update:{$meth(...o){return Sk.misceval.chain(Sk.misceval.iterArray(o,p=>this.set$difference_update(p)),()=>Sk.builtin.none.none$)},$flags:{MinArgs:0},$textsig:null,$doc:"Remove all elements of another set from this set."},intersection:{$meth(...o){return this.set$intersection_multi(...o)},$flags:{MinArgs:0},$textsig:null,$doc:`Return the intersection of two sets as a new set.

(i.e. all elements that are in both sets.)`},intersection_update:{$meth(...o){return Sk.misceval.chain(this.set$intersection_multi(...o),p=>(this.swap$bodies(p),Sk.builtin.none.none$))},$flags:{MinArgs:0},$textsig:null,$doc:"Update a set with the intersection of itself and another."},isdisjoint:{$meth(o){return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(o),p=>{if(this.sq$contains(p))return new Sk.misceval.Break(Sk.builtin.bool.false$)}),p=>p||Sk.builtin.bool.true$)},$flags:{OneArg:!0},$textsig:null,$doc:"Return True if two sets have a null intersection."},issubset:{$meth(o){return Sk.builtin.checkAnySet(o)||(o=this.set$make_basetype(o)),Sk.misceval.chain(o,p=>this.set$issubset(p))},$flags:{OneArg:!0},$textsig:null,$doc:"Report whether another set contains this set."},issuperset:{$meth(o){return Sk.builtin.checkAnySet(o)||(o=this.set$make_basetype(o)),Sk.misceval.chain(o,p=>p.set$issubset(this))},$flags:{OneArg:!0},$textsig:null,$doc:"Report whether this set contains another set."},pop:{$meth(){if(this.get$size()===0)throw new Sk.builtin.KeyError("pop from an empty set");return Sk.misceval.callsimArray(this.v.popitem,[this.v]).v[0]},$flags:{NoArgs:!0},$textsig:null,$doc:`Remove and return an arbitrary set element.
Raises KeyError if the set is empty.`},remove:{$meth(o){let p=i(o);if(this.v.mp$lookup(p))return this.v.mp$ass_subscript(p),Sk.builtin.none.none$;throw new Sk.builtin.KeyError(o)},$flags:{OneArg:!0},$textsig:null,$doc:`Remove an element from a set; it must be a member.

If the element is not a member, raise a KeyError.`},symmetric_difference:{$meth(o){let p;return Sk.misceval.chain(this.set$make_basetype(o),w=>(p=w,p.set$symmetric_diff_update(this)),()=>p)},$flags:{OneArg:!0},$textsig:null,$doc:`Return the symmetric difference of two sets as a new set.

(i.e. all elements that are in exactly one of the sets.)`},symmetric_difference_update:{$meth(o){return Sk.builtin.checkAnySet(o)||(o=this.set$make_basetype(o)),Sk.misceval.chain(o,p=>this.set$symmetric_diff_update(p),()=>Sk.builtin.none.none$)},$flags:{OneArg:!0},$textsig:null,$doc:"Update a set with the symmetric difference of itself and another."},union:{$meth(...o){let p=this.set$copy();return Sk.misceval.chain(Sk.misceval.iterArray(o,w=>p.set$update(w)),()=>p)},$flags:{MinArgs:0},$textsig:null,$doc:`Return the union of sets as a new set.

(i.e. all elements that are in either set.)`},update:{$meth(...o){return Sk.misceval.chain(Sk.misceval.iterArray(o,p=>this.set$update(p)),()=>Sk.builtin.none.none$)},$flags:{MinArgs:0},$textsig:null,$doc:"Update a set with the union of itself and others."}},proto:Object.assign(t,{sk$asarray(){return this.v.sk$asarray()},get$size(){return this.v.sq$length()},set$add(o){this.v.mp$ass_subscript(o,!0)},set$make_basetype(o){return Sk.misceval.chain(Sk.misceval.arrayFromIterable(o,!0),p=>new this.sk$builtinBase(p))},set$discard(o){return this.v.pop$item(o)},set$clear(){this.v=new Sk.builtin.dict([])},set$copy(){let o=new this.sk$builtinBase;return o.v=this.v.dict$copy(),o},set$difference_update(o){return Sk.misceval.iterFor(Sk.abstr.iter(o),p=>{this.set$discard(p)})},set$intersection(o){let p=new this.sk$builtinBase;return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(o),w=>{this.sq$contains(w)&&p.set$add(w)}),()=>p)},set$intersection_multi(...o){if(!o.length)return this.set$copy();let p=this;return Sk.misceval.chain(Sk.misceval.iterArray(o,w=>Sk.misceval.chain(p.set$intersection(w),T=>{p=T})),()=>p)},set$issubset(o){let p=this.get$size(),w=o.get$size();if(p>w)return Sk.builtin.bool.false$;for(let T=this.tp$iter(),A=T.tp$iternext();A!==void 0;A=T.tp$iternext())if(!o.sq$contains(A))return Sk.builtin.bool.false$;return Sk.builtin.bool.true$},set$symmetric_diff_update(o){return Sk.misceval.iterFor(Sk.abstr.iter(o),p=>{this.set$discard(p)===void 0&&this.set$add(p)})},set$update(o){return Sk.misceval.iterFor(Sk.abstr.iter(o),p=>{this.set$add(p)})},swap$bodies(o){this.v=o.v}})}),Sk.exportSymbol("Sk.builtin.set",Sk.builtin.set);let n=Sk.builtin.set.prototype;Sk.builtin.frozenset=Sk.abstr.buildNativeClass("frozenset",{constructor:function(p){p===void 0&&(p=[]),Sk.asserts.assert(Array.isArray(p)&&this instanceof Sk.builtin.frozenset,"bad call to frozen set - must be called with an Array and 'new'");let w=[];for(let T=0;T<p.length;T++)w.push(p[T]),w.push(!0);this.v=new Sk.builtin.dict(w),this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$as_number:!0,tp$as_sequence_or_mapping:!0,tp$doc:`frozenset() -> empty frozenset object
frozenset(iterable) -> frozenset object

Build an immutable unordered collection of unique elements.`,tp$hash(){let o=1927868237,p=this.sk$asarray();o*=p.length+1;for(let w=0;w<p.length;w++){let T=Sk.abstr.objectHash(p[w]);o^=(T^T<<16^89869747)*3644798167}return o=o*69069+907133923,o},tp$new(o,p){if(this!==Sk.builtin.frozenset.prototype)return this.$subtype_new(o,p);Sk.abstr.checkNoKwargs("frozenset",p),Sk.abstr.checkArgsLen("frozenset",o,0,1);let w=o[0];return w!==void 0&&w.ob$type===Sk.builtin.frozenset?w:Sk.misceval.chain(Sk.misceval.arrayFromIterable(w,!0),T=>T.length?new Sk.builtin.frozenset(T):Sk.builtin.frozenset.$emptyset)},$r:n.$r,tp$iter:n.tp$iter,tp$richcompare:n.tp$richcompare,nb$subtract:n.nb$subtract,nb$and:n.nb$and,nb$or:n.nb$or,nb$xor:n.nb$xor,sq$length:n.sq$length,sq$contains:n.sq$contains},methods:{copy:Object.assign({},n.copy.d$def,{$meth(){return this.constructor===this.sk$builtinBase?this:new Sk.builtin.frozenset(this.sk$asarray())}}),difference:n.difference.d$def,intersection:n.intersection.d$def,isdisjoint:n.isdisjoint.d$def,issubset:n.issubset.d$def,issuperset:n.issuperset.d$def,symmetric_difference:n.symmetric_difference.d$def,union:n.union.d$def},proto:Object.assign({$subtype_new(o,p){let w=new this.constructor;return Sk.misceval.chain(Sk.builtin.frozenset.prototype.tp$new(o),T=>(w.v=T.v,w))}},t)}),Sk.builtin.frozenset.$emptyset=Object.create(Sk.builtin.frozenset.prototype,{v:{value:new Sk.builtin.dict([]),enumerable:!0},in$repr:{value:!1,enumerable:!0}}),Sk.exportSymbol("Sk.builtin.frozenset",Sk.builtin.frozenset);function a(o){return function(p){return Sk.builtin.checkAnySet(p)?o.call(this,p):Sk.builtin.NotImplemented.NotImplemented$}}function i(o){return o instanceof Sk.builtin.set&&o.tp$hash===Sk.builtin.none.none$&&(o=new Sk.builtin.frozenset(Sk.misceval.arrayFromIterable(o))),o}var r=Sk.abstr.buildIteratorClass("set_iterator",{constructor:function(p){this.$index=0,this.$seq=p.sk$asarray(),this.$orig=p},iternext:Sk.generic.iterNextWithArrayCheckSize,methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}})}),"./src/simple_iterators.js":(function(Y,y){Sk.builtin.callable_iter_=Sk.abstr.buildIteratorClass("callable_iterator",{constructor:function(n,a){if(!Sk.builtin.checkCallable(n))throw new Sk.builtin.TypeError("iter(v, w): v must be callable");this.$callable=n,this.$sentinel=a,this.$flag=!1},iternext(t){let n;if(this.$flag!==!0){if(t)return n=Sk.misceval.callsimOrSuspendArray(this.$callable,[]),Sk.misceval.chain(n,a=>{if(Sk.misceval.richCompareBool(a,this.$sentinel,"Eq",!0)){this.$flag=!0;return}else return a});if(n=Sk.misceval.callsimArray(this.$callable,[]),Sk.misceval.richCompareBool(n,this.$sentinel,"Eq",!1)){this.$flag=!0;return}else return n}},flags:{sk$acceptable_as_base_class:!1}}),Sk.builtin.seq_iter_=Sk.abstr.buildIteratorClass("iterator",{constructor:function(n){this.$index=0,this.$seq=n},iternext(t){let n;return n=Sk.misceval.tryCatch(()=>this.$seq.mp$subscript(new Sk.builtin.int_(this.$index++),t),a=>{if(!(a instanceof Sk.builtin.IndexError||a instanceof Sk.builtin.StopIteration))throw a}),t?n:Sk.misceval.retryOptionalSuspensionOrThrow(n)},methods:{__length_hint__:{$flags:{NoArgs:!0},$meth(){if(this.$seq.sq$length)return this.$seq.sq$length()-this.$index;throw new Sk.builtin.NotImplementedError("len is not implemented for "+Sk.abstr.typeName(this.$seq))}}},flags:{sk$acceptable_as_base_class:!1}}),Sk.exportSymbol("Sk.builtin.callable_iter_",Sk.builtin.callable_iter_)}),"./src/sk_method.js":(function(Y,y){Sk.builtin.sk_method=Sk.abstr.buildNativeClass("builtin_function_or_method",{constructor:function(n,a,i){this.$meth=n.$meth.bind(a),this.$doc=n.$doc,this.$self=a||null,this.$module=i?new Sk.builtin.str(i):null,this.$name=n.$name||n.$meth.name||"<native JS>",this.m$def=n,this.$textsig=n.$textsig;let r=n.$flags||{};this.$flags=r,r.FastCall&&r.NoKwargs?this.tp$call=this.$fastCallNoKwargs:r.FastCall?this.tp$call=this.$meth:r.NoArgs?this.tp$call=this.$callNoArgs:r.OneArg?this.tp$call=this.$callOneArg:r.NamedArgs?this.tp$call=this.$callNamedArgs:r.MinArgs!==void 0?this.tp$call=this.$callMinArgs:(this.func_code=this.$meth,this.tp$call=this.$defaultCallMethod)},proto:{$fastCallNoKwargs(t,n){return Sk.abstr.checkNoKwargs(this.$name,n),this.$meth(t)},$callNoArgs(t,n){return Sk.abstr.checkNoArgs(this.$name,t,n),this.$meth()},$callOneArg(t,n){return Sk.abstr.checkOneArg(this.$name,t,n),this.$meth(t[0])},$callNamedArgs(t,n){return t=Sk.abstr.copyKeywordsToNamedArgs(this.$name,this.$flags.NamedArgs,t,n,this.$flags.Defaults),this.$meth(...t)},$callMinArgs(t,n){return Sk.abstr.checkNoKwargs(this.$name,n),Sk.abstr.checkArgsLen(this.$name,t,this.$flags.MinArgs,this.$flags.MaxArgs),this.$meth(...t)},$defaultCallMethod(t,n){return this.$self!==null?Sk.builtin.func.prototype.tp$call.call(this,[this.$self,...t],n):Sk.builtin.func.prototype.tp$call.call(this,t,n)},$memoiseFlags(){return Sk.builtin.func.prototype.$memoiseFlags.call(this)},$resolveArgs(){return Sk.builtin.func.prototype.$resolveArgs.call(this)}},flags:{sk$acceptable_as_base_class:!1},slots:{tp$getattr:Sk.generic.getAttr,$r(){return this.$self===null?new Sk.builtin.str("<built-in function "+this.$name+">"):new Sk.builtin.str("<built-in method "+this.$name+" of "+Sk.abstr.typeName(this.$self)+" object>")},tp$call(t,n){return this.tp$call(t,n)},tp$richcompare(t,n){if(n!=="Eq"&&n!=="NotEq"||!(t instanceof Sk.builtin.sk_method))return Sk.builtin.NotImplemented.NotImplemented$;let a=this.$self===t.$self&&this.m$def.$meth===t.m$def.$meth;return n==="Eq"?a:!a}},getsets:{__module__:{$get(){return this.$module||Sk.builtin.none.none$},$set(t){t=t||Sk.builtin.none.none$,this.$module=t}},__doc__:{$get(){return this.$doc?new Sk.builtin.str(this.$doc):Sk.builtin.none.none$}},__name__:{$get(){return new Sk.builtin.str(this.$name)}},__text_signature__:{$get(){return new Sk.builtin.str(this.$textsig)}},__self__:{$get(){return this.$self||Sk.sysModules.mp$lookup(this.$module)||Sk.builtin.none.none$}}}})}),"./src/slice.js":(function(Y,y){var t;Sk.builtin.slice=Sk.abstr.buildNativeClass("slice",{constructor:function(a,i,r){i===void 0&&r===void 0&&(i=a,a=Sk.builtin.none.none$),i===void 0&&(i=Sk.builtin.none.none$),r===void 0&&(r=Sk.builtin.none.none$),this.start=a,this.stop=i,this.step=r},slots:{tp$getattr:Sk.generic.getAttr,tp$doc:`slice(stop)
slice(start, stop[, step])

Create a slice object.  This is used for extended slicing (e.g. a[0:10:2]).`,tp$hash:Sk.builtin.none.none$,tp$new(n,a){return Sk.abstr.checkNoKwargs("slice",a),Sk.abstr.checkArgsLen("slice",n,1,3),new Sk.builtin.slice(...n)},$r(){let n=Sk.misceval.objectRepr(this.start),a=Sk.misceval.objectRepr(this.stop),i=Sk.misceval.objectRepr(this.step);return new Sk.builtin.str("slice("+n+", "+a+", "+i+")")},tp$richcompare(n,a){if(n.ob$type!==Sk.builtin.slice)return Sk.builtin.NotImplemented.NotImplemented$;let i=new Sk.builtin.tuple([this.start,this.stop,this.step]),r=new Sk.builtin.tuple([n.start,n.stop,n.step]);return i.tp$richcompare(r,a)}},getsets:{start:{$get(){return this.start}},step:{$get(){return this.step}},stop:{$get(){return this.stop}}},methods:{indices:{$meth:function(a){if(a=Sk.misceval.asIndexSized(a,Sk.builtin.OverflowError),a<0)throw new Sk.builtin.TypeError("length should not be negative");let{start:i,stop:r,step:o}=this.slice$indices(a);return new Sk.builtin.tuple([new Sk.builtin.int_(i),new Sk.builtin.int_(r),new Sk.builtin.int_(o)])},$doc:`S.indices(len) -> (start, stop, stride)

Assuming a sequence of length len, calculate the start and stop
indices, and the stride length of the extended slice described by
S. Out of bounds indices are clipped in a manner consistent with the
handling of normal slices.`,$textsig:null,$flags:{OneArg:!0}}},proto:{slice$as_indices(n){let a,i,r,o="slice indices must be integers or None or have an __index__ method",p;if(n?p=w=>Sk.misceval.asIndexSized(w,null,o):p=w=>Sk.misceval.asIndexOrThrow(w,o),Sk.builtin.checkNone(this.step))r=1;else if(r=p(this.step),r===0)throw new Sk.builtin.ValueError("slice step cannot be zero");return Sk.builtin.checkNone(this.start)?a=null:a=p(this.start),Sk.builtin.checkNone(this.stop)?i=null:i=p(this.stop),{start:a,stop:i,step:r}},$wrt(n,a,i,r,o){let p;return o?p=w=>JSBI.__isBigInt(w)?JSBI.add(w,JSBI.BigInt(n)):w+n:p=w=>w+n,r>0?(a===null?a=0:a<0&&(a=p(a),a<0&&(a=0)),i===null||i>n?i=n:i<0&&(i=p(i))):(a===null||a>=n?a=n-1:a<0&&(a=p(a)),i===null?i=-1:i<0&&(i=p(i),i<0&&(i=-1))),{start:a,stop:i,step:r}},slice$indices(n,a){let{start:i,stop:r,step:o}=this.slice$as_indices(!0,a);return this.$wrt(n,i,r,o,a)},sssiter$(n,a){let{start:i,stop:r,step:o}=this.slice$indices(n,!0);if(o>0)for(let p=i;p<r;p+=o)a(p);else for(let p=i;p>r;p+=o)a(p)}},flags:{sk$acceptable_as_base_class:!1}}),Sk.builtin.slice.startEnd$wrt=function(n,a,i){let r=n.sq$length(),o="slice indices must be integers or have an __index__ method";return a===void 0||Sk.builtin.checkNone(a)?a=0:(a=Sk.misceval.asIndexSized(a,null,o),a<0&&(a=a+r,a<0&&(a=0))),i===void 0||Sk.builtin.checkNone(i)?i=r:(i=Sk.misceval.asIndexSized(i,null,o),i<0?(i=i+r,i<0&&(i=0)):i>r&&(i=r)),{start:a,end:i}}}),"./src/slotdefs.js":(function(Y,y){var t,n;function a(l,d,_){Sk.abstr.checkNoArgs(this.$name,d,_);let E=this.call(l);return E===void 0?Sk.builtin.none.none$:E}function i(l,d,_){let E=this.call(l,d,_);return E===void 0?Sk.builtin.none.none$:E}function r(l,d,_){Sk.abstr.checkOneArg(this.$name,d,_);let E=this.call(l,d[0]);return E===void 0?Sk.builtin.none.none$:E}function o(l,d,_){Sk.abstr.checkNoKwargs(this.$name,_),Sk.abstr.checkArgsLen(this.$name,d,1,2);let E=this.call(l,...d);return E===void 0?Sk.builtin.none.none$:E}function p(l,d,_){return Sk.abstr.checkNoKwargs(this.$name,_),Sk.abstr.checkArgsLen(this.$name,d,2,2),this.call(l,d[0],d[1]),Sk.builtin.none.none$}function w(l,d,_){let E=r.call(this,l,d,_);return E===Sk.builtin.NotImplemented.NotImplemented$?E:new Sk.builtin.bool(E)}function T(l,d){return function(_,E,b){let R=l.call(this,_,E,b);return d(R)}}function A(l){return function(){let d=l.tp$descr_get?l.tp$descr_get(this):l;return Sk.misceval.callsimArray(d,[])}}function S(l,d,_,E){return function(b){return function(){let R=b.tp$descr_get?b.tp$descr_get(this):b,f=Sk.misceval.callsimArray(R,[]);if(!d(f))throw new Sk.builtin.TypeError(l+" should return "+_+" (returned "+Sk.abstr.typeName(f)+")");return E!==void 0?E(f):f}}}function O(l){return function(d){let _=l.tp$descr_get?l.tp$descr_get(this):l;return Sk.misceval.callsimArray(_,[d])}}function D(l,d){let _=this.ob$type.$typeLookup(Sk.builtin.str.$getattribute);if(_ instanceof Sk.builtin.wrapper_descriptor)return _.d$wrapped.call(this,l,d);_.tp$descr_get&&(_=_.tp$descr_get(this));let E=Sk.misceval.tryCatch(()=>Sk.misceval.callsimOrSuspendArray(_,[l]),b=>{if(!(b instanceof Sk.builtin.AttributeError))throw b});return d?E:Sk.misceval.retryOptionalSuspensionOrThrow(E)}function B(l){return function(d,_){let E=l.tp$descr_get?l.tp$descr_get(this):l;return Sk.misceval.callsimOrSuspendArray(E,d,_)}}function F(l,d,_){return function(E){return function(b,R,f){let $,k;R===void 0?(k=d,_=null):k=l;let m=this.ob$type.$typeLookup(new Sk.builtin.str(k));if(m instanceof Sk.builtin.wrapper_descriptor)return m.d$wrapped.call(this,b,R);if(m.tp$descr_get&&(m=m.tp$descr_get(this)),m!==void 0){let g=R===void 0?[b]:[b,R];$=Sk.misceval.callsimOrSuspendArray(m,g)}else throw _?new Sk.builtin.TypeError("'"+Sk.abstr.typeName(this)+"' object "+_):new Sk.builtin.AttributeError(k);return f?$:Sk.misceval.retryOptionalSuspensionOrThrow($)}}}Sk.slots=Object.create(null);let s=Sk.slots;Sk.slots.__init__={$name:"__init__",$slot_name:"tp$init",$slot_func:function(l){return function(_,E){let b=l.tp$descr_get?l.tp$descr_get(this):l,R=Sk.misceval.callsimOrSuspendArray(b,_,E);return Sk.misceval.chain(R,f=>{if(!Sk.builtin.checkNone(f)&&f!==void 0)throw new Sk.builtin.TypeError("__init__() should return None, not "+Sk.abstr.typeName(f))})}},$wrapper:function(l,d,_){return this.call(l,d,_),Sk.builtin.none.none$},$textsig:"($self, /, *args, **kwargs)",$flags:{FastCall:!0},$doc:"Initialize self.  See help(type(self)) for accurate signature."},s.__new__={$name:"__new__",$slot_name:"tp$new",$slot_func:function(l){let d=function(_,E){let b=l;return l.tp$descr_get&&(b=l.tp$descr_get(null,this.constructor)),Sk.misceval.callsimOrSuspendArray(b,[this.constructor,..._],E)};return d.sk$static_new=!1,d},$wrapper:null,$textsig:"($self, /, *args, **kwargs)",$flags:{FastCall:!0},$doc:"Create and return a new object."},s.__call__={$name:"__call__",$slot_name:"tp$call",$slot_func:B,$wrapper:function(d,_,E){let b=d.tp$call(_,E);return b===void 0?Sk.builtin.none.none$:b},$textsig:"($self, /, *args, **kwargs)",$flags:{FastCall:!0},$doc:"Call self as a function."},s.__repr__={$name:"__repr__",$slot_name:"$r",$slot_func:S("__repr__",Sk.builtin.checkString,"str"),$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Return repr(self)."},s.__str__={$name:"__str__",$slot_name:"tp$str",$slot_func:S("__str__",Sk.builtin.checkString,"str"),$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Return str(self)."};var v=S("__hash__",Sk.builtin.checkInt,"int",l=>typeof l.v=="number"?l.v:l.tp$hash());s.__hash__={$name:"__hash__",$slot_name:"tp$hash",$slot_func:function(l){return l===Sk.builtin.none.none$?Sk.builtin.none.none$:v(l)},$wrapper:T(a,l=>new Sk.builtin.int_(l)),$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Return hash(self)."},s.__getattribute__={$name:"__getattribute__",$slot_name:"tp$getattr",$slot_func:function(l){return function(_,E){let b=this.ob$type.$typeLookup(Sk.builtin.str.$getattr);if(b===void 0)return D.call(this,_,E);let R=Sk.misceval.chain(D.call(this,_,E),f=>Sk.misceval.tryCatch(()=>f!==void 0?f:(b.tp$descr_get&&(b=b.tp$descr_get(this)),Sk.misceval.callsimOrSuspendArray(b,[_])),function($){if(!($ instanceof Sk.builtin.AttributeError))throw $}));return E?R:Sk.misceval.retryOptionalSuspensionOrThrow(R)}},$wrapper:function(l,d,_){Sk.abstr.checkOneArg(this.$name,d,_);let E=d[0];if(!Sk.builtin.checkString(E))throw new Sk.builtin.TypeError("attribute name must be string, not '"+Sk.abstr.typeName(E)+"'");let b=this.call(l,E);if(b===void 0)throw new Sk.builtin.AttributeError(Sk.abstr.typeName(l)+" has no attribute "+E.$jsstr());return b},$textsig:"($self, name, /)",$flags:{OneArg:!0},$doc:"Return getattr(self, name)."},s.__getattr__={$name:"__getattr__",$slot_name:"tp$getattr",$slot_func:s.__getattribute__.$slot_func,$wrapper:null,$textsig:"($self, name, /)",$flags:{OneArg:!0},$doc:"Return getattr(self, name)."};function N(l,d){let _=l.ob$type;for(;_&&_.sk$klass!==void 0;)_=_.prototype.tp$base;if(_&&_.prototype.tp$setattr!==d)throw new Sk.builtin.TypeError("can't apply this "+d.$name+" to "+Sk.abstr.typeName(l)+" object")}s.__setattr__={$name:"__setattr__",$slot_name:"tp$setattr",$slot_func:F("__setattr__","__delattr__"),$wrapper:function(l,d,_){return Sk.abstr.checkNoKwargs(this.$name,_),Sk.abstr.checkArgsLen(this.$name,d,2,2),N(l,this),this.call(l,d[0],d[1]),Sk.builtin.none.none$},$textsig:"($self, name, value, /)",$flags:{MinArgs:2,MaxArgs:2},$doc:"Implement setattr(self, name, value)."},s.__delattr__={$name:"__delattr__",$slot_name:"tp$setattr",$slot_func:s.__setattr__.$slot_func,$wrapper:function(l,d,_){return Sk.abstr.checkOneArg(this.$name,d,_),N(l,this),this.call(l,d[0]),Sk.builtin.none.none$},$textsig:"($self, name, /)",$flags:{OneArg:!0},$doc:"Implement delattr(self, name)."},s.__get__={$name:"__get__",$slot_name:"tp$descr_get",$slot_func:function(l){return function(_,E,b){_===null&&(_=Sk.builtin.none.none$),E==null&&(E=Sk.builtin.none.none$);let R=l.tp$descr_get?l.tp$descr_get(this):l,f=Sk.misceval.callsimOrSuspendArray(R,[_,E]);return b?f:Sk.misceval.retryOptionalSuspensionOrThrow(f)}},$wrapper:function(l,d,_){Sk.abstr.checkNoKwargs(this.$name,_),Sk.abstr.checkArgsLen(this.$name,d,1,2);let E=d[0],b=d[1];if(E===Sk.builtin.none.none$&&(E=null),b===Sk.builtin.none.none$&&(b=null),b===null&&E===null)throw new Sk.builtin.TypeError("__get__(None, None) is invalid");return this.call(l,E,b)},$textsig:"($self, instance, owner, /)",$flags:{MinArgs:2,MaxArgs:2},$doc:"Return an attribute of instance, which is of type owner."},s.__set__={$name:"__set__",$slot_name:"tp$descr_set",$slot_func:F("__set__","__delete__"),$wrapper:p,$textsig:"($self, instance, value, /)",$flags:{MinArgs:2,MaxArgs:2},$doc:"Set an attribute of instance to value."},s.__delete__={$name:"__delete__",$slot_name:"tp$descr_set",$slot_func:s.__set__.$slot_func,$wrapper:r,$textsig:"($self, instance, /)",$flags:{OneArg:!0},$doc:"Delete an attribute of instance."},s.__eq__={$name:"__eq__",$slot_name:"ob$eq",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self==value."},s.__ge__={$name:"__ge__",$slot_name:"ob$ge",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self>=value."},s.__gt__={$name:"__gt__",$slot_name:"ob$gt",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self>value."},s.__le__={$name:"__le__",$slot_name:"ob$le",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self<=value."},s.__lt__={$name:"__lt__",$slot_name:"ob$lt",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self<value."},s.__ne__={$name:"__ne__",$slot_name:"ob$ne",$slot_func:O,$wrapper:w,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self!=value."},s.__iter__={$name:"__iter__",$slot_name:"tp$iter",$slot_func:A,$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Implement iter(self)."},s.__next__={$name:"__next__",$slot_name:"tp$iternext",$slot_func:function(l){return function(_){let E=l.tp$descr_get?l.tp$descr_get(this):l,b=Sk.misceval.tryCatch(()=>Sk.misceval.callsimOrSuspendArray(E,[]),R=>{if(!(R instanceof Sk.builtin.StopIteration))throw R});return _?b:Sk.misceval.retryOptionalSuspensionOrThrow(b)}},$wrapper:function(l,d,_){return Sk.abstr.checkNoArgs(this.$name,d,_),Sk.misceval.chain(l.tp$iternext(!0),E=>{if(E===void 0)throw new Sk.builtin.StopIteration;return E})},$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Implement next(self)."},s.__len__={$name:"__len__",$slot_name:"sq$length",$slot_func:function(l){return function(_){let E,b=l.tp$descr_get?l.tp$descr_get(this):l;return _?(E=Sk.misceval.callsimOrSuspendArray(b,[]),Sk.misceval.chain(E,R=>Sk.misceval.asIndexOrThrow(R))):(E=Sk.misceval.callsimArray(b,[]),Sk.misceval.asIndexOrThrow(E))}},$wrapper:T(a,l=>new Sk.builtin.int_(l)),$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return len(self)."},s.__contains__={$name:"__contains__",$slot_name:"sq$contains",$slot_func:function(l){return function(_,E){let b=l.tp$descr_get?l.tp$descr_get(this):l,R=Sk.misceval.callsimOrSuspendArray(b,[_]);return R=Sk.misceval.chain(R,f=>Sk.misceval.isTrue(f)),R.$isSuspension?E?R:Sk.misceval.retryOptionalSuspensionOrThrow(R):R}},$wrapper:T(r,l=>new Sk.builtin.bool(l)),$textsig:"($self, key, /)",$flags:{OneArg:!0},$doc:"Return key in self."},s.__getitem__={$name:"__getitem__",$slot_name:"mp$subscript",$slot_func:function(l){return function(_,E){let b=l.tp$descr_get?l.tp$descr_get(this):l,R=Sk.misceval.callsimOrSuspendArray(b,[_]);return E?R:Sk.misceval.retryOptionalSuspensionOrThrow(R)}},$wrapper:r,$textsig:"($self, key, /)",$flags:{OneArg:!0},$doc:"Return self[key]."},s.__setitem__={$name:"__setitem__",$slot_name:"mp$ass_subscript",$slot_func:F("__setitem__","__delitem__","does not support item assignment"),$wrapper:p,$textsig:"($self, key, value, /)",$flags:{MinArgs:2,MaxArgs:2},$doc:"Set self[key] to value."},s.__delitem__={$name:"__delitem__",$slot_name:"mp$ass_subscript",$slot_func:s.__setitem__.$slot_func,$wrapper:r,$textsig:"($self, key, /)",$flags:{OneArg:!0},$doc:"Delete self[key]."},s.__add__={$name:"__add__",$slot_name:"nb$add",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self+value."},s.__radd__={$name:"__radd__",$slot_name:"nb$reflected_add",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value+self."},s.__iadd__={$name:"__iadd__",$slot_name:"nb$inplace_add",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self+=value."},s.__sub__={$name:"__sub__",$slot_name:"nb$subtract",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self-value."},s.__rsub__={$name:"__rsub__",$slot_name:"nb$reflected_subtract",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value-self."},s.__imul__={$name:"__imul__",$slot_name:"nb$inplace_multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self*=value."},s.__mul__={$name:"__mul__",$slot_name:"nb$multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self*value."},s.__rmul__={$name:"__rmul__",$slot_name:"nb$reflected_multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value*self."},s.__isub__={$name:"__isub__",$slot_name:"nb$inplace_subtract",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self-=value."},s.__mod__={$name:"__mod__",$slot_name:"nb$remainder",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self%value."},s.__rmod__={$name:"__rmod__",$slot_name:"nb$reflected_remainder",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value%self."},s.__imod__={$name:"__imod__",$slot_name:"nb$inplace_remainder",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement value%=self."},s.__divmod__={$name:"__divmod__",$slot_name:"nb$divmod",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return divmod(self, value)."},s.__rdivmod__={$name:"__rdivmod__",$slot_name:"nb$reflected_divmod",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return divmod(value, self)"},s.__pos__={$name:"__pos__",$slot_name:"nb$positive",$slot_func:A,$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"+self"},s.__neg__={$name:"__neg__",$slot_name:"nb$negative",$slot_func:A,$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"-self"},s.__abs__={$name:"__abs__",$slot_name:"nb$abs",$slot_func:A,$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"abs(self)"},s.__bool__={$name:"__bool__",$slot_name:"nb$bool",$slot_func:S("__bool__",Sk.builtin.checkBool,"bool",l=>l.v!==0),$wrapper:T(a,l=>new Sk.builtin.bool(l)),$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"self != 0"},s.__invert__={$name:"__invert__",$slot_name:"nb$invert",$slot_func:A,$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"~self"},s.__lshift__={$name:"__lshift__",$slot_name:"nb$lshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self<<value."},s.__rlshift__={$name:"__rlshift__",$slot_name:"nb$reflected_lshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value<<self."},s.__rshift__={$name:"__rshift__",$slot_name:"nb$rshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self>>value."},s.__rrshift__={$name:"__rrshift__",$slot_name:"nb$reflected_rshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value>>self."},s.__ilshift__={$name:"__ilshift__",$slot_name:"nb$inplace_lshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self<<=value."},s.__irshift__={$name:"__irshift__",$slot_name:"nb$inplace_rshift",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self=>>value."},s.__and__={$name:"__and__",$slot_name:"nb$and",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self&value."},s.__rand__={$name:"__rand__",$slot_name:"nb$refelcted_and",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value&self."},s.__iand__={$name:"__iand__",$slot_name:"nb$and",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self&=value."},s.__xor__={$name:"__xor__",$slot_name:"nb$xor",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self^value."},s.__rxor__={$name:"__rxor__",$slot_name:"nb$reflected_xor",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value^self."},s.__ixor__={$name:"__ixor__",$slot_name:"nb$inplace_xor",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self^=value."},s.__or__={$name:"__or__",$slot_name:"nb$or",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self|value."},s.__ror__={$name:"__ror__",$slot_name:"nb$reflected_or",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value|self."},s.__ior__={$name:"__ior__",$slot_name:"nb$inplace_or",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self|=value."},s.__int__={$name:"__int__",$slot_name:"nb$int",$slot_func:S("__int__",Sk.builtin.checkInt,"int"),$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"int(self)"},s.__float__={$name:"__float__",$slot_name:"nb$float",$slot_func:S("__float__",Sk.builtin.checkFloat,"float"),$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"float(self)"},s.__floordiv__={$name:"__floordiv__",$slot_name:"nb$floor_divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self//value."},s.__rfloordiv__={$name:"__rfloordiv__",$slot_name:"nb$reflected_floor_divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value//self."},s.__ifloordiv__={$name:"__ifloordiv__",$slot_name:"nb$inplace_floor_divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self//=value."},s.__truediv__={$name:"__truediv__",$slot_name:"nb$divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self/value."},s.__rtruediv__={$name:"__rtruediv__",$slot_name:"nb$reflected_divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value/self."},s.__itruediv__={$name:"__itruediv__",$slot_name:"nb$inplace_divide",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self/=value."},s.__index__={$name:"__index__",$slot_name:"nb$index",$slot_func:S("__index__",Sk.builtin.checkInt,"int",l=>l.v),$wrapper:T(a,l=>new Sk.builtin.int_(l)),$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"Return self converted to an integer, if self is suitable for use as an index into a list."},s.__pow__={$name:"__pow__",$slot_name:"nb$power",$slot_func:function(l){return function(d,_){let E=l.tp$descr_get?l.tp$descr_get(this):l;return _==null?Sk.misceval.callsimArray(E,[d]):Sk.misceval.callsimArray(E,[d,_])}},$wrapper:o,$textsig:"($self, value, mod=None, /)",$flags:{MinArgs:1,MaxArgs:2},$doc:"Return pow(self, value, mod)."},s.__rpow__={$name:"__rpow__",$slot_name:"nb$reflected_power",$slot_func:s.__pow__.$slot_func,$wrapper:o,$textsig:"($self, value, mod=None, /)",$flags:{MinArgs:1,MaxArgs:2},$doc:"Return pow(value, self, mod)."},s.__ipow__={$name:"__ipow__",$slot_name:"nb$inplace_power",$slot_func:s.__pow__.$slot_func,$wrapper:o,$textsig:"($self, value, mod=None, /)",$flags:{MinArgs:1,MaxArgs:2},$doc:"Implement **="},s.__matmul__={$name:"__matmul__",$slot_name:"nb$matrix_multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return self@value."},s.__rmatmul__={$name:"__rmatmul__",$slot_name:"nb$reflected_matrix_multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Return value@self."},s.__imatmul__={$name:"__imatmul__",$slot_name:"nb$inplace_matrix_multiply",$slot_func:O,$wrapper:r,$textsig:"($self, value, /)",$flags:{OneArg:!0},$doc:"Implement self@=value."},s.__long__={$name:"__long__",$slot_name:"nb$long",$slot_func:S("__long__",Sk.builtin.checkInt,"int"),$wrapper:a,$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"int(self)"};var h,c={next:{$name:"next",$slot_name:"tp$iternext",$slot_func:s.__next__.$slot_func,$wrapper:s.__next__.$wrapper,$textsig:s.__next__.$textsig,$flags:s.__next__.$flags},__nonzero__:{$name:"__nonzero__",$slot_name:"nb$bool",$slot_func:S("__nonzero__",Sk.builtin.checkInt,"int",l=>l.v!==0),$wrapper:T(a,l=>new Sk.builtin.bool(l)),$textsig:"($self, /)",$flags:{NoArgs:!0},$doc:"x.__nonzero__() <==> x != 0"},__div__:{$name:"__div__",$slot_name:"nb$divide",$slot_func:O,$wrapper:r,$textsig:"($self, other/)",$flags:{OneArg:!0},$doc:"x.__div__(y) <==> x/y"},__rdiv__:{$name:"__rdiv__",$slot_name:"nb$reflected_divide",$slot_func:O,$wrapper:r,$textsig:"($self, other/)",$flags:{OneArg:!0},$doc:"x.__rdiv__(y) <==> x/y"},__idiv__:{$name:"__idiv__",$slot_name:"nb$inplace_divide",$slot_func:O,$wrapper:r,$textsig:"($self, other/)",$flags:{OneArg:!0},$doc:"implement self /= other"}};Sk.subSlots={main_slots:Object.entries({tp$init:"__init__",tp$call:"__call__",$r:"__repr__",tp$str:"__str__",tp$getattr:"__getattribute__",tp$setattr:["__setattr__","__delattr__"],ob$eq:"__eq__",ob$ne:"__ne__",ob$lt:"__lt__",ob$le:"__le__",ob$gt:"__gt__",ob$ge:"__ge__",tp$descr_get:"__get__",tp$descr_set:["__set__","__delete__"],tp$iter:"__iter__",tp$iternext:"__next__"}),number_slots:Object.entries({nb$abs:"__abs__",nb$negative:"__neg__",nb$positive:"__pos__",nb$int:"__int__",nb$long:"__long__",nb$float:"__float__",nb$add:"__add__",nb$reflected_add:"__radd__",nb$inplace_add:"__iadd__",nb$subtract:"__sub__",nb$reflected_subtract:"__rsub__",nb$inplace_subtract:"__isub__",nb$multiply:"__mul__",nb$reflected_multiply:"__rmul__",nb$inplace_multiply:"__imul__",nb$floor_divide:"__floordiv__",nb$reflected_floor_divide:"__rfloordiv__",nb$inplace_floor_divide:"__ifloordiv__",nb$invert:"__invert__",nb$remainder:"__mod__",nb$reflected_remainder:"__rmod__",nb$inplace_remainder:"__imod__",nb$divmod:"__divmod__",nb$reflected_divmod:"__rdivmod__",nb$power:"__pow__",nb$reflected_power:"__rpow__",nb$inplace_power:"__ipow__",nb$divide:"__truediv__",nb$reflected_divide:"__rtruediv__",nb$inplace_divide:"__itruediv__",nb$bool:"__bool__",nb$and:"__and__",nb$reflected_and:"__rand__",nb$inplace_and:"__iand__",nb$or:"__or__",nb$reflected_or:"__ror__",nb$inplace_or:"__ior__",nb$xor:"__xor__",nb$reflected_xor:"__rxor__",nb$inplace_xor:"__ixor__",nb$lshift:"__lshift__",nb$reflected_lshift:"__rlshift__",nb$rshift:"__rshift__",nb$reflected_rshift:"__rrshift__",nb$inplace_lshift:"__ilshift__",nb$inplace_rshift:"__irshift__",nb$matrix_multiply:"__matmul__",nb$reflected_matrix_multiply:"__rmatmul__",nb$inplace_matrix_multiply:"__imatmul__"}),sequence_and_mapping_slots:Object.entries({sq$length:"__len__",sq$contains:"__contains__",mp$subscript:"__getitem__",mp$ass_subscript:["__setitem__","__delitem__"],nb$add:"__add__",nb$multiply:"__mul__",nb$reflected_multiply:"__rmul__",nb$inplace_add:"__iadd__",nb$inplace_multiply:"__imul__"})},Sk.reflectedNumberSlots={nb$add:{reflected:"nb$reflected_add"},nb$subtract:{reflected:"nb$reflected_subtract",slot:function(l){return l instanceof this.constructor?l.nb$subtract(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$multiply:{reflected:"nb$reflected_multiply"},nb$divide:{reflected:"nb$reflected_divide",slot:function(l){return l instanceof this.constructor?l.nb$divide(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$floor_divide:{reflected:"nb$reflected_floor_divide",slot:function(l){return l instanceof this.constructor?l.nb$floor_divide(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$remainder:{reflected:"nb$reflected_remainder",slot:function(l){return l instanceof this.constructor?l.nb$remainder(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$divmod:{reflected:"nb$reflected_divmod",slot:function(l){return l instanceof this.constructor?l.nb$divmod(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$power:{reflected:"nb$reflected_power",slot:function(l,d){return l instanceof this.constructor?l.nb$power(this,d):Sk.builtin.NotImplemented.NotImplemented$}},nb$and:{reflected:"nb$reflected_and"},nb$or:{reflected:"nb$reflected_or"},nb$xor:{reflected:"nb$reflected_xor"},nb$lshift:{reflected:"nb$reflected_lshift",slot:function(l){return l instanceof this.constructor?l.nb$lshift(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$rshift:{reflected:"nb$reflected_rshift",slot:function(l){return l instanceof this.constructor?l.nb$rshift(this):Sk.builtin.NotImplemented.NotImplemented$}},nb$matrix_multiply:{reflected:"nb$reflexted_matrix_multiply",slot:function(l){return l instanceof this.constructor?l.nb$matrix_multiply(this):Sk.builtin.NotImplemented.NotImplemented$}}},Sk.sequenceAndMappingSlots={sq$concat:["nb$add"],sq$repeat:["nb$multiply","nb$reflected_multiply"],mp$length:["sq$length"],sq$inplace_repeat:["nb$inplace_multiply"],sq$inplace_concat:["nb$inplace_add"]},Sk.dunderToSkulpt={__repr__:"$r",__str__:"tp$str",__init__:"tp$init",__new__:"tp$new",__hash__:"tp$hash",__call__:"tp$call",__iter__:"tp$iter",__next__:"tp$iternext",__eq__:"ob$eq",__ne__:"ob$ne",__lt__:"ob$lt",__le__:"ob$le",__gt__:"ob$gt",__ge__:"ob$ge",__abs__:"nb$abs",__neg__:"nb$negative",__pos__:"nb$positive",__int__:"nb$int",__float__:"nb$float",__add__:"nb$add",__radd__:"nb$reflected_add",__iadd__:"nb$inplace_add",__sub__:"nb$subtract",__rsub__:"nb$reflected_subtract",__isub__:"nb$inplace_subtract",__mul__:"nb$multiply",__rmul__:"nb$reflected_multiply",__imul__:"nb$inplace_multiply",__truediv__:"nb$divide",__rtruediv__:"nb$reflected_divide",__itruediv__:"nb$inplace_divide",__floordiv__:"nb$floor_divide",__rfloordiv__:"nb$reflected_floor_divide",__ifloordiv__:"nb$inplace_floor_divide",__invert__:"nb$invert",__mod__:"nb$remainder",__rmod__:"nb$reflected_remainder",__imod__:"nb$inplace_remainder",__divmod__:"nb$divmod",__rdivmod__:"nb$reflected_divmod",__pow__:"nb$power",__rpow__:"nb$reflected_power",__ipow__:"nb$inplace_power",__bool__:"nb$bool",__long__:"nb$long",__lshift__:"nb$lshift",__rlshift__:"nb$reflected_lshift",__ilshift__:"nb$inplace_lshift",__rshift__:"nb$rshift",__rrshift__:"nb$reflected_rshift",__irshift__:"nb$inplace_rshift",__and__:"nb$and",__rand__:"nb$reflected_and",__iand__:"nb$inplace_and",__or__:"nb$or",__ror__:"nb$reflected_or",__ior__:"nb$inplace_or",__xor__:"nb$xor",__rxor__:"nb$reflected_xor",__ixor__:"nb$inplace_xor",__matmul__:"nb$matrix_multiply",__rmatmul__:"nb$reflected_matrix_multiply",__imatmul__:"nb$inplace_matrix_multiply",__get__:"tp$descr_get",__set__:"tp$descr_set",__delete__:"tp$descr_set",__getattribute__:"tp$getattr",__getattr__:"tp$getattr",__setattr__:"tp$setattr",__delattr__:"tp$setattr",__len__:"sq$length",__contains__:"sq$contains",__getitem__:"mp$subscript",__setitem__:"mp$ass_subscript",__delitem__:"mp$ass_subscript"},Sk.exportSymbol("Sk.setupDunderMethods",Sk.setupDunderMethods),Sk.setupDunderMethods=function(l){let d=Sk.slots;if(l&&h===void 0)return;let _=Sk.abstr.built$iterators,E=[Sk.builtin.int_,Sk.builtin.lng,Sk.builtin.float_,Sk.builtin.complex],b=E,R=Sk.subSlots.number_slots,f=Sk.subSlots.main_slots,$=f.findIndex(x=>x[0]==="tp$iternext"),k=R.findIndex(x=>x[0]==="nb$bool"),m=Sk.dunderToSkulpt;function g(x,C,L){for(let P=0;P<x.length;P++){let J=x[P].prototype;J.hasOwnProperty(L)||(J[L]=J[C],delete J[C])}}if(l){m.__bool__="nb$bool",m.__next__="tp$iternext",delete m.__nonzero__,delete m.__div__,delete m.__rdiv__,delete m.__idiv__,delete m.next;for(let x in h)d[x]=h[x];for(let x in c)delete d[x];for(let x=0;x<b.length;x++){let C=b[x].prototype;delete C.__div__,delete C.__rdiv__}f[$][1]="__next__",R[k][1]="__bool__",g(_,"next","__next__"),g(E,"__bool__","__nonzero__")}else{h===void 0&&(d.py3$slots={__next__:d.__next__},h=d.py3$slots),m.next="tp$iternext",m.__nonzero__="nb$bool",m.__div__="nb$divide",m.__rdiv__="nb$reflected_divide",m.__idiv__="nb$inplace_divide",delete m.__bool__,delete m.__next__;for(let x in c)d[x]=c[x];for(let x in h)delete d[x];f[$][1]="next",R[k][1]="__nonzero__",g(_,"__next__","next"),g(E,"__nonzero__","__bool__");for(let x=0;x<b.length;x++){let C=b[x],L=C.prototype;L.hasOwnProperty("__div__")||(L.__div__=new Sk.builtin.wrapper_descriptor(C,c.__div__,L.nb$divide),L.__rdiv__=new Sk.builtin.wrapper_descriptor(C,c.__rdiv__,Sk.reflectedNumberSlots.nb$divide.slot))}}}}),"./src/str.js":(function(Y,y){var t=/^[0-9!#_]/,n=Object.create(null);function a(c){return n[c]}function i(c,l){n[c]=l}Sk.builtin.str=Sk.abstr.buildNativeClass("str",{constructor:function(l){Sk.asserts.assert(this instanceof Sk.builtin.str,"bad call to str - use 'new'");let d;if(typeof l=="string")d=l;else if(l===void 0)d="";else if(l===null)d="None";else{if(l.tp$str!==void 0)return l.tp$str();if(typeof l=="number")d=Number.isFinite(l)?String(l):String(l).replace("Infinity","inf").replace("NaN","nan");else throw new Sk.builtin.TypeError("could not convert object of type '"+Sk.abstr.typeName(l)+"' to str")}let _=a(d);if(_!==void 0)return _;i(d,this),this.$mangled=h(d),this.$savedKeyHash=d.replace(t,"!$&"),this.v=d},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$doc:`str(object='') -> str
str(bytes_or_buffer[, encoding[, errors]]) -> str

Create a new string object from the given object. If encoding or
errors is specified, then the object must expose a data buffer
that will be decoded using the given encoding and error handler.
Otherwise, returns the result of object.__str__() (if defined)
or repr(object).
encoding defaults to sys.getdefaultencoding().
errors defaults to 'strict'.`,tp$new(c,l){if(l=l||[],this!==Sk.builtin.str.prototype)return this.$subtype_new(c,l);if(c.length<=1&&!l.length)return new Sk.builtin.str(c[0]);if(Sk.__future__.python3){let[d,_,E]=Sk.abstr.copyKeywordsToNamedArgs("str",["object","encoding","errors"],c,l);if(d===void 0||_===void 0&&E===void 0)return new Sk.builtin.str(d);if(Sk.builtin.bytes.check$encodeArgs("str",_,E),!Sk.builtin.checkBytes(d))throw new Sk.builtin.TypeError("decoding to str: need a bytes-like object, "+Sk.abstr.typeName(d)+" found");return Sk.builtin.bytes.$decode.call(d,_,E)}else throw new Sk.builtin.TypeError("str takes at most one argument ("+(c.length+l.length)+" given)")},$r(){let c="'";this.v.indexOf("'")!==-1&&this.v.indexOf('"')===-1&&(c='"');let l=this.v.length,d,_,E=c;for(let b=0;b<l;b++)if(d=this.v.charAt(b),_=this.v.charCodeAt(b),d===c||d==="\\")E+="\\"+d;else if(d==="	")E+="\\t";else if(d===`
`)E+="\\n";else if(d==="\r")E+="\\r";else if((_>255&&_<55296||_>=57344)&&!Sk.__future__.python3)E+="\\u"+("000"+_.toString(16)).slice(-4);else if(_>=55296&&!Sk.__future__.python3){let R=this.v.codePointAt(b);b++,R=R.toString(16);let f="0000000"+R.toString(16);R.length>4?E+="\\U"+f.slice(-8):E+="\\u"+f.slice(-4)}else if(_>255&&!Sk.__future__.python3)E+="\\ufffd";else if(d<" "||_>=127&&!Sk.__future__.python3){let R=d.charCodeAt(0).toString(16);R.length<2&&(R="0"+R),E+="\\x"+R}else E+=d;return E+=c,new Sk.builtin.str(E)},tp$str(){return this.constructor===Sk.builtin.str?this:new Sk.builtin.str(this.v)},tp$iter(){return new v(this)},tp$richcompare(c,l){if(!(c instanceof Sk.builtin.str))return Sk.builtin.NotImplemented.NotImplemented$;switch(l){case"Lt":return this.v<c.v;case"LtE":return this.v<=c.v;case"Eq":return this.v===c.v;case"NotEq":return this.v!==c.v;case"Gt":return this.v>c.v;case"GtE":return this.v>=c.v}},mp$subscript(c){let l;if(Sk.misceval.isIndex(c)){if(c=Sk.misceval.asIndexSized(c,Sk.builtin.OverflowError),l=this.sq$length(),c<0&&(c=c+l),c<0||c>=l)throw new Sk.builtin.IndexError("string index out of range");return this.codepoints?new Sk.builtin.str(this.v.substring(this.codepoints[c],this.codepoints[c+1])):new Sk.builtin.str(this.v.charAt(c))}else if(c instanceof Sk.builtin.slice){let d="";return l=this.sq$length(),this.codepoints?c.sssiter$(l,_=>{d+=this.v.substring(this.codepoints[_],this.codepoints[_+1])}):c.sssiter$(l,_=>{d+=this.v.charAt(_)}),new Sk.builtin.str(d)}throw new Sk.builtin.TypeError("string indices must be integers, not "+Sk.abstr.typeName(c))},sq$length(){return this.$hasAstralCodePoints()?this.codepoints.length:this.v.length},sq$concat(c){if(!(c instanceof Sk.builtin.str))throw new Sk.builtin.TypeError("cannot concatenate 'str' and '"+Sk.abstr.typeName(c)+"' objects");return new Sk.builtin.str(this.v+c.v)},sq$repeat(c){if(!Sk.misceval.isIndex(c))throw new Sk.builtin.TypeError("can't multiply sequence by non-int of type '"+Sk.abstr.typeName(c)+"'");if(c=Sk.misceval.asIndexSized(c,Sk.builtin.OverflowError),c*this.v.length>Number.MAX_SAFE_INTEGER)throw new Sk.builtin.OverflowError;let l="";for(let d=0;d<c;d++)l+=this.v;return new Sk.builtin.str(l)},sq$contains(c){if(!(c instanceof Sk.builtin.str))throw new Sk.builtin.TypeError("'in <string>' requires string as left operand not "+Sk.abstr.typeName(c));return this.v.indexOf(c.v)!==-1},tp$as_number:!0,nb$remainder:s},proto:{toString(){return this.v},$subtype_new(c,l){let d=new this.constructor,_=Sk.builtin.str.prototype.tp$new(c,l);return d.$mangled=_.$mangled,d.$savedKeyHash=_.$savedKeyHash,d.v=_.v,d},$jsstr(){return this.v},$hasAstralCodePoints(){if(this.codepoints===null)return!1;if(this.codepoints!==void 0)return!0;for(let c=0;c<this.v.length;c++){let l=this.v.charCodeAt(c);if(l>=55296&&l<57344){this.codepoints=[];for(let d=0;d<this.v.length;d++)this.codepoints.push(d),l=this.v.charCodeAt(d),l>=55296&&l<56320&&d++;return!0}}return this.codepoints=null,!1},sk$asarray(){let c=[];if(this.$hasAstralCodePoints()){let l=this.codepoints;for(let d=0;d<l.length;d++)c.push(new Sk.builtin.str(this.v.substring(l[d],l[d+1])))}else for(let l=0;l<this.v.length;l++)c.push(new Sk.builtin.str(this.v[l]));return c},find$left:B(!1),find$right:B(!0),get$tgt(c){if(c instanceof Sk.builtin.str)return c.v;throw new Sk.builtin.TypeError("a str instance is required not '"+Sk.abstr.typeName(c)+"'")}},methods:{encode:{$meth:function(l,d){({encoding:l,errors:d}=Sk.builtin.bytes.check$encodeArgs("encode",l,d));let _=Sk.builtin.bytes.str$encode(this,l,d);return Sk.__future__.python3?_:new Sk.builtin.str(_.$jsstr())},$flags:{NamedArgs:["encoding","errors"]},$textsig:"($self, /, encoding='utf-8', errors='strict')",$doc:`Encode the string using the codec registered for encoding.

  encoding
    The encoding in which to encode the string.
  errors
    The error handling scheme to use for encoding errors.
    The default is 'strict' meaning that encoding errors raise a
    UnicodeEncodeError.  Other possible values are 'ignore', 'replace' and
    'xmlcharrefreplace' as well as any other name registered with
    codecs.register_error that can handle UnicodeEncodeErrors.`},replace:{$meth(c,l,d){c=this.get$tgt(c),l=this.get$tgt(l),d=d===void 0?-1:Sk.misceval.asIndexSized(d,Sk.builtin.OverflowError);let _=new RegExp(o(c),"g");if(d<0)return new Sk.builtin.str(this.v.replace(_,l));let E=0,b=this.v.replace(_,R=>E++<d?l:R);return new Sk.builtin.str(b)},$flags:{MinArgs:2,MaxArgs:3},$textsig:"($self, old, new, count=-1, /)",$doc:`Return a copy with all occurrences of substring old replaced by new.

  count
    Maximum number of occurrences to replace.
    -1 (the default value) means replace all occurrences.

If the optional argument count is given, only the first count occurrences are
replaced.`},split:{$meth:function(l,d){d=Sk.misceval.asIndexSized(d,Sk.builtin.OverflowError);let _=T(this,l,d),E=[];for(let b=0;b<_.length;b++)E.push(new Sk.builtin.str(this.v.substring(_[b],_[++b])));return new Sk.builtin.list(E)},$flags:{NamedArgs:["sep","maxsplit"],Defaults:[Sk.builtin.none.none$,-1]},$textsig:"($self, /, sep=None, maxsplit=-1)",$doc:`Return a list of the words in the string, using sep as the delimiter string.

  sep
    The delimiter according which to split the string.
    None (the default value) means split according to any whitespace,
    and discard empty strings from the result.
  maxsplit
    Maximum number of splits to do.
    -1 (the default value) means no limit.`},rsplit:{$meth:function(l,d){d=Sk.misceval.asIndexSized(d,Sk.builtin.OverflowError);let _=T(this,l,-1),E=d<0?0:(_.length/2-d)*2,b=[];E<=0?E=0:b.push(new Sk.builtin.str(this.v.slice(0,_[E-1])));for(let R=E;R<_.length;R++)b.push(new Sk.builtin.str(this.v.substring(_[R],_[++R])));return new Sk.builtin.list(b)},$flags:{NamedArgs:["sep","maxsplit"],Defaults:[Sk.builtin.none.none$,-1]},$textsig:"($self, /, sep=None, maxsplit=-1)",$doc:`Return a list of the words in the string, using sep as the delimiter string.

  sep
    The delimiter according which to split the string.
    None (the default value) means split according to any whitespace,
    and discard empty strings from the result.
  maxsplit
    Maximum number of splits to do.
    -1 (the default value) means no limit.

Splits are done starting at the end of the string and working to the front.`},join:{$meth(c){let l=[];return Sk.misceval.chain(Sk.misceval.iterFor(Sk.abstr.iter(c),d=>{if(!(d instanceof Sk.builtin.str))throw new Sk.builtin.TypeError("sequence item "+l.length+": expected str, "+Sk.abstr.typeName(d)+" found");l.push(d.v)}),()=>new Sk.builtin.str(l.join(this.v)))},$flags:{OneArg:!0},$textsig:"($self, iterable, /)",$doc:`Concatenate any number of strings.

The string whose method is called is inserted in between each given string.
The result is returned as a new string.

Example: '.'.join(['ab', 'pq', 'rs']) -> 'ab.pq.rs'`},capitalize:{$meth:function(){return new Sk.builtin.str(this.v.charAt(0).toUpperCase()+this.v.slice(1).toLowerCase())},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return a capitalized version of the string.

More specifically, make the first character have upper case and the rest lower
case.`},title:{$meth:function(){let l=this.v.replace(/[a-z][a-z]*/gi,d=>d[0].toUpperCase()+d.substr(1).toLowerCase());return new Sk.builtin.str(l)},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return a version of the string where each word is titlecased.

More specifically, words start with uppercased characters and all remaining
cased characters have lower case.`},center:{$meth:O(!1,!0),$flags:{MinArgs:1,MaxArgs:2},$textsig:"($self, width, fillchar=' ', /)",$doc:`Return a centered string of length width.

Padding is done using the specified fill character (default is a space).`},count:{$meth:function(l,d,_){if(l=this.get$tgt(l),{start:d,end:_}=D(this,d,_),_<d)return new Sk.builtin.int_(0);let E=l.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),b=new RegExp(E,"g"),f=this.v.slice(d,_).match(b);return f?new Sk.builtin.int_(f.length):new Sk.builtin.int_(0)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.count(sub[, start[, end]]) -> int

Return the number of non-overlapping occurrences of substring sub in
string S[start:end].  Optional arguments start and end are
interpreted as in slice notation.`},expandtabs:{$meth:function(l){if(Sk.builtin.checkInt(l))l=Sk.builtin.asnum$(l);else throw new Sk.builtin.TypeError("an integer is required, got type"+Sk.abstr.typeName(l));let d=new Array(l+1).join(" "),_=this.v.replace(/([^\r\n\t]*)\t/g,(E,b)=>b+d.slice(b.length%l));return new Sk.builtin.str(_)},$flags:{NamedArgs:["tabsize"],Defaults:[8]},$textsig:"($self, /, tabsize=8)",$doc:`Return a copy where all tab characters are expanded using spaces.

If tabsize is not given, a tab size of 8 characters is assumed.`},find:{$meth:function(l,d,_){return new Sk.builtin.int_(this.find$left(l,d,_))},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.find(sub[, start[, end]]) -> int

Return the lowest index in S where substring sub is found,
such that sub is contained within S[start:end].  Optional
arguments start and end are interpreted as in slice notation.

Return -1 on failure.`},partition:{$meth:S(!1),$flags:{OneArg:!0},$textsig:"($self, sep, /)",$doc:`Partition the string into three parts using the given separator.

This will search for the separator in the string.  If the separator is found,
returns a 3-tuple containing the part before the separator, the separator
itself, and the part after it.

If the separator is not found, returns a 3-tuple containing the original string
and two empty strings.`},index:{$meth:function(l,d,_){let E=this.find$left(l,d,_);if(E===-1)throw new Sk.builtin.ValueError("substring not found");return new Sk.builtin.int_(E)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.index(sub[, start[, end]]) -> int

Return the lowest index in S where substring sub is found, 
such that sub is contained within S[start:end].  Optional
arguments start and end are interpreted as in slice notation.

Raises ValueError when the substring is not found.`},ljust:{$meth:O(!1,!1),$flags:{MinArgs:1,MaxArgs:2},$textsig:"($self, width, fillchar=' ', /)",$doc:`Return a left-justified string of length width.

Padding is done using the specified fill character (default is a space).`},lower:{$meth(){return new Sk.builtin.str(this.v.toLowerCase())},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return a copy of the string converted to lowercase."},lstrip:{$meth:A(/^\s+/g,c=>"^["+c+"]+"),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, chars=None, /)",$doc:`Return a copy of the string with leading whitespace removed.

If chars is given and not None, remove characters in chars instead.`},rfind:{$meth(c,l,d){return new Sk.builtin.int_(this.find$right(c,l,d))},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.rfind(sub[, start[, end]]) -> int

Return the highest index in S where substring sub is found,
such that sub is contained within S[start:end].  Optional
arguments start and end are interpreted as in slice notation.

Return -1 on failure.`},rindex:{$meth:function(l,d,_){let E=this.find$right(l,d,_);if(E===-1)throw new Sk.builtin.ValueError("substring not found");return new Sk.builtin.int_(E)},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.rindex(sub[, start[, end]]) -> int

Return the highest index in S where substring sub is found,
such that sub is contained within S[start:end].  Optional
arguments start and end are interpreted as in slice notation.

Raises ValueError when the substring is not found.`},rjust:{$meth:O(!0,!1),$flags:{MinArgs:1,MaxArgs:2},$textsig:"($self, width, fillchar=' ', /)",$doc:`Return a right-justified string of length width.

Padding is done using the specified fill character (default is a space).`},rstrip:{$meth:A(/\s+$/g,c=>"["+c+"]+$"),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, chars=None, /)",$doc:`Return a copy of the string with trailing whitespace removed.

If chars is given and not None, remove characters in chars instead.`},rpartition:{$meth:S(!0),$flags:{OneArg:!0},$textsig:"($self, sep, /)",$doc:`Partition the string into three parts using the given separator.

This will search for the separator in the string, starting at the end. If
the separator is found, returns a 3-tuple containing the part before the
separator, the separator itself, and the part after it.

If the separator is not found, returns a 3-tuple containing two empty strings
and the original string.`},splitlines:{$meth:function(l){l=Sk.misceval.isTrue(l);let d=this.v,_=[],E=d.length,b,R,f,$=0;for(let k=0;k<E;k++)R=d.charAt(k),d.charAt(k+1)===`
`&&R==="\r"?(f=k+2,b=d.slice($,f),l||(b=b.replace(/(\r|\n)/g,"")),_.push(new Sk.builtin.str(b)),$=f):(R===`
`&&d.charAt(k-1)!=="\r"||R==="\r")&&(f=k+1,b=d.slice($,f),l||(b=b.replace(/(\r|\n)/g,"")),_.push(new Sk.builtin.str(b)),$=f);return $<E&&(f=E,b=d.slice($,f),l||(b=b.replace(/(\r|\n)/g,"")),_.push(new Sk.builtin.str(b))),new Sk.builtin.list(_)},$flags:{NamedArgs:["keepends"],Defaults:[!1]},$textsig:"($self, /, keepends=False)",$doc:`Return a list of the lines in the string, breaking at line boundaries.

Line breaks are not included in the resulting list unless keepends is given and
true.`},strip:{$meth:A(/^\s+|\s+$/g,c=>"^["+c+"]+|["+c+"]+$"),$flags:{MinArgs:0,MaxArgs:1},$textsig:"($self, chars=None, /)",$doc:`Return a copy of the string with leading and trailing whitespace remove.

If chars is given and not None, remove characters in chars instead.`},swapcase:{$meth(){let c=this.v.replace(/[a-z]/gi,l=>{let d=l.toLowerCase();return d===l?l.toUpperCase():d});return new Sk.builtin.str(c)},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Convert uppercase characters to lowercase and lowercase characters to uppercase."},upper:{$meth(){return new Sk.builtin.str(this.v.toUpperCase())},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:"Return a copy of the string converted to uppercase."},startswith:{$meth:F("startswith",(c,l)=>c.indexOf(l)===0),$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.startswith(prefix[, start[, end]]) -> bool

Return True if S starts with the specified prefix, False otherwise.
With optional start, test S beginning at that position.
With optional end, stop comparing S at that position.
prefix can also be a tuple of strings to try.`},endswith:{$meth:F("endswith",(c,l)=>c.indexOf(l,c.length-l.length)!==-1),$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:`S.endswith(suffix[, start[, end]]) -> bool

Return True if S ends with the specified suffix, False otherwise.
With optional start, test S beginning at that position.
With optional end, stop comparing S at that position.
suffix can also be a tuple of strings to try.`},isascii:{$meth(){return new Sk.builtin.bool(/^[\x00-\x7F]*$/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if all characters in the string are ASCII, False otherwise.

ASCII characters have code points in the range U+0000-U+007F.
Empty string is ASCII too.`},islower:{$meth:function(){return new Sk.builtin.bool(this.v.length&&/[a-z]/.test(this.v)&&!/[A-Z]/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is a lowercase string, False otherwise.

A string is lowercase if all cased characters in the string are lowercase and
there is at least one cased character in the string.`},isupper:{$meth:function(){return new Sk.builtin.bool(this.v.length&&!/[a-z]/.test(this.v)&&/[A-Z]/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is an uppercase string, False otherwise.

A string is uppercase if all cased characters in the string are uppercase and
there is at least one cased character in the string.`},istitle:{$meth:function(){let l=this.v,d=!1,_=!1,E;for(let b=0;b<l.length;b++)if(E=l.charAt(b),!/[a-z]/.test(E)&&/[A-Z]/.test(E)){if(_)return Sk.builtin.bool.false$;_=!0,d=!0}else if(/[a-z]/.test(E)&&!/[A-Z]/.test(E)){if(!_)return Sk.builtin.bool.false$;d=!0}else _=!1;return new Sk.builtin.bool(d)},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is a title-cased string, False otherwise.

In a title-cased string, upper- and title-case characters may only
follow uncased characters and lowercase characters only cased ones.`},isspace:{$meth:function(){return new Sk.builtin.bool(/^\s+$/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is a whitespace string, False otherwise.

A string is whitespace if all characters in the string are whitespace and there
is at least one character in the string.`},isdigit:{$meth:function(){return new Sk.builtin.bool(/^\d+$/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is a digit string, False otherwise.

A string is a digit string if all characters in the string are digits and there
is at least one character in the string.`},isnumeric:{$meth:function(){return new Sk.builtin.bool(this.v.length&&!/[^0-9]/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is a numeric string, False otherwise.

A string is numeric if all characters in the string are numeric and there is at
least one character in the string.`},isalpha:{$meth:function(){return new Sk.builtin.bool(this.v.length&&!/[^a-zA-Z]/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is an alphabetic string, False otherwise.

A string is alphabetic if all characters in the string are alphabetic and there
is at least one character in the string.`},isalnum:{$meth:function(){return new Sk.builtin.bool(this.v.length&&!/[^a-zA-Z0-9]/.test(this.v))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:`Return True if the string is an alpha-numeric string, False otherwise.

A string is alpha-numeric if all characters in the string are alpha-numeric and
there is at least one character in the string.`},zfill:{$meth:function(l){l=Sk.misceval.asIndexSized(l,Sk.builtin.OverflowError);let d="",_=l-this.v.length,E=this.v[0]==="+"||this.v[0]==="-"?1:0;for(let b=0;b<_;b++)d+="0";return new Sk.builtin.str(this.v.substr(0,E)+d+this.v.substr(E))},$flags:{OneArg:!0},$textsig:"($self, width, /)",$doc:`Pad a numeric string with zeros on the left, to fill a field of the given width.

The string is never truncated.`},format:{$meth:Sk.formatting.format,$flags:{FastCall:!0},$textsig:null,$doc:`S.format(*args, **kwargs) -> str

Return a formatted version of S, using substitutions from args and kwargs.
The substitutions are identified by braces ('{' and '}').`},__format__:{$meth:Sk.formatting.formatString,$flags:{OneArg:!0},$textsig:"($self, format_spec, /)",$doc:"Return a formatted version of the string as described by format_spec."},__getnewargs__:{$meth(){return new Sk.builtin.tuple(new Sk.builtin.str(this.v))},$flags:{NoArgs:!0},$textsig:null,$doc:null}}}),Sk.exportSymbol("Sk.builtin.str",Sk.builtin.str);var r=/^[A-Za-z0-9]+$/;function o(c){let l,d=[];for(let _=0;_<c.length;_++)l=c.charAt(_),r.test(l)?d.push(l):l==="\\000"?d.push("\\000"):d.push("\\"+l);return d.join("")}var p=/([.*+?=|\\\/()\[\]\{\}^$])/g,w=/^[\s\xa0]+/;function T(c,l,d){if(l=Sk.builtin.checkNone(l)?null:c.get$tgt(l),l!==null&&!l.length)throw new Sk.builtin.ValueError("empty separator");let _=c.v,E=0,b;if(l===null){b=/[\s\xa0]+/g;let m=_.length;_=_.replace(w,""),E=m-_.length}else{let m=l.replace(p,"\\$1");b=new RegExp(m,"g")}let R=[],f=0,$=0,k;for(d=d<0?1/0:d;(k=b.exec(_))!=null&&$<d&&k.index!==b.lastIndex;)R.push(f+E),R.push(k.index+E),f=b.lastIndex,$+=1;return(l!==null||_.length-f)&&(R.push(f+E),R.push(_.length+E)),R}function A(c,l){return function(_){let E;if(_===void 0||Sk.builtin.checkNone(_))E=c;else if(_ instanceof Sk.builtin.str){let b=o(_.v);E=new RegExp(l(b),"g")}else throw new Sk.builtin.TypeError("strip arg must be None or str");return new Sk.builtin.str(this.v.replace(E,""))}}function S(c){return function(d){let _=this.get$tgt(d),E=this.v,b;if(c){if(b=E.lastIndexOf(_),b<0)return new Sk.builtin.tuple([new Sk.builtin.str(""),new Sk.builtin.str(""),new Sk.builtin.str(E)])}else if(b=E.indexOf(_),b<0)return new Sk.builtin.tuple([new Sk.builtin.str(E),new Sk.builtin.str(""),new Sk.builtin.str("")]);return new Sk.builtin.tuple([new Sk.builtin.str(E.substring(0,b)),new Sk.builtin.str(_),new Sk.builtin.str(E.substring(b+_.length))])}}function O(c,l){return function(_,E){if(_=Sk.misceval.asIndexSized(_,Sk.builtin.OverflowError),E===void 0)E=" ";else{if(!(E instanceof Sk.builtin.str)||E.sq$length()!==1)throw new Sk.builtin.TypeError("the fill character must be a str of length 1");E=E.v}let b=this.sq$length(),R;return b>=_?new Sk.builtin.str(this.v):l?(R=E.repeat(Math.floor((_-b)/2)),R=R+this.v+R,(_-b)%2&&(R+=E),new Sk.builtin.str(R)):(R=E.repeat(_-b),new Sk.builtin.str(c?R+this.v:this.v+R))}}function D(c,l,d){if({start:l,end:d}=Sk.builtin.slice.startEnd$wrt(c,l,d),c.$hasAstralCodePoints()){let _=c.codepoints[l];l=_===void 0?l+c.v.length-c.codepoints.length:_,d=c.codepoints[d],d=d===void 0?c.v.length:d}return{start:l,end:d}}function B(c){return function(l,d,_){if(l=this.get$tgt(l),{start:d,end:_}=D(this,d,_),_<d)return-1;_-=l.length;let E=c?this.v.lastIndexOf(l,_):this.v.indexOf(l,d);E=E>=d&&E<=_?E:-1;let b;if(this.codepoints){let R=this.sq$length();b=-1;for(let f=0;f<R;f++)E==this.codepoints[f]&&(b=f)}else b=E;return b}}function F(c,l){return function(d,_,E){if(!(d instanceof Sk.builtin.str)&&!(d instanceof Sk.builtin.tuple))throw new Sk.builtin.TypeError(c+" first arg must be str or a tuple of str, not "+Sk.abstr.typeName(d));if({start:_,end:E}=D(this,_,E),_>E)return Sk.builtin.bool.false$;let b=this.v.slice(_,E);if(d instanceof Sk.builtin.tuple){for(let R=Sk.abstr.iter(d),f=R.tp$iternext();f!==void 0;f=R.tp$iternext()){if(!(f instanceof Sk.builtin.str))throw new Sk.builtin.TypeError("tuple for "+c+" must only contain str, not "+Sk.abstr.typeName(f));if(l(b,f.v))return Sk.builtin.bool.true$}return Sk.builtin.bool.false$}return new Sk.builtin.bool(l(b,d.v))}}Sk.builtin.str.$py2decode=new Sk.builtin.method_descriptor(Sk.builtin.str,{$name:"decode",$meth(c,l){let d=new Sk.builtin.bytes(this.v);return Sk.builtin.bytes.$decode.call(d,c,l)},$flags:{NamedArgs:["encoding","errors"]}});function s(c){var l,d,_,E,b;let R=this.sk$builtinBase;return c.constructor!==Sk.builtin.tuple&&!(c instanceof Sk.builtin.dict||c instanceof Sk.builtin.mappingproxy)&&(c=new Sk.builtin.tuple([c])),E=/%(\([a-zA-Z0-9]+\))?([#0 +\-]+)?(\*|[0-9]+)?(\.(\*|[0-9]+))?[hlL]?([diouxXeEfFgGcrsb%])/g,_=0,d=function(f,$,k,m,g,x,C){var L,P,J,K,j,V,G,X,Q,Z,te,ae,le,re,ke;if(m=Sk.builtin.asnum$(m),g=Sk.builtin.asnum$(g),($===void 0||$==="")&&C!="%"&&(ke=_++),g===""&&(g=void 0),re=!1,le=!1,ae=!1,te=!1,Z=!1,k&&(k.indexOf("-")!==-1?le=!0:k.indexOf("0")!==-1&&(re=!0),k.indexOf("+")!==-1?te=!0:k.indexOf(" ")!==-1&&(ae=!0),Z=k.indexOf("#")!==-1),g&&(g=parseInt(g.substr(1),10)),Q=function(oe,he){var $e,_e,de,Oe,Ie,ze;if(he=Sk.builtin.asnum$(he),Oe=!1,de=!1,typeof oe=="number"?(oe<0&&(oe=-oe,Oe=!0),Ie=oe.toString(he)):oe instanceof Sk.builtin.float_?(Ie=oe.str$(he,!1),Ie.length>2&&Ie.substr(-2)===".0"&&(Ie=Ie.substr(0,Ie.length-2)),Oe=oe.nb$isnegative()):(oe instanceof Sk.builtin.int_||oe instanceof Sk.builtin.lng)&&(Ie=oe.str$(he,!1),Oe=oe.nb$isnegative()),Sk.asserts.assert(Ie!==void 0,"unhandled number format"),$e=!1,g)for(ze=Ie.length;ze<g;++ze)Ie="0"+Ie,$e=!0;return _e="",Oe?_e="-":te?_e="+"+_e:ae&&(_e=" "+_e),Z&&(he===16?_e+="0x":he===8&&!$e&&Ie!=="0"&&(_e+="0")),[_e,Ie]},X=function(oe){var he,$e=oe[0],_e=oe[1],de;if(m)if(m=parseInt(m,10),he=_e.length+$e.length,re)for(de=he;de<m;++de)_e="0"+_e;else if(le){for(de=he;de<m;++de)_e=_e+" ";Sk.__future__.python3&&(_e+=$e,$e="")}else for(de=he;de<m;++de)$e=" "+$e;return $e+_e},c.constructor===Sk.builtin.tuple)G=c.v[ke];else if(c.mp$subscript!==void 0&&$!==void 0)V=$.substring(1,$.length-1),G=c.mp$subscript(new R(V));else if(c.constructor===Sk.builtin.dict||c.constructor===Sk.builtin.list)G=c;else throw new Sk.builtin.AttributeError(c.tp$name+" instance has no attribute 'mp$subscript'");if(K=10,C==="d"||C==="i"){let oe=Q(G,K);if(oe[1]===void 0)throw new Sk.builtin.TypeError("%"+C+" format: a number is required, not "+Sk.abstr.typeName(G));let he=oe[1];return oe[1]=he.indexOf(".")!==-1?parseInt(he,10).toString():he,X(oe)}else{if(C==="o")return X(Q(G,8));if(C==="x")return X(Q(G,16));if(C==="X")return X(Q(G,16)).toUpperCase();if(C==="f"||C==="F"||C==="e"||C==="E"||C==="g"||C==="G")return J=Sk.builtin.asnum$(G),typeof J=="string"&&(J=Number(J)),J===1/0?"inf":J===-1/0?"-inf":isNaN(J)?"nan":(P=["toExponential","toFixed","toPrecision"]["efg".indexOf(C.toLowerCase())],(g===void 0||g==="")&&(C==="e"||C==="E"?g=6:(C==="f"||C==="F")&&(Sk.__future__.python3?g=6:g=7)),L=J[P](g),Sk.builtin.checkFloat(G)&&J===0&&1/J===-1/0&&(L="-"+L),Sk.__future__.python3&&(L.length>=7&&L.slice(0,6)=="0.0000"&&(b=parseFloat(L),L=b.toExponential()),L.charAt(L.length-2)=="-"&&(L=L.slice(0,L.length-1)+"0"+L.charAt(L.length-1))),"EFG".indexOf(C)!==-1&&(L=L.toUpperCase()),X(["",L]));if(C==="c"){if(typeof G=="number")return String.fromCharCode(G);if(G instanceof Sk.builtin.int_)return String.fromCharCode(G.v);if(G instanceof Sk.builtin.float_)return String.fromCharCode(G.v);if(G instanceof Sk.builtin.lng)return String.fromCharCode(G.str$(10,!1)[0]);if(G.constructor===Sk.builtin.str)return G.v.substr(0,1);throw new Sk.builtin.TypeError("an integer is required")}else{if(C==="r")return j=Sk.builtin.repr(G),g?j.v.substr(0,g):j.v;if(C==="s"&&R===Sk.builtin.str)return j=new Sk.builtin.str(G),j=j.$jsstr(),g?j.substr(0,g):(m&&(j=X([" ",j])),j);if(C==="b"||C==="s"){if(R===Sk.builtin.str)throw new Sk.builtin.ValueError("unsupported format character 'b'");let oe;if(!(G instanceof Sk.builtin.bytes)&&(oe=Sk.abstr.lookupSpecial(G,Sk.builtin.str.$bytes))===void 0)throw new Sk.builtin.TypeError("%b requires a bytes-like object, or an object that implements __bytes__, not '"+Sk.abstr.typeName(G)+"'");return oe!==void 0&&(G=new Sk.builtin.bytes(G)),j=G.$jsstr(),g?j.substr(0,g):(m&&(j=X([" ",j])),j)}else if(C==="%")return"%"}}},l=this.$jsstr().replace(E,d),new R(l)}var v=Sk.abstr.buildIteratorClass("str_iterator",{constructor:function(l){this.$index=0,l.$hasAstralCodePoints()?(this.$seq=l.codepoints,this.tp$iternext=()=>{let d=this.$seq[this.$index];if(d!==void 0)return new Sk.builtin.str(l.v.substring(d,this.$seq[++this.$index]))}):(this.$seq=l.v,this.tp$iternext=()=>{let d=this.$seq[this.$index++];if(d!==void 0)return new Sk.builtin.str(d)})},iternext(){return this.tp$iternext()},methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}}),N={abstract:!0,as:!0,boolean:!0,break:!0,byte:!0,case:!0,catch:!0,char:!0,class:!0,continue:!0,const:!0,debugger:!0,default:!0,delete:!0,do:!0,double:!0,else:!0,enum:!0,export:!0,extends:!0,false:!0,final:!0,finally:!0,float:!0,for:!0,function:!0,goto:!0,if:!0,implements:!0,import:!0,in:!0,instanceof:!0,int:!0,interface:!0,is:!0,long:!0,namespace:!0,native:!0,new:!0,null:!0,package:!0,private:!0,protected:!0,public:!0,return:!0,short:!0,static:!0,super:!0,switch:!0,synchronized:!0,this:!0,throw:!0,throws:!0,transient:!0,true:!0,try:!0,typeof:!0,use:!0,var:!0,void:!0,volatile:!0,while:!0,with:!0,constructor:!0,__defineGetter__:!0,__defineSetter__:!0,apply:!0,arguments:!0,call:!0,caller:!0,eval:!0,hasOwnProperty:!0,isPrototypeOf:!0,__lookupGetter__:!0,__lookupSetter__:!0,__noSuchMethod__:!0,propertyIsEnumerable:!0,prototype:!0,toSource:!0,toLocaleString:!0,toString:!0,unwatch:!0,valueOf:!0,watch:!0,length:!0,name:!0};function h(c){return N[c]===void 0?c:c+"_$rw$"}Sk.builtin.str.reservedWords_=N}),"./src/structseq.js":(function(Y,y){Sk.builtin.structseq_types={},Sk.builtin.make_structseq=function(t,n,a,i){let r=t+"."+n,o=[],p=[];for(let A in a)o.push(A),p.push(a[A]);let w={};for(let A=0;A<o.length;A++)w[o[A]]={$get(){return this.v[A]},$doc:p[A]};var T=Sk.abstr.buildNativeClass(r,{constructor:function(S){Sk.asserts.assert((Array.isArray(S)||S===void 0)&&this instanceof T),Sk.builtin.tuple.call(this,S)},base:Sk.builtin.tuple,slots:{tp$new(A,S){Sk.abstr.checkOneArg(r,A,S);let O=[],D=A[0];for(let B=Sk.abstr.iter(D),F=B.tp$iternext();F!==void 0;F=B.tp$iternext())O.push(F);if(O.length!=o.length)throw new Sk.builtin.TypeError(r+"() takes a "+o.length+"-sequence ("+O.length+"-sequence given)");return new T(O)},tp$doc:i||Sk.builtin.none.none$,$r(){var A,S,O;if(this.v.length===0)return new Sk.builtin.str(r+"()");for(O=[],S=0;S<this.v.length;++S)O[S]=o[S]+"="+Sk.misceval.objectRepr(this.v[S]);return A=O.join(", "),this.v.length===1&&(A+=","),new Sk.builtin.str(r+"("+A+")")}},methods:{__reduce__:{$meth(){throw new Sk.builtin.NotImplementedError("__reduce__ is not implemented")},$flags:{NoArgs:!0}}},getsets:w,proto:{num_sequence_fields:new Sk.builtin.int_(o.length)}});return T},Sk.exportSymbol("Sk.builtin.make_structseq",Sk.builtin.make_structseq)}),"./src/super.js":(function(Y,y){Sk.builtin.super_=Sk.abstr.buildNativeClass("super",{constructor:function(n,a){if(Sk.asserts.assert(this instanceof Sk.builtin.super_,"bad call to super, use 'new'"),this.type=n,this.obj=a,n!==void 0&&!Sk.builtin.checkClass(n))throw new Sk.builtin.TypeError("must be type, not "+Sk.abstr.typeName(n));this.obj!==void 0?this.obj_type=this.$supercheck(n,this.obj):this.obj_type=null},slots:{tp$doc:`super() -> same as super(__class__, <first argument>)
super(type) -> unbound super object
super(type, obj) -> bound super object; requires isinstance(obj, type)
super(type, type2) -> bound super object; requires issubclass(type2, type)
Typical use to call a cooperative superclass method:
class C(B):
    def meth(self, arg):
        super().meth(arg)
This works for class methods too:
class C(B):
    @classmethod
    def cmeth(cls, arg):
        super().cmeth(arg)
`,tp$new:Sk.generic.new,tp$init(t,n){Sk.abstr.checkNoKwargs("super",n),Sk.abstr.checkArgsLen("super",t,1,2);let a=t[0],i=t[1];if(!Sk.builtin.checkClass(a))throw new Sk.builtin.TypeError("must be type, not "+Sk.abstr.typeName(a));this.obj=i,this.type=a,this.obj!=null&&(this.obj_type=this.$supercheck(a,this.obj))},$r(){return this.obj?new Sk.builtin.str("<super: <class '"+this.type.prototype.tp$name+"'>, <"+Sk.abstr.typeName(this.obj)+" object>>"):new Sk.builtin.str("<super: <class '"+this.type.prototype.tp$name+"'>, NULL>")},tp$getattr(t,n){let a=this.obj_type;if(a==null)return Sk.generic.getAttr.call(this,t,n);let i=a.prototype.tp$mro,r=i.length;if(t===Sk.builtin.str.$class)return Sk.generic.getAttr.call(this,t,n);let o;for(o=0;o+1<r&&this.type!==i[o];o++);if(o++,o>=r)return Sk.generic.getAttr.call(this,t,n);let p=t.$mangled,w,T;for(;o<r;){if(w=i[o].prototype,w.hasOwnProperty(p)&&(T=w[p]),T!==void 0){let A=T.tp$descr_get;return A!==void 0&&(T=A.call(T,this.obj===a?null:this.obj,a)),T}o++}},tp$descr_get(t,n){if(t===null||this.obj!=null)return this;if(this.ob$type!==Sk.builtin.super_)return Sk.misceval.callsimOrSuspendArray(this.ob$type,[this.type,t]);{let a=this.$supercheck(this.type,t),i=new Sk.builtin.super_;return i.type=this.type,i.obj=t,i.obj_type=a,i}}},getsets:{__thisclass__:{$get(){return this.type},$doc:"the class invoking super()"},__self__:{$get(){return this.obj||Sk.builtin.none.none$},$doc:"the instance invoking super(); may be None"},__self_class__:{$get(){return this.obj_type||Sk.builtin.none.none$},$doc:"the type of the instance invoking super(); may be None"}},proto:{$supercheck(t,n){if(Sk.builtin.checkClass(n)&&n.$isSubType(t))return n;if(n.ob$type.$isSubType(t))return n.ob$type;{let a=n.tp$getattr(Sk.builtin.str.$class);if(a!==void 0&&a!==n.ob$type&&Sk.builtin.checkClass(a)&&a.$isSubType(t))return a}throw new Sk.builtin.TypeError("super(type, obj): obj must be an instance or subtype of type")}}})}),"./src/symtable.js":(function(Y,y){var t=1,n=2,a=4,i=8,r=16,o=32,p=64,w=128,T=256,A=512,S=1024,O=2048,D=4096,B=n|a|S,F=11,s=7,v=1,N=2,h=3,c=4,l=5,d=1,_=2,E=4,b=8,R=2,f=2,$="module",k="function",m="class",g={DEF_GLOBAL:t,DEF_LOCAL:n,DEF_PARAM:a,USE:i,DEF_STAR:r,DEF_DOUBLESTAR:o,DEF_INTUPLE:p,DEF_FREE:w,DEF_FREE_GLOBAL:T,DEF_FREE_CLASS:A,DEF_IMPORT:S,DEF_BOUND:B,SCOPE_OFF:F,SCOPE_MASK:s,LOCAL:v,GLOBAL_EXPLICIT:N,GLOBAL_IMPLICIT:h,FREE:c,CELL:l,OPT_IMPORT_STAR:d,OPT_EXEC:_,OPT_BARE_EXEC:E,OPT_TOPLEVEL:b,GENERATOR:R,GENERATOR_EXPRESSION:f,ModuleBlock:$,FunctionBlock:k,ClassBlock:m};Sk.exportSymbol("Sk.SYMTAB_CONSTS",g);function x(j,V,G){this.__name=j,this.__flags=V,this.__scope=V>>F&s,this.__namespaces=G||[]}x.prototype.get_name=function(){return this.__name},x.prototype.is_referenced=function(){return!!(this.__flags&i)},x.prototype.is_parameter=function(){return!!(this.__flags&a)},x.prototype.is_global=function(){return this.__scope===h||this.__scope==N},x.prototype.is_declared_global=function(){return this.__scope==N},x.prototype.is_local=function(){return!!(this.__flags&B)},x.prototype.is_free=function(){return this.__scope==c},x.prototype.is_imported=function(){return!!(this.__flags&S)},x.prototype.is_assigned=function(){return!!(this.__flags&n)},x.prototype.is_namespace=function(){return this.__namespaces&&this.__namespaces.length>0},x.prototype.get_namespaces=function(){return this.__namespaces};var C=0;function L(j,V,G,X,Q){this.symFlags={},this.name=V,this.varnames=[],this.children=[],this.blockType=G,this.isNested=!1,this.hasFree=!1,this.childHasFree=!1,this.generator=!1,this.varargs=!1,this.varkeywords=!1,this.returnsValue=!1,this.lineno=Q,this.table=j,j.cur&&(j.cur.nested||j.cur.blockType===k)&&(this.isNested=!0),X.scopeId=C++,j.stss[X.scopeId]=this,this.symbols={}}L.prototype.get_type=function(){return this.blockType},L.prototype.get_name=function(){return this.name},L.prototype.get_lineno=function(){return this.lineno},L.prototype.is_nested=function(){return this.isNested},L.prototype.has_children=function(){return this.children.length>0},L.prototype.get_identifiers=function(){return this._identsMatching(function(){return!0})},L.prototype.lookup=function(j){var V,G,X;return this.symbols.hasOwnProperty(j)?X=this.symbols[j]:(G=this.symFlags[j],V=this.__check_children(j),X=this.symbols[j]=new x(j,G,V)),X},L.prototype.__check_children=function(j){var V,G,X=[];for(G=0;G<this.children.length;++G)V=this.children[G],V.name===j&&X.push(V);return X},L.prototype._identsMatching=function(j){var V,G=[];for(V in this.symFlags)this.symFlags.hasOwnProperty(V)&&j(this.symFlags[V])&&G.push(V);return G.sort(),G},L.prototype.get_parameters=function(){return Sk.asserts.assert(this.get_type()=="function","get_parameters only valid for function scopes"),this._funcParams||(this._funcParams=this._identsMatching(function(j){return j&a})),this._funcParams},L.prototype.get_locals=function(){return Sk.asserts.assert(this.get_type()=="function","get_locals only valid for function scopes"),this._funcLocals||(this._funcLocals=this._identsMatching(function(j){return j&B})),this._funcLocals},L.prototype.get_globals=function(){return Sk.asserts.assert(this.get_type()=="function","get_globals only valid for function scopes"),this._funcGlobals||(this._funcGlobals=this._identsMatching(function(j){var V=j>>F&s;return V==h||V==N})),this._funcGlobals},L.prototype.get_frees=function(){return Sk.asserts.assert(this.get_type()=="function","get_frees only valid for function scopes"),this._funcFrees||(this._funcFrees=this._identsMatching(function(j){var V=j>>F&s;return V==c})),this._funcFrees},L.prototype.get_methods=function(){var j,V;if(Sk.asserts.assert(this.get_type()=="class","get_methods only valid for class scopes"),!this._classMethods){for(V=[],j=0;j<this.children.length;++j)V.push(this.children[j].name);V.sort(),this._classMethods=V}return this._classMethods},L.prototype.getScope=function(j){var V=this.symFlags[j];return V===void 0?0:V>>F&s};function P(j){this.filename=j,this.cur=null,this.top=null,this.stack=[],this.global=null,this.curClass=null,this.tmpname=0,this.stss={}}P.prototype.getStsForAst=function(j){var V;return Sk.asserts.assert(j.scopeId!==void 0,"ast wasn't added to st?"),V=this.stss[j.scopeId],Sk.asserts.assert(V!==void 0,"unknown sym tab entry"),V},P.prototype.SEQStmt=function(j){var V,G,X;if(j!==null)for(Sk.asserts.assert(Sk.isArrayLike(j),"SEQ: nodes isn't array? got "+j.toString()),X=j.length,G=0;G<X;++G)V=j[G],V&&this.visitStmt(V)},P.prototype.SEQExpr=function(j){var V,G,X;if(j!==null)for(Sk.asserts.assert(Sk.isArrayLike(j),"SEQ: nodes isn't array? got "+j.toString()),X=j.length,G=0;G<X;++G)V=j[G],V&&this.visitExpr(V)},P.prototype.enterBlock=function(j,V,G,X){var Q;j=Sk.fixReserved(j),Q=null,this.cur&&(Q=this.cur,this.stack.push(this.cur)),this.cur=new L(this,j,V,G,X),j==="top"&&(this.global=this.cur.symFlags),Q&&Q.children.push(this.cur)},P.prototype.exitBlock=function(){this.cur=null,this.stack.length>0&&(this.cur=this.stack.pop())},P.prototype.visitParams=function(j,V){var G,X;for(X=0;X<j.length;++X)if(G=j[X],G.constructor===Sk.astnodes.arg)this.addDef(G.arg,a,G.lineno);else throw new Sk.builtin.SyntaxError("invalid expression in parameter list",this.filename)},P.prototype.visitArguments=function(j,V){j.args&&this.visitParams(j.args,!0),j.kwonlyargs&&this.visitParams(j.kwonlyargs,!0),j.vararg&&(this.addDef(j.vararg.arg,a,V),this.cur.varargs=!0),j.kwarg&&(this.addDef(j.kwarg.arg,a,V),this.cur.varkeywords=!0)},P.prototype.newTmpname=function(j){this.addDef(new Sk.builtin.str("_["+ ++this.tmpname+"]"),n,j)},P.prototype.addDef=function(j,V,G){var X,Q,Z=Sk.mangleName(this.curClass,j).v;if(Z=Sk.fixReserved(Z),Q=this.cur.symFlags[Z],Q!==void 0){if(V&a&&Q&a)throw new Sk.builtin.SyntaxError("duplicate argument '"+j.v+"' in function definition",this.filename,G);Q|=V}else Q=V;this.cur.symFlags[Z]=Q,V&a?this.cur.varnames.push(Z):V&t&&(Q=V,X=this.global[Z],X!==void 0&&(Q|=X),this.global[Z]=Q)},P.prototype.visitSlice=function(j){var V;switch(j.constructor){case Sk.astnodes.Slice:j.lower&&this.visitExpr(j.lower),j.upper&&this.visitExpr(j.upper),j.step&&this.visitExpr(j.step);break;case Sk.astnodes.ExtSlice:for(V=0;V<j.dims.length;++V)this.visitSlice(j.dims[V]);break;case Sk.astnodes.Index:this.visitExpr(j.value);break;case Sk.astnodes.Ellipsis:break}},P.prototype.visitStmt=function(j){var V,G,X,Q,Z,te;switch(Sk.asserts.assert(j!==void 0,"visitStmt called with undefined"),j.constructor){case Sk.astnodes.FunctionDef:this.addDef(j.name,n,j.lineno),j.args.defaults&&this.SEQExpr(j.args.defaults),j.decorator_list&&this.SEQExpr(j.decorator_list),this.enterBlock(j.name.v,k,j,j.lineno),this.visitArguments(j.args,j.lineno),this.SEQStmt(j.body),this.exitBlock();break;case Sk.astnodes.ClassDef:this.addDef(j.name,n,j.lineno),this.SEQExpr(j.bases),j.decorator_list&&this.SEQExpr(j.decorator_list),this.enterBlock(j.name.v,m,j,j.lineno),Z=this.curClass,this.curClass=j.name,this.SEQStmt(j.body),this.exitBlock();break;case Sk.astnodes.Return:if(j.value&&(this.visitExpr(j.value),this.cur.returnsValue=!0,this.cur.generator))throw new Sk.builtin.SyntaxError("'return' with argument inside generator",this.filename);break;case Sk.astnodes.Delete:this.SEQExpr(j.targets);break;case Sk.astnodes.Assign:this.SEQExpr(j.targets),this.visitExpr(j.value);break;case Sk.astnodes.AnnAssign:if(j.target.constructor==Sk.astnodes.Name){if(te=j.target,G=Sk.mangleName(this.curClass,te.id).v,G=Sk.fixReserved(G),V=this.cur.symFlags[G],V&(t|O)&&this.global!=this.cur.symFlags&&j.simple)throw new Sk.builtin.SyntaxError("annotated name '"+G+"' can't be global",this.filename,j.lineno);j.simple?this.addDef(new Sk.builtin.str(G),D|n,j.lineno):j.value&&this.addDef(new Sk.builtin.str(G),n,j.lineno)}else this.visitExpr(j.target);this.visitExpr(j.annotation),j.value&&this.visitExpr(j.value);break;case Sk.astnodes.AugAssign:this.visitExpr(j.target),this.visitExpr(j.value);break;case Sk.astnodes.Print:j.dest&&this.visitExpr(j.dest),this.SEQExpr(j.values);break;case Sk.astnodes.For:this.visitExpr(j.target),this.visitExpr(j.iter),this.SEQStmt(j.body),j.orelse&&this.SEQStmt(j.orelse);break;case Sk.astnodes.While:this.visitExpr(j.test),this.SEQStmt(j.body),j.orelse&&this.SEQStmt(j.orelse);break;case Sk.astnodes.If:this.visitExpr(j.test),this.SEQStmt(j.body),j.orelse&&this.SEQStmt(j.orelse);break;case Sk.astnodes.Raise:j.exc&&(this.visitExpr(j.exc),j.inst&&(this.visitExpr(j.inst),j.tback&&this.visitExpr(j.tback)),j.cause&&this.visitExpr(j.cause));break;case Sk.astnodes.Assert:this.visitExpr(j.test),j.msg&&this.visitExpr(j.msg);break;case Sk.astnodes.Import:case Sk.astnodes.ImportFrom:this.visitAlias(j.names,j.lineno);break;case Sk.astnodes.Global:for(Q=j.names.length,X=0;X<Q;++X){if(G=Sk.mangleName(this.curClass,j.names[X]).v,G=Sk.fixReserved(G),V=this.cur.symFlags[G],V&(n|i))throw V&n?new Sk.builtin.SyntaxError("name '"+G+"' is assigned to before global declaration",this.filename,j.lineno):new Sk.builtin.SyntaxError("name '"+G+"' is used prior to global declaration",this.filename,j.lineno);this.addDef(new Sk.builtin.str(G),t,j.lineno)}break;case Sk.astnodes.Expr:this.visitExpr(j.value);break;case Sk.astnodes.Pass:case Sk.astnodes.Break:case Sk.astnodes.Continue:case Sk.astnodes.Debugger:break;case Sk.astnodes.With:J(this.visit_withitem.bind(this),j.items),J(this.visitStmt.bind(this),j.body);break;case Sk.astnodes.Try:this.SEQStmt(j.body),this.visitExcepthandlers(j.handlers),this.SEQStmt(j.orelse),this.SEQStmt(j.finalbody);break;default:Sk.asserts.fail("Unhandled type "+j.constructor.name+" in visitStmt")}},P.prototype.visit_withitem=function(j){this.visitExpr(j.context_expr),j.optional_vars&&this.visitExpr(j.optional_vars)};function J(j,V){var G;for(G=0;G<V.length;G++){var X=V[G];j(X)}}P.prototype.visitExpr=function(j){var V;switch(Sk.asserts.assert(j!==void 0,"visitExpr called with undefined"),j.constructor){case Sk.astnodes.BoolOp:this.SEQExpr(j.values);break;case Sk.astnodes.BinOp:this.visitExpr(j.left),this.visitExpr(j.right);break;case Sk.astnodes.UnaryOp:this.visitExpr(j.operand);break;case Sk.astnodes.Lambda:this.addDef(new Sk.builtin.str("lambda"),n,j.lineno),j.args.defaults&&this.SEQExpr(j.args.defaults),this.enterBlock("lambda",k,j,j.lineno),this.visitArguments(j.args,j.lineno),this.visitExpr(j.body),this.exitBlock();break;case Sk.astnodes.IfExp:this.visitExpr(j.test),this.visitExpr(j.body),this.visitExpr(j.orelse);break;case Sk.astnodes.Dict:this.SEQExpr(j.keys),this.SEQExpr(j.values);break;case Sk.astnodes.DictComp:case Sk.astnodes.SetComp:this.visitComprehension(j.generators,0);break;case Sk.astnodes.ListComp:this.newTmpname(j.lineno),this.visitExpr(j.elt),this.visitComprehension(j.generators,0);break;case Sk.astnodes.GeneratorExp:this.visitGenexp(j);break;case Sk.astnodes.Yield:if(j.value&&this.visitExpr(j.value),this.cur.generator=!0,this.cur.returnsValue)throw new Sk.builtin.SyntaxError("'return' with argument inside generator",this.filename);break;case Sk.astnodes.Compare:this.visitExpr(j.left),this.SEQExpr(j.comparators);break;case Sk.astnodes.Call:if(this.visitExpr(j.func),j.args)for(let G of j.args)G.constructor===Sk.astnodes.Starred?this.visitExpr(G.value):this.visitExpr(G);if(j.keywords)for(let G of j.keywords)this.visitExpr(G.value);break;case Sk.astnodes.Num:case Sk.astnodes.Str:case Sk.astnodes.Bytes:break;case Sk.astnodes.JoinedStr:for(let G of j.values)this.visitExpr(G);break;case Sk.astnodes.FormattedValue:this.visitExpr(j.value),j.format_spec&&this.visitExpr(j.format_spec);break;case Sk.astnodes.Attribute:this.visitExpr(j.value);break;case Sk.astnodes.Subscript:this.visitExpr(j.value),this.visitSlice(j.slice);break;case Sk.astnodes.Name:this.addDef(j.id,j.ctx===Sk.astnodes.Load?i:n,j.lineno);break;case Sk.astnodes.NameConstant:break;case Sk.astnodes.List:case Sk.astnodes.Tuple:case Sk.astnodes.Set:this.SEQExpr(j.elts);break;case Sk.astnodes.Starred:this.visitExpr(j.value);break;default:Sk.asserts.fail("Unhandled type "+j.constructor.name+" in visitExpr")}},P.prototype.visitComprehension=function(j,V){var G,X,Q=j.length;for(X=V;X<Q;++X)G=j[X],this.visitExpr(G.target),this.visitExpr(G.iter),this.SEQExpr(G.ifs)},P.prototype.visitAlias=function(j,V){var G,X,Q,Z,te;for(te=0;te<j.length;++te)if(Z=j[te],Q=Z.asname===null?Z.name.v:Z.asname.v,X=Q,G=Q.indexOf("."),G!==-1&&(X=Q.substr(0,G)),Q!=="*")this.addDef(new Sk.builtin.str(X),S,V);else if(this.cur.blockType!==$)throw new Sk.builtin.SyntaxError("import * only allowed at module level",this.filename)},P.prototype.visitGenexp=function(j){var V=j.generators[0];this.visitExpr(V.iter),this.enterBlock("genexpr",k,j,j.lineno),this.cur.generator=!0,this.addDef(new Sk.builtin.str(".0"),a,j.lineno),this.visitExpr(V.target),this.SEQExpr(V.ifs),this.visitComprehension(j.generators,1),this.visitExpr(j.elt),this.exitBlock()},P.prototype.visitExcepthandlers=function(j){var V,G;for(V=0;G=j[V];++V)G.type&&this.visitExpr(G.type),G.name&&this.visitExpr(G.name),this.SEQStmt(G.body)};function K(j,V){var G;for(G in V)j[G]=V[G]}P.prototype.analyzeBlock=function(j,V,G,X){var Q,Z,te,ae,le,re,ke={},oe={},he={},$e={},_e={};j.blockType==m&&(K(he,X),V&&K($e,V));for(re in j.symFlags)le=j.symFlags[re],this.analyzeName(j,oe,re,le,V,ke,G,X);for(j.blockType!==m&&(j.blockType===k&&K($e,ke),V&&K($e,V),K(he,X)),ae={},te=j.children.length,Z=0;Z<te;++Z)Q=j.children[Z],this.analyzeChildBlock(Q,$e,_e,he,ae),(Q.hasFree||Q.childHasFree)&&(j.childHasFree=!0);K(_e,ae),j.blockType===k&&this.analyzeCells(oe,_e);let de=this.updateSymbols(j.symFlags,oe,V,_e,j.blockType===m);j.hasFree=j.hasFree||de,K(G,_e)},P.prototype.analyzeChildBlock=function(j,V,G,X,Q){var Z,te,ae={};K(ae,V),te={},K(te,G),Z={},K(Z,X),this.analyzeBlock(j,ae,te,Z),K(Q,te)},P.prototype.analyzeCells=function(j,V){var G,X;for(X in j)G=j[X],G===v&&V[X]!==void 0&&(j[X]=l,delete V[X])},P.prototype.updateSymbols=function(j,V,G,X,Q){var Z,te,ae,le,re,ke,oe,he=!1;for(oe in j)ke=j[oe],re=V[oe],ke|=re<<F,j[oe]=ke;le=c<<F,ae=0;for(oe in X){if(te=j[oe],te!==void 0){Q&&te&(B|t)&&(Z=te|A,j[oe]=Z);continue}G[oe]!==void 0&&(j[oe]=le,he=!0)}return he},P.prototype.analyzeName=function(j,V,G,X,Q,Z,te,ae){if(X&t){if(X&a)throw new Sk.builtin.SyntaxError("name '"+G+"' is local and global",this.filename,j.lineno);V[G]=N,ae[G]=null,Q&&Q[G]!==void 0&&delete Q[G];return}if(X&B){V[G]=v,Z[G]=null,delete ae[G];return}Q&&Q[G]!==void 0?(V[G]=c,j.hasFree=!0,te[G]=null):(ae&&ae[G]!==void 0||j.isNested&&(j.hasFree=!0),V[G]=h)},P.prototype.analyze=function(){var j={},V={};this.analyzeBlock(this.top,null,j,V)},Sk.symboltable=function(j,V){var G,X=new P(V);for(X.enterBlock("top",$,j,0),X.top=X.cur,G=0;G<j.body.length;++G)X.visitStmt(j.body[G]);return X.exitBlock(),X.analyze(),X},Sk.dumpSymtab=function(j){var V=function(Q){return Q?"True":"False"},G=function(Q){var Z,te=[];for(Z=0;Z<Q.length;++Z)te.push(new Sk.builtin.str(Q[Z]).$r().v);return"["+te.join(", ")+"]"},X=function(Q,Z){var te,ae,le,re,ke,oe,he,$e,_e,de;for(Z===void 0&&(Z=""),de="",de+=Z+"Sym_type: "+Q.get_type()+`
`,de+=Z+"Sym_name: "+Q.get_name()+`
`,de+=Z+"Sym_lineno: "+Q.get_lineno()+`
`,de+=Z+"Sym_nested: "+V(Q.is_nested())+`
`,de+=Z+"Sym_haschildren: "+V(Q.has_children())+`
`,Q.get_type()==="class"?de+=Z+"Class_methods: "+G(Q.get_methods())+`
`:Q.get_type()==="function"&&(de+=Z+"Func_params: "+G(Q.get_parameters())+`
`,de+=Z+"Func_locals: "+G(Q.get_locals())+`
`,de+=Z+"Func_globals: "+G(Q.get_globals())+`
`,de+=Z+"Func_frees: "+G(Q.get_frees())+`
`),de+=Z+`-- Identifiers --
`,_e=Q.get_identifiers(),$e=_e.length,he=0;he<$e;++he){for(oe=Q.lookup(_e[he]),de+=Z+"name: "+oe.get_name()+`
`,de+=Z+"  is_referenced: "+V(oe.is_referenced())+`
`,de+=Z+"  is_imported: "+V(oe.is_imported())+`
`,de+=Z+"  is_parameter: "+V(oe.is_parameter())+`
`,de+=Z+"  is_global: "+V(oe.is_global())+`
`,de+=Z+"  is_declared_global: "+V(oe.is_declared_global())+`
`,de+=Z+"  is_local: "+V(oe.is_local())+`
`,de+=Z+"  is_free: "+V(oe.is_free())+`
`,de+=Z+"  is_assigned: "+V(oe.is_assigned())+`
`,de+=Z+"  is_namespace: "+V(oe.is_namespace())+`
`,ke=oe.get_namespaces(),re=ke.length,de+=Z+`  namespaces: [
`,le=[],ae=0;ae<re;++ae)te=ke[ae],le.push(X(te,Z+"    "));de+=le.join(`
`),de+=Z+`  ]
`}return de};return X(j.top,"")},Sk.exportSymbol("Sk.symboltable",Sk.symboltable),Sk.exportSymbol("Sk.dumpSymtab",Sk.dumpSymtab)}),"./src/timsort.js":(function(Y,y){Sk.builtin.timSort=function(t,n){this.list=new Sk.builtin.list(t.v),this.MIN_GALLOP=7,n?this.listlength=n:this.listlength=t.sq$length()},Sk.builtin.timSort.prototype.lt=function(t,n){return Sk.misceval.richCompareBool(t,n,"Lt")},Sk.builtin.timSort.prototype.le=function(t,n){return!this.lt(n,t)},Sk.builtin.timSort.prototype.setitem=function(t,n){this.list.v[t]=n},Sk.builtin.timSort.prototype.binary_sort=function(t,n){var a,i,r,o,p;for(p=t.base+n;p<t.base+t.len;p++){for(o=t.base,r=p,a=t.getitem(r);o<r;)i=o+(r-o>>1),this.lt(a,t.getitem(i))?r=i:o=i+1;for(Sk.asserts.assert(o===r),i=p;i>o;i--)t.setitem(i,t.getitem(i-1));t.setitem(o,a)}},Sk.builtin.timSort.prototype.count_run=function(t){var n,a,i;if(t.len<=1)n=t.len,i=!1;else if(n=2,this.lt(t.getitem(t.base+1),t.getitem(t.base)))for(i=!0,a=t.base+2;a<t.base+t.len&&this.lt(t.getitem(a),t.getitem(a-1));a++)n++;else for(i=!1,a=t.base+2;a<t.base+t.len&&!this.lt(t.getitem(a),t.getitem(a-1));a++)n++;return{run:new Sk.builtin.listSlice(t.list,t.base,n),descending:i}},Sk.builtin.timSort.prototype.sort=function(){var t,n,a,i=new Sk.builtin.listSlice(this.list,0,this.listlength);if(!(i.len<2)){for(this.merge_init(),t=this.merge_compute_minrun(i.len);i.len>0;)n=this.count_run(i),n.descending&&n.run.reverse(),n.run.len<t&&(a=n.run.len,t<i.len?n.run.len=t:n.run.len=i.len,this.binary_sort(n.run,a)),i.advance(n.run.len),this.pending.push(n.run),this.merge_collapse();Sk.asserts.assert(i.base==this.listlength),this.merge_force_collapse(),Sk.asserts.assert(this.pending.length==1),Sk.asserts.assert(this.pending[0].base===0),Sk.asserts.assert(this.pending[0].len==this.listlength)}},Sk.builtin.timSort.prototype.gallop=function(t,n,a,i){var r,o,p,w,T,A,S,O,D;if(Sk.asserts.assert(0<=a&&a<n.len),o=this,i?r=function(B,F){return o.le(B,F)}:r=function(B,F){return o.lt(B,F)},p=n.base+a,w=0,T=1,r(n.getitem(p),t)){for(A=n.len-a;T<A&&r(n.getitem(p+T),t);){w=T;try{T=(T<<1)+1}catch{T=A}}T>A&&(T=A),w+=a,T+=a}else{for(A=a+1;T<A&&!r(n.getitem(p-T),t);){w=T;try{T=(T<<1)+1}catch{T=A}}T>A&&(T=A),S=a-T,O=a-w,w=S,T=O}for(Sk.asserts.assert(-1<=w<T<=n.len),w+=1;w<T;)D=w+(T-w>>1),r(n.getitem(n.base+D),t)?w=D+1:T=D;return Sk.asserts.assert(w==T),T},Sk.builtin.timSort.prototype.merge_init=function(){this.min_gallop=this.MIN_GALLOP,this.pending=[]},Sk.builtin.timSort.prototype.merge_lo=function(t,n){var a,i,r,o,p;Sk.asserts.assert(t.len>0&&n.len>0&&t.base+t.len==n.base),a=this.min_gallop,i=t.base,t=t.copyitems();try{if(this.setitem(i,n.popleft()),i++,t.len==1||n.len===0)return;for(;;){for(r=0,o=0;;)if(this.lt(n.getitem(n.base),t.getitem(t.base))){if(this.setitem(i,n.popleft()),i++,n.len===0)return;if(o++,r=0,o>=a)break}else{if(this.setitem(i,t.popleft()),i++,t.len==1)return;if(r++,o=0,r>=a)break}for(a+=1;;){for(a-=a>1,this.min_gallop=a,r=this.gallop(n.getitem(n.base),t,0,!0),p=t.base;p<t.base+r;p++)this.setitem(i,t.getitem(p)),i++;if(t.advance(r),t.len<=1||(this.setitem(i,n.popleft()),i++,n.len===0))return;for(o=this.gallop(t.getitem(t.base),n,0,!1),p=n.base;p<n.base+o;p++)this.setitem(i,n.getitem(p)),i++;if(n.advance(o),n.len===0||(this.setitem(i,t.popleft()),i++,t.len==1))return;if(r<this.MIN_GALLOP&&o<this.MIN_GALLOP)break;a++,this.min_gallop=a}}}finally{for(Sk.asserts.assert(t.len>=0&&n.len>=0),p=n.base;p<n.base+n.len;p++)this.setitem(i,n.getitem(p)),i++;for(p=t.base;p<t.base+t.len;p++)this.setitem(i,t.getitem(p)),i++}},Sk.builtin.timSort.prototype.merge_hi=function(t,n){var a,i,r,o,p,w,T,A;Sk.asserts.assert(t.len>0&&n.len>0&&t.base+t.len==n.base),a=this.min_gallop,i=n.base+n.len,n=n.copyitems();try{if(i--,this.setitem(i,t.popright()),t.len===0||n.len==1)return;for(;;){for(r=0,o=0;;)if(p=t.getitem(t.base+t.len-1),w=n.getitem(n.base+n.len-1),this.lt(w,p)){if(i--,this.setitem(i,p),t.len--,t.len===0)return;if(r++,o=0,r>=a)break}else{if(i--,this.setitem(i,w),n.len--,n.len==1)return;if(o++,r=0,o>=a)break}for(a+=1;;){for(a-=a>1,this.min_gallop=a,w=n.getitem(n.base+n.len-1),T=this.gallop(w,t,t.len-1,!0),r=t.len-T,A=t.base+t.len-1;A>t.base+T-1;A--)i--,this.setitem(i,t.getitem(A));if(t.len-=r,t.len===0||(i--,this.setitem(i,n.popright()),n.len==1))return;for(p=t.getitem(t.base+t.len-1),T=this.gallop(p,n,n.len-1,!1),o=n.len-T,A=n.base+n.len-1;A>n.base+T-1;A--)i--,this.setitem(i,n.getitem(A));if(n.len-=o,n.len<=1||(i--,this.setitem(i,t.popright()),t.len===0))return;if(r<this.MIN_GALLOP&&o<this.MIN_GALLOP)break;a++,this.min_gallop=a}}}finally{for(Sk.asserts.assert(t.len>=0&&n.len>=0),A=t.base+t.len-1;A>t.base-1;A--)i--,this.setitem(i,t.getitem(A));for(A=n.base+n.len-1;A>n.base-1;A--)i--,this.setitem(i,n.getitem(A))}},Sk.builtin.timSort.prototype.merge_at=function(t){var n,a,i;t<0&&(t=this.pending.length+t),n=this.pending[t],a=this.pending[t+1],Sk.asserts.assert(n.len>0&&a.len>0),Sk.asserts.assert(n.base+n.len==a.base),this.pending[t]=new Sk.builtin.listSlice(this.list,n.base,n.len+a.len),this.pending.splice(t+1,1),i=this.gallop(a.getitem(a.base),n,0,!0),n.advance(i),n.len!==0&&(a.len=this.gallop(n.getitem(n.base+n.len-1),a,a.len-1,!1),a.len!==0&&(n.len<=a.len?this.merge_lo(n,a):this.merge_hi(n,a)))},Sk.builtin.timSort.prototype.merge_collapse=function(){for(var t=this.pending;t.length>1;)if(t.length>=3&&t[t.length-3].len<=t[t.length-2].len+t[t.length-1].len)t[t.length-3].len<t[t.length-1].len?this.merge_at(-3):this.merge_at(-2);else if(t[t.length-2].len<=t[t.length-1].len)this.merge_at(-2);else break},Sk.builtin.timSort.prototype.merge_force_collapse=function(){for(var t=this.pending;t.length>1;)t.length>=3&&t[t.length-3].len<t[t.length-1].len?this.merge_at(-3):this.merge_at(-2)},Sk.builtin.timSort.prototype.merge_compute_minrun=function(t){for(var n=0;t>=64;)n=n|t&1,t>>=1;return t+n},Sk.builtin.listSlice=function(t,n,a){this.list=t,this.base=n,this.len=a},Sk.builtin.listSlice.prototype.copyitems=function(){var t=this.base,n=this.base+this.len;return Sk.asserts.assert(0<=t<=n),new Sk.builtin.listSlice(new Sk.builtin.list(this.list.v.slice(t,n)),0,this.len)},Sk.builtin.listSlice.prototype.advance=function(t){this.base+=t,this.len-=t,Sk.asserts.assert(this.base<=this.list.sq$length())},Sk.builtin.listSlice.prototype.getitem=function(t){return this.list.v[t]},Sk.builtin.listSlice.prototype.setitem=function(t,n){this.list.v[t]=n},Sk.builtin.listSlice.prototype.popleft=function(){var t=this.list.v[this.base];return this.base++,this.len--,t},Sk.builtin.listSlice.prototype.popright=function(){return this.len--,this.list.v[this.base+this.len]},Sk.builtin.listSlice.prototype.reverse=function(){for(var t,n,a=this.list,i=this.base,r=i+this.len-1;i<r;)t=a.v[r],n=a.v[i],a.v[i]=t,a.v[r]=n,i++,r--},Sk.exportSymbol("Sk.builtin.listSlice",Sk.builtin.listSlice),Sk.exportSymbol("Sk.builtin.timSort",Sk.builtin.timSort)}),"./src/token.js":(function(Y,y){var t=["tok_name","ISTERMINAL","ISNONTERMINAL","ISEOF"],n={T_ENDMARKER:0,T_NAME:1,T_NUMBER:2,T_STRING:3,T_NEWLINE:4,T_INDENT:5,T_DEDENT:6,T_LPAR:7,T_RPAR:8,T_LSQB:9,T_RSQB:10,T_COLON:11,T_COMMA:12,T_SEMI:13,T_PLUS:14,T_MINUS:15,T_STAR:16,T_SLASH:17,T_VBAR:18,T_AMPER:19,T_LESS:20,T_GREATER:21,T_EQUAL:22,T_DOT:23,T_PERCENT:24,T_LBRACE:25,T_RBRACE:26,T_EQEQUAL:27,T_NOTEQUAL:28,T_LESSEQUAL:29,T_GREATEREQUAL:30,T_TILDE:31,T_CIRCUMFLEX:32,T_LEFTSHIFT:33,T_RIGHTSHIFT:34,T_DOUBLESTAR:35,T_PLUSEQUAL:36,T_MINEQUAL:37,T_STAREQUAL:38,T_SLASHEQUAL:39,T_PERCENTEQUAL:40,T_AMPEREQUAL:41,T_VBAREQUAL:42,T_CIRCUMFLEXEQUAL:43,T_LEFTSHIFTEQUAL:44,T_RIGHTSHIFTEQUAL:45,T_DOUBLESTAREQUAL:46,T_DOUBLESLASH:47,T_DOUBLESLASHEQUAL:48,T_AT:49,T_ATEQUAL:50,T_RARROW:51,T_ELLIPSIS:52,T_OP:53,T_AWAIT:54,T_ASYNC:55,T_ERRORTOKEN:56,T_NT_OFFSET:256,T_N_TOKENS:60,T_COMMENT:57,T_NL:58,T_ENCODING:59},a={"!=":n.T_NOTEQUAL,"%":n.T_PERCENT,"%=":n.T_PERCENTEQUAL,"&":n.T_AMPER,"&=":n.T_AMPEREQUAL,"(":n.T_LPAR,")":n.T_RPAR,"*":n.T_STAR,"**":n.T_DOUBLESTAR,"**=":n.T_DOUBLESTAREQUAL,"*=":n.T_STAREQUAL,"+":n.T_PLUS,"+=":n.T_PLUSEQUAL,",":n.T_COMMA,"-":n.T_MINUS,"-=":n.T_MINEQUAL,"->":n.T_RARROW,".":n.T_DOT,"...":n.T_ELLIPSIS,"/":n.T_SLASH,"//":n.T_DOUBLESLASH,"//=":n.T_DOUBLESLASHEQUAL,"/=":n.T_SLASHEQUAL,":":n.T_COLON,";":n.T_SEMI,"<":n.T_LESS,"<<":n.T_LEFTSHIFT,"<<=":n.T_LEFTSHIFTEQUAL,"<=":n.T_LESSEQUAL,"=":n.T_EQUAL,"==":n.T_EQEQUAL,">":n.T_GREATER,">=":n.T_GREATEREQUAL,">>":n.T_RIGHTSHIFT,">>=":n.T_RIGHTSHIFTEQUAL,"@":n.T_AT,"@=":n.T_ATEQUAL,"[":n.T_LSQB,"]":n.T_RSQB,"^":n.T_CIRCUMFLEX,"^=":n.T_CIRCUMFLEXEQUAL,"{":n.T_LBRACE,"|":n.T_VBAR,"|=":n.T_VBAREQUAL,"}":n.T_RBRACE,"~":n.T_TILDE},i={};(function(){for(var w in n)i[n[w]]=w})(),t.concat(Object.keys(i).map(function(w){return i[w]}));function r(w){return w<n.T_NT_OFFSET}function o(w){return w>=n.T_NT_OFFSET}function p(w){return w==n.T_ENDMARKER}Sk.token={},Sk.token.tokens=n,Sk.token.tok_name=i,Sk.token.EXACT_TOKEN_TYPES=a,Sk.token.ISTERMINAL=r,Sk.token.ISNONTERMINAL=o,Sk.token.ISEOF=p,Sk.exportSymbol("Sk.token",Sk.token),Sk.exportSymbol("Sk.token.tokens",Sk.token.tokens),Sk.exportSymbol("Sk.token.tok_name",Sk.token.tok_name),Sk.exportSymbol("Sk.token.EXACT_TOKEN_TYPES"),Sk.exportSymbol("Sk.token.ISTERMINAL",Sk.token.ISTERMINAL),Sk.exportSymbol("Sk.token.ISNONTERMINAL",Sk.token.ISNONTERMINAL),Sk.exportSymbol("Sk.token.ISEOF",Sk.token.ISEOF)}),"./src/tokenize.js":(function(Y,y){var t=Sk.token.tokens;let n=Sk.builtin.SyntaxError,a=Sk.builtin.SyntaxError;function i(te,ae,le,re,ke){this.type=te,this.string=ae,this.start=le,this.end=re,this.line=ke}i.prototype.exact_type=function(){return this.type==t.T_OP&&this.string in Sk.token.EXACT_TOKEN_TYPES?Sk.token.EXACT_TOKEN_TYPES[this.string]:this.type};function r(te){var ae=Array.prototype.slice.call(arguments);return"("+ae.join("|")+")"}function o(te){return r.apply(null,arguments)+"*"}function p(te){return r.apply(null,arguments)+"?"}var w=/[\\^$.*+?()[\]{}|]/g,T=RegExp(w.source);function A(te){return te&&T.test(te)?te.replace(w,"\\$&"):te}function S(te,ae){for(var le=te.length;le--;)if(te[le]===ae)return!0;return!1}function O(te,ae){var le;for(le=te.length;le>0&&ae.indexOf(te.charAt(le-1))!==-1;--le);return te.substring(0,le)}let D=(function(){var te="_",ae="[A-Z]",le="[a-z]",re="[\\u{10B99}-\\u{10B9C}\\u{112A9}\\u{115DC}-\\u{115DD}\\u034F\\u115F-\\u1160\\u17B4-\\u17B5\\u2065\\u3164\\uFFA0\\uFFF0-\\uFFF8\\u{E0000}\\u{E0002}-\\u{E001F}\\u{E0080}-\\u{E00FF}\\u{E01F0}-\\u{E0FFF}\\u{112A9}\\u00D7]",ke="[\\u02B0-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0374\\u037A\\u0559\\u06E5-\\u06E6\\u07F4-\\u07F5\\u0971\\u1C78-\\u1C7D\\u1D2C-\\u1D6A\\u1DFD-\\u1DFF\\u2E2F\\u30FC\\uA67F\\uA69C-\\uA69D\\uA717-\\uA71F\\uA788\\uA7F8-\\uA7F9\\uAB5C-\\uAB5F\\uFF70\\uFF9E-\\uFF9F\\u{16F93}-\\u{16F9F}\\u02D0-\\u02D1\\u0640\\u07FA\\u0E46\\u0EC6\\u1843\\u1AA7\\u1C7B\\u3005\\u3031-\\u3035\\u309D-\\u309E\\u30FC-\\u30FE\\uA015\\uA60C\\uA9CF\\uA9E6\\uAA70\\uAADD\\uAAF3-\\uAAF4\\uFF70\\u{16B42}-\\u{16B43}\\u{16FE0}-\\u{16FE1}\\u02B0-\\u02B8\\u02C0-\\u02C1\\u02E0-\\u02E4\\u037A\\u1D2C-\\u1D6A\\u1D78\\u1D9B-\\u1DBF\\u2071\\u207F\\u2090-\\u209C\\u2C7C-\\u2C7D\\uA69C-\\uA69D\\uA770\\uA7F8-\\uA7F9\\uAB5C-\\uAB5F\\uFF9E-\\uFF9F\\u02B2\\u1D62\\u1DA4\\u1DA8\\u2071\\u2C7C\\u2E18-\\u2E19\\u2E2F]",oe="[\\u2135-\\u2138\\u{1EE00}-\\u{1EE03}\\u{1EE05}-\\u{1EE1F}\\u{1EE21}-\\u{1EE22}\\u{1EE24}\\u{1EE27}\\u{1EE29}-\\u{1EE32}\\u{1EE34}-\\u{1EE37}\\u{1EE39}\\u{1EE3B}\\u{1EE42}\\u{1EE47}\\u{1EE49}\\u{1EE4B}\\u{1EE4D}-\\u{1EE4F}\\u{1EE51}-\\u{1EE52}\\u{1EE54}\\u{1EE57}\\u{1EE59}\\u{1EE5B}\\u{1EE5D}\\u{1EE5F}\\u{1EE61}-\\u{1EE62}\\u{1EE64}\\u{1EE67}-\\u{1EE6A}\\u{1EE6C}-\\u{1EE72}\\u{1EE74}-\\u{1EE77}\\u{1EE79}-\\u{1EE7C}\\u{1EE7E}\\u{1EE80}-\\u{1EE89}\\u{1EE8B}-\\u{1EE9B}\\u{1EEA1}-\\u{1EEA3}\\u{1EEA5}-\\u{1EEA9}\\u{1EEAB}-\\u{1EEBB}\\u3006\\u3400-\\u4DB5\\u4E00-\\u9FEF\\uF900-\\uFA6D\\uFA70-\\uFAD9\\u{17000}-\\u{187F1}\\u{18800}-\\u{18AF2}\\u{1B170}-\\u{1B2FB}\\u{20000}-\\u{2A6D6}\\u{2A700}-\\u{2B734}\\u{2B740}-\\u{2B81D}\\u{2B820}-\\u{2CEA1}\\u{2CEB0}-\\u{2EBE0}\\u{2F800}-\\u{2FA1D}\\uAAC0\\uAAC2\\uFE20-\\uFE2F\\u{10D22}-\\u{10D23}\\u{1135D}\\u00AA\\u00BA\\u3400-\\u4DB5\\u4E00-\\u9FEF\\uFA0E-\\uFA0F\\uFA11\\uFA13-\\uFA14\\uFA1F\\uFA21\\uFA23-\\uFA24\\uFA27-\\uFA29\\u{20000}-\\u{2A6D6}\\u{2A700}-\\u{2B734}\\u{2B740}-\\u{2B81D}\\u{2B820}-\\u{2CEA1}\\u{2CEB0}-\\u{2EBE0}\\u115F-\\u1160\\u3164\\uFFA0\\u0673\\u17A3-\\u17A4\\u0E40-\\u0E44\\u0EC0-\\u0EC4\\u19B5-\\u19B7\\u19BA\\uAAB5-\\uAAB6\\uAAB9\\uAABB-\\uAABC]",he="[\\u3007\\u3021-\\u3029\\u3038-\\u303A\\u2170-\\u217F\\u2160-\\u216F]",$e="[\\u104A-\\u104B\\u102B-\\u102C\\u102D-\\u1030\\u1031\\u1032-\\u1036\\u1038\\u103B-\\u103C\\u103D-\\u103E\\u1056-\\u1057\\u1058-\\u1059\\u105E-\\u1060\\u1062\\u1067-\\u1068\\u1071-\\u1074\\u1082\\u1083-\\u1084\\u1085-\\u1086\\u109C\\u109D\\u1037\\u1039-\\u103A\\u1087-\\u108C\\u108D\\u108F\\u109A-\\u109B\\uA9E5\\uAA7B\\uAA7C\\uAA7D\\uA9E6\\uAA70\\u104A-\\u104B]",_e="[\\u0903\\u093B\\u093E-\\u0940\\u0949-\\u094C\\u094E-\\u094F\\u0982-\\u0983\\u09BE-\\u09C0\\u09C7-\\u09C8\\u09CB-\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB-\\u0ACC\\u0B02-\\u0B03\\u0B3E\\u0B40\\u0B47-\\u0B48\\u0B4B-\\u0B4C\\u0B57\\u0BBE-\\u0BBF\\u0BC1-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82-\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7-\\u0CC8\\u0CCA-\\u0CCB\\u0CD5-\\u0CD6\\u0D02-\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82-\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2-\\u0DF3\\u0F7F\\u102B-\\u102C\\u1031\\u1038\\u103B-\\u103C\\u1056-\\u1057\\u1062\\u1067-\\u1068\\u1083-\\u1084\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7-\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930-\\u1931\\u1933-\\u1938\\u1A19-\\u1A1A\\u1A55\\u1A57\\u1A61\\u1A63-\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B82\\u1BA1\\u1BA6-\\u1BA7\\u1BE7\\u1BEA-\\u1BEC\\u1BEE\\u1C24-\\u1C2B\\u1C34-\\u1C35\\u1CF2-\\u1CF3\\uA823-\\uA824\\uA827\\uA880-\\uA881\\uA8B4-\\uA8C3\\uA952\\uA983\\uA9B4-\\uA9B5\\uA9BA-\\uA9BB\\uA9BD-\\uA9BF\\uAA2F-\\uAA30\\uAA33-\\uAA34\\uAA4D\\uAAEB\\uAAEE-\\uAAEF\\uAAF5\\uABE3-\\uABE4\\uABE6-\\uABE7\\uABE9-\\uABEA\\u{11000}\\u{11002}\\u{11082}\\u{110B0}-\\u{110B2}\\u{110B7}-\\u{110B8}\\u{1112C}\\u{11145}-\\u{11146}\\u{11182}\\u{111B3}-\\u{111B5}\\u{111BF}\\u{1122C}-\\u{1122E}\\u{11232}-\\u{11233}\\u{112E0}-\\u{112E2}\\u{11302}-\\u{11303}\\u{1133E}-\\u{1133F}\\u{11341}-\\u{11344}\\u{11347}-\\u{11348}\\u{1134B}-\\u{1134C}\\u{11357}\\u{11362}-\\u{11363}\\u{11435}-\\u{11437}\\u{11440}-\\u{11441}\\u{11445}\\u{114B0}-\\u{114B2}\\u{114B9}\\u{114BB}-\\u{114BE}\\u{114C1}\\u{115AF}-\\u{115B1}\\u{115B8}-\\u{115BB}\\u{115BE}\\u{11630}-\\u{11632}\\u{1163B}-\\u{1163C}\\u{1163E}\\u{116AC}\\u{116AE}-\\u{116AF}\\u{11720}-\\u{11721}\\u{11726}\\u{1182C}-\\u{1182E}\\u{11838}\\u{11A39}\\u{11A57}-\\u{11A58}\\u{11A97}\\u{11C2F}\\u{11C3E}\\u{11CA9}\\u{11CB1}\\u{11CB4}\\u{11D8A}-\\u{11D8E}\\u{11D93}-\\u{11D94}\\u{11D96}\\u{11EF5}-\\u{11EF6}\\u{16F51}-\\u{16F7E}\\u0F3E-\\u0F3F\\u1087-\\u108C\\u108F\\u109A-\\u109B\\u1B44\\u1BAA\\u1CE1\\u1CF7\\u302E-\\u302F\\uA953\\uA9C0\\uAA7B\\uAA7D\\uABEC\\u{111C0}\\u{11235}\\u{1134D}\\u{116B6}\\u{1D16D}-\\u{1D172}\\u09BE\\u09D7\\u0B3E\\u0B57\\u0BBE\\u0BD7\\u0CC2\\u0CD5-\\u0CD6\\u0D3E\\u0D57\\u0DCF\\u0DDF\\u302E-\\u302F\\u{1133E}\\u{11357}\\u{114B0}\\u{114BD}\\u{115AF}\\u{1D165}\\u{1D16E}-\\u{1D172}]",de="[\\u{1D7CE}-\\u{1D7FF}\\uFF10-\\uFF19]",Oe="\\u2040",Ie="[\\u1885-\\u1886\\u2118\\u212E\\u309B-\\u309C]",ze="[\\u00B7\\u0387\\u1369-\\u1371\\u19DA]",Pe=r(ae,le,re,ke,oe,he,te,Ie),ye=r(Pe,$e,_e,de,Oe,ze);return RegExp().unicode===!1?new RegExp("^"+Pe+"+"+ye+"*$","u"):(Pe=r(ae,le,te),ye=r(Pe,"[0-9]"),new RegExp("^"+Pe+"+"+ye+"*$"))})();function B(te){var ae=te.normalize("NFKC");return D.test(ae)}var F="[ \\f\\t]*",s="#[^\\r\\n]*",v=F+o("\\\\\\r?\\n"+F)+p(s),N="\\w+",h="[eE][-+]?[0-9](?:_?[0-9])*",c=r("[0-9](?:_?[0-9])*\\.(?:[0-9](?:_?[0-9])*)?","\\.[0-9](?:_?[0-9])*")+p(h),l="[0-9](?:_?[0-9])*"+h,d=r(c,l),_=r("[0-9](?:_?[0-9])*[jJ]",d+"[jJ]");function E(){return["","FR","RF","Br","BR","Fr","r","B","R","b","bR","f","rb","rB","F","Rf","U","rF","u","RB","br","fR","fr","rf","Rb"]}var b=r.apply(null,E()),R="^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'",f='^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"',$="^[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''",k='^[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""',m=r(b+"'''",b+'"""'),g=r(b+"'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*'",b+'"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*"'),x,C,L;function P(te){te?delete Sk.token.EXACT_TOKEN_TYPES["<>"]:Sk.token.EXACT_TOKEN_TYPES["<>"]=Sk.token.tokens.T_NOTEQUAL,x=Object.keys(Sk.token.EXACT_TOKEN_TYPES).sort(),C=r.apply(this,x.reverse().map(function(ae){return A(ae)})),L=r("\\r?\\n",C)}P(!0),Sk.token.setupTokens=P;var J=r(b+"'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*"+r("'","\\\\\\r?\\n"),b+'"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*'+r('"',"\\\\\\r?\\n")),K=r("\\\\\\r?\\n|$",s,m),j={},V=E();for(let te of V)j[te+"'"]=R,j[te+'"']=f,j[te+"'''"]=$,j[te+'"""']=k;let G=[],X=[];for(let te of V)G.push(te+'"'),G.push(te+"'"),X.push(te+'"""'),X.push(te+"'''");var Q=8;function Z(te,ae,le,re){var ke=Sk.__future__.python3?"":"(?:L?)",oe="0[xX](?:_?[0-9a-fA-F])+"+ke,he="0[bB](?:_?[01])+"+ke,$e="0([oO])(?:_?[0-7])+"+ke,_e="0([oO]?)(?:_?[0-7])+"+ke,de="(?:0(?:_?0)*|[1-9](?:_?[0-9])*)"+ke,Oe=r(oe,he,Sk.__future__.silent_octal_literal?_e:$e,de),Ie=r(_,d,Oe),ze=F+r(K,Ie,L,J,N);let Pe=new RegExp(ze);var ye=0,Ze=0,ut=0,kt="0123456789",Le="",ct=0,qe=null,Fe=[0],Ye=null,et=void 0,We=void 0,Ue=void 0,ft=void 0;le!==void 0&&(le=="utf-8-sig"&&(le="utf-8"),re(new i(t.T_ENCODING,le,[0,0],[0,0],"")));for(var Xe="",ce="";;){try{Xe=ce,ce=ae()}catch{ce=""}ye+=1;var me=0,dt=ce.length;if(Le){if(!ce)throw new n("EOF in multi-line string",te,We[0],We[1]);et.lastIndex=0;var je=et.exec(ce);if(je)me=Ue=je[0].length,re(new i(t.T_STRING,Le+ce.substring(0,Ue),We,[ye,Ue],qe+ce)),Le="",ct=0,qe=null;else if(ct&&ce.substring(ce.length-2)!==`\\
`&&ce.substring(ce.length-3)!==`\\\r
`){re(new i(t.T_ERRORTOKEN,Le+ce,We,[ye,ce.length],qe)),Le="",qe=null;continue}else{Le=Le+ce,qe=qe+ce;continue}}else if(Ze==0&&!ut){if(!ce)break;for(var Ge=0;me<dt;){if(ce[me]==" ")Ge+=1;else if(ce[me]=="	")Ge=Math.floor(Ge/Q+1)*Q;else if(ce[me]=="\f")Ge=0;else break;me+=1}if(me==dt)break;if(S(`#\r
`,ce[me])){if(ce[me]=="#"){var pt=O(ce.substring(me),`\r
`);re(new i(t.T_COMMENT,pt,[ye,me],[ye,me+pt.length],ce)),me+=pt.length}re(new i(t.T_NL,ce.substring(me),[ye,me],[ye,ce.length],ce));continue}for(Ge>Fe[Fe.length-1]&&(Fe.push(Ge),re(new i(t.T_INDENT,ce.substring(me),[ye,0],[ye,me],ce)));Ge<Fe[Fe.length-1];){if(!S(Fe,Ge))throw new a("unindent does not match any outer indentation level",te,ye,me);Fe=Fe.slice(0,-1),re(new i(t.T_DEDENT,"",[ye,me],[ye,me],ce))}}else{if(!ce)throw new n("EOF in multi-line statement",te,ye,0);ut=0}for(;me<dt;){for(Ye=ce.charAt(me);Ye===" "||Ye==="\f"||Ye==="	";)me+=1,Ye=ce.charAt(me);if(ft=Pe.exec(ce.substring(me)),ft){var Re=me,Ue=Re+ft[1].length,Ve=[ye,Re],He=[ye,Ue],me=Ue;if(Re==Ue)continue;var Ae=ce.substring(Re,Ue),De=ce[Re];if(S(kt,De)||De=="."&&Ae!="."&&Ae!="...")re(new i(t.T_NUMBER,Ae,Ve,He,ce));else if(S(`\r
`,De))Ze>0?re(new i(t.T_NL,Ae,Ve,He,ce)):re(new i(t.T_NEWLINE,Ae,Ve,He,ce));else if(De=="#")re(new i(t.T_COMMENT,Ae,Ve,He,ce));else if(S(X,Ae))if(et=RegExp(j[Ae]),je=et.exec(ce.substring(me)),je)me=je[0].length+me,Ae=ce.substring(Re,me),re(new i(t.T_STRING,Ae,Ve,[ye,me],ce));else{We=[ye,Re],Le=ce.substring(Re),qe=ce;break}else if(S(G,De)||S(G,Ae.substring(0,2))||S(G,Ae.substring(0,3)))if(Ae[Ae.length-1]==`
`){We=[ye,Re],et=RegExp(j[De]||j[Ae[1]]||j[Ae[2]]),Le=ce.substring(Re),ct=1,qe=ce;break}else re(new i(t.T_STRING,Ae,Ve,He,ce));else B(De)?re(new i(t.T_NAME,Ae,Ve,He,ce)):De=="\\"?ut=1:(S("([{",De)?Ze+=1:S(")]}",De)&&(Ze-=1),re(new i(t.T_OP,Ae,Ve,He,ce)))}else re(new i(t.T_ERRORTOKEN,ce[me],[ye,me],[ye,me+1],ce)),me+=1}}Xe&&!S(`\r
`,Xe[Xe.length-1])&&re(new i(t.T_NEWLINE,"",[ye-1,Xe.length],[ye-1,Xe.length+1],""));for(var Bt in Fe.slice(1))re(new i(t.T_DEDENT,"",[ye,0],[ye,0],""));re(new i(t.T_ENDMARKER,"",[ye,0],[ye,0],""))}Sk._tokenize=Z,Sk.exportSymbol("Sk._tokenize",Sk._tokenize)}),"./src/tuple.js":(function(Y,y){Sk.builtin.tuple=Sk.abstr.buildNativeClass("tuple",{constructor:function(a){a===void 0?a=[]:Array.isArray(a)||(a=Sk.misceval.arrayFromIterable(a)),Sk.asserts.assert(this instanceof Sk.builtin.tuple,"bad call to tuple, use 'new' with an Array of python objects"),this.v=a,this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$as_sequence_or_mapping:!0,tp$doc:`Built-in immutable sequence.

If no argument is given, the constructor returns an empty tuple.
If iterable is specified the tuple is initialized from iterable's items.

If the argument is a tuple, the return value is the same object.`,$r(){if(this.in$repr)return new Sk.builtin.str("(...)");this.in$repr=!0;let n=this.v.map(a=>Sk.misceval.objectRepr(a));return this.in$repr=!1,n=n.join(", "),this.v.length===1&&(n+=","),new Sk.builtin.str("("+n+")")},tp$new(n,a){if(this!==Sk.builtin.tuple.prototype)return this.$subtype_new(n,a);Sk.abstr.checkNoKwargs("tuple",a),Sk.abstr.checkArgsLen("tuple",n,0,1);let i=n[0];return i===void 0?new Sk.builtin.tuple([]):i.constructor===Sk.builtin.tuple?i:Sk.misceval.chain(Sk.misceval.arrayFromIterable(i,!0),r=>new Sk.builtin.tuple(r))},tp$hash(){let n,a=3430008,i=1000003,r=this.v.length;for(let o=0;o<r;++o){if(n=Sk.abstr.objectHash(this.v[o]),n===-1)return-1;a=(a^n)*i,i+=82520+r+r}return a+=97531,a===-1&&(a=-2),a|0},tp$richcompare:Sk.generic.seqCompare,tp$iter(){return new t(this)},mp$subscript(n){if(Sk.misceval.isIndex(n)){let a=Sk.misceval.asIndexSized(n);if(a<0&&(a=this.v.length+a),a<0||a>=this.v.length)throw new Sk.builtin.IndexError("tuple index out of range");return this.v[a]}else if(n instanceof Sk.builtin.slice){let a=[];return n.sssiter$(this.v.length,i=>{a.push(this.v[i])}),new Sk.builtin.tuple(a)}throw new Sk.builtin.TypeError("tuple indices must be integers or slices, not "+Sk.abstr.typeName(n))},sq$length(){return this.v.length},sq$repeat(n){if(n=Sk.misceval.asIndexSized(n,Sk.builtin.OverflowError),n===1&&this.constructor===Sk.builtin.tuple)return this;let a=[];for(let i=0;i<n;i++)for(let r=0;r<this.v.length;r++)a.push(this.v[r]);return new Sk.builtin.tuple(a)},sq$concat(n){if(!(n instanceof Sk.builtin.tuple))throw new Sk.builtin.TypeError("can only concatenate tuple (not '"+Sk.abstr.typeName(n)+"') to tuple");return new Sk.builtin.tuple(this.v.concat(n.v))},sq$contains(n){for(let a=this.tp$iter(),i=a.tp$iternext();i!==void 0;i=a.tp$iternext())if(i===n||Sk.misceval.richCompareBool(i,n,"Eq"))return!0;return!1}},proto:{$subtype_new(n,a){let i=new this.constructor,r=Sk.builtin.tuple.prototype.tp$new(n);return i.v=r.v,i},sk$asarray(){return this.v.slice(0)}},methods:{__getnewargs__:{$meth(){return new Sk.builtin.tuple(this.v.slice(0))},$flags:{NoArgs:!0},$textsig:"($self, /)",$doc:null},index:{$meth(n,a,i){if(a!==void 0&&!Sk.misceval.isIndex(a)||i!==void 0&&!Sk.misceval.isIndex(i))throw new Sk.builtin.TypeError("slice indices must be integers or have an __index__ method");({start:a,end:i}=Sk.builtin.slice.startEnd$wrt(this,a,i));let r=this.v;for(let o=a;o<i;o++)if(r[o]===n||Sk.misceval.richCompareBool(r[o],n,"Eq"))return new Sk.builtin.int_(o);throw new Sk.builtin.ValueError("tuple.index(x): x not in tuple")},$flags:{MinArgs:1,MaxArgs:3},$textsig:"($self, value, start=0, stop=sys.maxsize, /)",$doc:`Return first index of value.

Raises ValueError if the value is not present.`},count:{$meth(n){let a=this.v.length,i=this.v,r=0;for(let o=0;o<a;++o)(i[o]===n||Sk.misceval.richCompareBool(i[o],n,"Eq"))&&(r+=1);return new Sk.builtin.int_(r)},$flags:{OneArg:!0},$textsig:"($self, value, /)",$doc:"Return number of occurrences of value."}}}),Sk.exportSymbol("Sk.builtin.tuple",Sk.builtin.tuple);var t=Sk.abstr.buildIteratorClass("tuple_iterator",{constructor:function(a){this.$index=0,this.$seq=a.sk$asarray()},iternext:Sk.generic.iterNextWithArray,methods:{__length_hint__:Sk.generic.iterLengthHintWithArrayMethodDef},flags:{sk$acceptable_as_base_class:!1}})}),"./src/type.js":(function(Y,y){Sk.builtin===void 0&&(Sk.builtin={}),Sk.builtin.type=function(d){return this instanceof Sk.builtin.type&&Sk.asserts.fail("calling new Sk.builtin.type is not safe"),d.ob$type},Object.defineProperties(Sk.builtin.type.prototype,{call:{value:Function.prototype.call},apply:{value:Function.prototype.apply},tp$slots:{value:{tp$doc:`type(object_or_name, bases, dict)
type(object) -> the object's type
type(name, bases, dict) -> a new type`,tp$call:t,tp$new:n,tp$getattr:r,tp$setattr:o,$r:i},writable:!0},tp$methods:{value:null,writable:!0},tp$getsets:{value:null,writable:!0},sk$type:{value:!0},$isSubType:{value:A},$allocateSlot:{value:s},$allocateSlots:{value:F},$allocateGetterSlot:{value:v},$typeLookup:{value:T,writable:!0},$mroMerge:{value:D},$buildMRO:{value:B},sk$attrError:{value(){return"type object '"+this.prototype.tp$name+"'"},writable:!0}});function t(l,d){if(this===Sk.builtin.type){if(l.length===1&&(d===void 0||!d.length))return l[0].ob$type;if(l.length!==3)throw new Sk.builtin.TypeError("type() takes 1 or 3 arguments")}let _=this.prototype.tp$new(l,d);if(_.$isSuspension)return Sk.misceval.chain(_,E=>{if(_=E,!!_.ob$type.$isSubType(this))return _.tp$init(l,d)},()=>_);if(_.ob$type.$isSubType(this)){let E=_.tp$init(l,d);return E!==void 0&&E.$isSuspension?Sk.misceval.chain(E,()=>_):_}else return _}function n(l,d){if(l.length!==3){if(l.length===1&&(d===void 0||!d.length))return l[0].ob$type;throw new Sk.builtin.TypeError("type() takes 1 or 3 arguments")}let _,E,b;if(_=l[0],E=l[1],b=l[2],b.tp$name!=="dict")throw new Sk.builtin.TypeError("type() argument 3 must be dict, not "+Sk.abstr.typeName(b));if(!Sk.builtin.checkString(_))throw new Sk.builtin.TypeError("type() argument 1 must be str, not "+Sk.abstr.typeName(_));if(_=_.$jsstr(),E.tp$name!=="tuple")throw new Sk.builtin.TypeError("type() argument 2 must be tuple, not "+Sk.abstr.typeName(E));E=E.sk$asarray();let R=function(){this.$d=new Sk.builtin.dict};if(S(_,R,E,this.constructor),Sk.globals&&(R.prototype.__module__=Sk.globals.__name__),R.prototype.__doc__=Sk.builtin.none.none$,R.$typeLookup(Sk.builtin.str.$dict)===void 0&&(R.prototype.__dict__=new Sk.builtin.getset_descriptor(R,N)),b.$items().forEach(([f,$])=>{R.prototype[f.$mangled]=$}),R.prototype.hasOwnProperty("__new__")){let f=R.prototype.__new__;f instanceof Sk.builtin.func&&(R.prototype.__new__=new Sk.builtin.staticmethod(f))}return R.$allocateSlots(),R}function a(l,d){if(l&&l.length==1&&d&&d.length)throw new Sk.builtin.TypeError("type.__init__() takes no keyword arguments");if(l.length!=3&&l.length!=1)throw new Sk.builtin.TypeError("type.__init__() takes 1 or 3 arguments");return Sk.builtin.object.prototype.tp$init.call(this,[])}function i(){let l=this.prototype.__module__,d="",_="class";return l&&Sk.builtin.checkString(l)?d=l.v+".":l=null,!l&&!this.sk$klass&&!Sk.__future__.class_repr&&(_="type"),new Sk.builtin.str("<"+_+" '"+d+this.prototype.tp$name+"'>")}function r(l,d){let _,E=this.ob$type,b=E.$typeLookup(l),R;if(b!==void 0&&(R=b.tp$descr_get,R!==void 0&&b.tp$descr_set!==void 0))return _=R.call(b,this,E,d),_;let f=this.$typeLookup(l);if(f!==void 0){let $=f.tp$descr_get;return $!==void 0?(_=$.call(f,null,this,d),_):f}if(R!==void 0)return _=R.call(b,this,E,d),_;if(b!==void 0)return b}function o(l,d,_){if(!this.sk$klass)throw d!==void 0?new Sk.builtin.TypeError("can't set attributes of built-in/extension type '"+this.prototype.tp$name+"'"):new Sk.builtin.TypeError("can't delete attributes on type object '"+this.prototype.tp$name+"'");let E=this.ob$type.$typeLookup(l);if(E!==void 0){let R=E.tp$descr_set;if(R)return R.call(E,this,d,_)}let b=l.$mangled;if(d===void 0){let R=this.prototype;if(R.hasOwnProperty(b)){delete R[b];let f=Sk.dunderToSkulpt[b];f!==void 0&&(delete this.prototype[f],R.sk$prototypical||this.$allocateGetterSlot(b))}else throw new Sk.builtin.AttributeError("type object '"+this.prototype.tp$name+"' has no attribute '"+l.$jsstr()+"'")}else this.prototype[b]=d,b in Sk.dunderToSkulpt&&this.$allocateSlot(b,d)}function p(l){var d=l.$mangled;return this.prototype[d]}function w(l){var d=l.$mangled;let _=this.prototype.tp$mro;for(let E=0;E<_.length;++E){let b=_[E].prototype;if(b.hasOwnProperty(d))return b[d]}}function T(l){return this.prototype.sk$prototypical?p.call(this,l):w.call(this,l)}function A(l){return this===l||this.prototype instanceof l||!this.prototype.sk$prototypical&&this.prototype.tp$mro.includes(l)}function S(l,d,_,E){let b=O(_),R=d.prototype;Sk.abstr.setUpInheritance(l,d,b,E),Object.defineProperties(R,{sk$prototypical:{value:!0,writable:!0},tp$bases:{value:_,writable:!0},tp$mro:{value:null,writable:!0},hp$type:{value:!0,writable:!0}}),R.tp$mro=d.$buildMRO(),Object.defineProperties(d,{$typeLookup:{value:R.sk$prototypical?p:w,writable:!0},sk$klass:{value:!0,writable:!0}})}function O(l){l.length===0&&l.push(Sk.builtin.object);function d(f){return f.sk$klass===void 0?f:d(f.prototype.tp$base)}let _,E,b,R;for(let f=0;f<l.length;f++){if(R=l[f],Sk.builtin.checkClass(R)){if(R.sk$acceptable_as_base_class===!1)throw new Sk.builtin.TypeError("type '"+R.prototype.tp$name+"' is not an acceptable base type")}else throw new Sk.builtin.TypeError("bases must be 'type' objects");if(b=d(R),E===void 0)E=b,_=R;else if(!E.$isSubType(b))if(b.$isSubType(E))E=b,_=R;else throw new Sk.builtin.TypeError("multiple bases have instance layout conflicts")}return _}function D(l){this.prototype.sk$prototypical=!0;let d,_,E,b=[];for(;;){for(_=0;_<l.length&&(d=l[_],d.length===0);++_);if(_===l.length)return b;let R=[];for(_=0;_<l.length;++_)if(d=l[_],d.length!==0){let $=d[0];e:for(E=0;E<l.length;++E){let k=l[E];for(let m=1;m<k.length;++m)if(k[m]===$)break e}E===l.length&&R.push($)}if(R.length===0)throw new Sk.builtin.TypeError("Inconsistent precedences in type hierarchy");let f=R[0];for(b.length&&this.prototype.sk$prototypical&&Object.getPrototypeOf(b[b.length-1].prototype)!==f.prototype&&(this.prototype.sk$prototypical=!1),b.push(f),_=0;_<l.length;++_)d=l[_],d.length>0&&d[0]===f&&d.splice(0,1)}}function B(){let l=[[this]],d=this.prototype.tp$bases;for(let E=0;E<d.length;++E)l.push([...d[E].prototype.tp$mro]);let _=[];for(let E=0;E<d.length;++E)_.push(d[E]);return l.push(_),this.$mroMerge(l)}function F(){let l=this.prototype;this.prototype.sk$prototypical?Object.keys(l).forEach(d=>{d in Sk.slots&&this.$allocateSlot(d,l[d])}):Object.keys(Sk.slots).forEach(d=>{l.hasOwnProperty(d)?this.$allocateSlot(d,l[d]):this.$allocateGetterSlot(d)})}function s(l,d){let _=Sk.slots[l],E=_.$slot_name,b=this.prototype;b.hasOwnProperty(E)&&delete b[E],b[E]=_.$slot_func(d)}function v(l){let d=Sk.slots[l].$slot_name,_=this.prototype;_.hasOwnProperty(d)||Object.defineProperty(_,d,{configurable:!0,get(){let E=_.tp$mro;for(let b=1;b<E.length;b++){let R=E[b].prototype,f=Object.getOwnPropertyDescriptor(R,d);if(f!==void 0&&f.value)return f.value}}})}Sk.builtin.type.prototype.tp$getsets={__base__:{$get(){return this.prototype.tp$base||Sk.builtin.none.none$}},__bases__:{$get(){return this.sk$tuple_bases===void 0&&(this.sk$tuple_bases=new Sk.builtin.tuple(this.prototype.tp$bases)),this.sk$tuple_bases}},__mro__:{$get(){return this.sk$tuple_mro===void 0&&(this.sk$tuple_mro=new Sk.builtin.tuple(this.prototype.tp$mro)),this.sk$tuple_mro}},__dict__:{$get(){return new Sk.builtin.mappingproxy(this.prototype)}},__doc__:{$get(){let l=this.$typeLookup(Sk.builtin.str.$doc);return l?l.tp$descr_get!==void 0?this===Sk.builtin.type?new Sk.builtin.str(this.prototype.tp$doc):l.tp$descr_get(null,this):this.prototype.__doc__:Sk.builtin.none.none$},$set(l){c(this,l,Sk.builtin.str.$doc),this.prototype.__doc__=l}},__name__:{$get(){return new Sk.builtin.str(this.prototype.tp$name)},$set(l){if(c(this,l,Sk.builtin.str.$name),!Sk.builtin.checkString(l))throw new Sk.builtin.TypeError("can only assign string to "+this.prototype.tp$name+".__name__, not '"+Sk.abstr.typeName(l)+"'");this.prototype.tp$name=l.$jsstr()}},__module__:{$get(){let l=this.prototype.__module__;return l&&l.ob$type!==Sk.builtin.getset_descriptor?l:new Sk.builtin.str("builtins")},$set(l){c(this,l,Sk.builtin.str.$module),this.prototype.__module__=l}}},Sk.builtin.type.prototype.tp$methods={mro:{$meth(){return new Sk.builtin.list(this.$buildMRO())},$flags:{NoArgs:!0}},__dir__:{$meth:function(){let d=new Set,_=[];function E(b){b in Sk.reservedWords_||(b=Sk.unfixReserved(b),b.indexOf("$")===-1&&(d.has(b)||(d.add(b),_.push(new Sk.builtin.str(b)))))}if(this.prototype.sk$prototypical)for(let b in this.prototype)E(b);else{let b=this.prototype.tp$mro;for(let R=0;R<b.length;R++){let f=Object.getOwnPropertyNames(b[R].prototype);for(let $=0;$<f.length;$++)E(f[$])}}return new Sk.builtin.list(_)},$flags:{NoArgs:!0},$doc:"Specialized __dir__ implementation for types."}};let N={$get(){let l=h(this.ob$type);return l!==void 0?l.tp$descr_get(this,this.ob$type):Sk.generic.getSetDict.$get.call(this)},$set(l){let d=h(this.ob$type);return d!==void 0?d.tp$descr_set(this,l):Sk.generic.getSetDict.$set.call(this,l)},$doc:"dictionary for instance variables (if defined)",$name:"__dict__"};function h(l){for(;l.prototype.tp$base!==null;){if(l.sk$klass===void 0&&l.prototype.hasOwnProperty("__dict__")){let d=l.prototype.__dict__;return Sk.builtin.checkDataDescr(d)?d:void 0}l=l.prototype.tp$base}}function c(l,d,_){if(l.sk$klass===void 0)throw new Sk.builtin.TypeError("can't set "+l.prototype.tp$name+"."+_.$jsstr());if(d===void 0)throw new Sk.builtin.TypeError("can't delete "+l.prototype.tp$name+"."+_.$jsstr())}}),"./src/util.js":(function(Y,y,t){(function(n){var a={};a.build={githash:"6c99c2196851bb29f0e503afccb01804f089cb60",date:"2021-02-23T18:59:44.706Z"},a.global=typeof n<"u"?n:typeof self<"u"?self:typeof window<"u"?window:{},a.exportSymbol=function(i,r){var o=i.split("."),p=a.global,w,T;for(T=0;T<o.length-1;T++)w=o[T],p.hasOwnProperty(w)?p=p[w]:p=p[w]={};typeof r<"u"&&(w=o[T],p[w]=r)},a.isArrayLike=function(i){return!!(i instanceof Array||i&&i.length&&typeof i.length=="number")},a.js_beautify=function(i){return i},a.exportSymbol("Sk",a),a.exportSymbol("Sk.global",a.global),a.exportSymbol("Sk.build",a.build),a.exportSymbol("Sk.exportSymbol",a.exportSymbol),a.exportSymbol("Sk.isArrayLike",a.isArrayLike),a.exportSymbol("Sk.js_beautify",a.js_beautify)}).call(this,t("./node_modules/webpack/buildin/global.js"))}),"./src/zip.js":(function(Y,y){Sk.builtin.zip_=Sk.abstr.buildIteratorClass("zip",{constructor:function(n){this.$iters=n,n.length===0&&(this.tp$iternext=()=>{})},iternext(t){let n=[],a=Sk.misceval.chain(Sk.misceval.iterArray(this.$iters,i=>Sk.misceval.chain(i.tp$iternext(t),r=>{if(r===void 0)return new Sk.misceval.Break(!0);n.push(r)})),i=>i?void 0:new Sk.builtin.tuple(n));return t?a:Sk.misceval.retryOptionalSuspensionOrThrow(a)},slots:{tp$doc:`zip(iter1 [,iter2 [...]]) --> zip object

Return a zip object whose .__next__() method returns a tuple where
the i-th element comes from the i-th iterable argument.  The .__next__()
method continues until the shortest iterable in the argument sequence
is exhausted and then it raises StopIteration.`,tp$new(t,n){this===Sk.builtin.zip_.prototype&&Sk.abstr.checkNoKwargs("zip",n);let a=[];for(let i=0;i<t.length;i++)try{a.push(Sk.abstr.iter(t[i]))}catch(r){throw r instanceof Sk.builtin.TypeError?new Sk.builtin.TypeError("zip argument #"+(i+1)+" must support iteration"):r}if(this===Sk.builtin.zip_.prototype)return new Sk.builtin.zip_(a);{let i=new this.constructor;return Sk.builtin.zip_.call(i,a),i}}}}),Sk.exportSymbol("Sk.builtin.zip_",Sk.builtin.zip_)}),"./support/polyfills/JSBI.js":(function(Y,y,t){let n=t("./node_modules/jsbi/dist/jsbi-umd.js"),a=Sk.global.JSBI=Sk.global.BigInt!==void 0?{}:n;if(Sk.global.BigInt===void 0){let i=a.__isBigInt;a.__isBigInt=i?r=>r!==null&&i(r):r=>r instanceof a,a.powermod=(r,o,p)=>{let w=a.BigInt(1),T=w;for(o=a.greaterThan(o,a.__ZERO)?o:a.unaryMinus(o);a.greaterThan(o,a.__ZERO);)a.bitwiseAnd(o,w)&&(T=a.remainder(a.multiply(T,r),p)),o=a.signedRightShift(o,w),r=a.remainder(a.multiply(r,r),p);return T}}else Object.assign(a,{BigInt:Sk.global.BigInt,toNumber:i=>Number(i),toString:i=>i.toString(),__isBigInt:i=>typeof i=="bigint",unaryMinus:i=>-i,bitwiseNot:i=>~i,bitwiseAnd:(i,r)=>i&r,bitwiseOr:(i,r)=>i|r,bitwiseXor:(i,r)=>i^r,exponentiate:(i,r)=>{let o=a.BigInt(1),p=o;for(r=r>a.__ZERO?r:-r;r>a.__ZERO;)r&o&&(p=p*i),r=r>>o,i=i*i;return p},powermod:(i,r,o)=>{let p=a.BigInt(1),w=p;for(r=r>a.__ZERO?r:-r;r>a.__ZERO;)r&p&&(w=w*i%o),r=r>>p,i=i*i%o;return w},multiply:(i,r)=>i*r,divide:(i,r)=>i/r,remainder:(i,r)=>i%r,add:(i,r)=>i+r,subtract:(i,r)=>i-r,leftShift:(i,r)=>i<<r,signedRightShift:(i,r)=>i>>r,unsignedRightShift:(i,r)=>i>>>r,lessThan:(i,r)=>i<r,lessThanOrEqual:(i,r)=>i<=r,greaterThan:(i,r)=>i>r,greaterThanOrEqual:(i,r)=>i>=r,equal:(i,r)=>i===r,notEqual:(i,r)=>i!==r});a.__ZERO=a.BigInt(0),a.__MAX_SAFE=a.BigInt(Number.MAX_SAFE_INTEGER),a.__MIN_SAFE=a.BigInt(-Number.MAX_SAFE_INTEGER),a.numberIfSafe=i=>a.lessThan(i,a.__MAX_SAFE)&&a.greaterThan(i,a.__MIN_SAFE)?a.toNumber(i):i}),"./support/time-helpers/strptime.js":(function(Y,y,t){(function(){"use strict";var n=function(i,r,o){return n.parse(i,r,o)};n.version="0.0.1";var a;a=Y.exports=n,a.strptime=n,(function(i){i.locale={a:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],A:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],b:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],B:["January","February","March","April","May","June","July","August","September","October","November","December"],f:["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."],c:"%Y-%m-%d %H:%M:%S",P:["am","pm"],r:"%I:%M:%S %p",x:"%m/%d/%y",X:"%H:%M:%S",day:["Yesterday","Today","Tomorrow"],bg:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Bg:["January","February","March","April","May","June","July","August","September","October","November","December"],fg:["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."],Date_dBY_year_in_HM:"%#B %-d, %Y at %-H:%M",Date_dBY_year:"%#B %-d, %Y",Date_dBY:"%#B %-d, %Y",Date_AdBY:"%A, %#B %-d, %Y",Date_dBA:"%#B %-d, %A",Date_df_in_HM:"%#f, %-d at %-H:%M",Date_dfY:"%-d %#f %Y",Date_dB_in_HM:"%#B %-d at %-H:%M",Date_df:"%-d %#f"}})(n),(function(i){var r=Array.prototype.indexOf||function(O){for(var D=this.length,B=0;B<D;){if(O==this[B])return B;B++}return-1},o=i.locale,p="[\\d\\s]?\\d",w="\\S+",T={"%":"\\%",a:w,A:w,b:{reg:w,make:function(O,D,B,F){return D=r.call(F?o.bg:o.b,S(D,B)),D===-1?!1:(O.setUTCMonth(D),!0)}},h:{reg:w,make:function(O,D,B,F){return D=r.call(F?o.bg:o.b,S(D,B)),D===-1?!1:(O.setUTCMonth(D),!0)}},B:{reg:w,make:function(O,D,B,F){return D=r.call(F?o.Bg:o.B,S(D,B)),D===-1?!1:(O.setUTCMonth(D),!0)}},f:{reg:w,make:function(O,D,B,F){return D=r.call(F?o.fg:o.f,S(D,B)),D===-1?!1:(O.setUTCMonth(D),!0)}},g:{reg:p,make:function(O,D){return D=parseInt(D,10),D<0||D>99?!1:(D=D+100*parseInt(new Date().getUTCFullYear()/100,10),O.setUTCFullYear(D),!0)}},G:{reg:"\\d{4}",make:function(O,D){return D=parseInt(D,10),O.setUTCFullYear(D),!0}},d:{reg:p,make:function(O,D){return D=parseInt(D,10),D<1||D>31?!1:(O.setUTCDate(D),!0)}},e:{reg:p,make:function(O,D){return D=parseInt(D,10),D<1||D>31?!1:(O.setUTCDate(D),!0)}},H:{reg:p,make:function(O,D){return D=parseInt(D,10),D<0||D>23?!1:(O.setUTCHours(D),!0)}},I:{reg:p,make:function(O,D){return D=parseInt(D,10),D<1||D>12?!1:(O.setUTCHours(O.getUTCHours()+D),!0)}},m:{reg:p,make:function(O,D){return D=parseInt(D,10),D<1||D>12?!1:(O.setUTCMonth(D-1),!0)}},M:{reg:p,make:function(O,D){return D=parseInt(D,10),D<0||D>59?!1:(O.setUTCMinutes(D),!0)}},n:"\\n",p:{reg:w,make:function(O,D){return D=r.call(o.P,D.toLowerCase()),D===-1?!1:(D===1&&O.setUTCHours(O.getUTCHours()+12),!0)}},P:{reg:w,make:function(O,D){return D=r.call(o.P,D.toLowerCase()),D===-1?!1:(D===1&&O.setUTCHours(O.getUTCHours()+12),!0)}},S:{reg:p,make:function(O,D){return D=parseInt(D,10),D<0||D>60?!1:(O.setUTCSeconds(D),!0)}},t:"\\t",u:"\\d",U:p,w:"\\d",W:p,y:{reg:p,make:function(O,D){return D=parseInt(D,10),D<0||D>99?!1:(D=D+100*parseInt(new Date().getUTCFullYear()/100,10),O.setUTCFullYear(D),!0)}},Y:{reg:"\\d{4}",make:function(O,D){return D=parseInt(D,10),O.setUTCFullYear(D),!0}},z:{reg:"[+\\-]\\d{4}",make:function(O,D){var B=D.match(/^([+\-])(\d{2})(\d{2})$/);if(!B)return!1;var F=(parseInt(B[2],10)*60+parseInt(B[3],10))*6e4;return B[1]==="+"&&(F=-F),O.setTime(O.getTime()+F),!0}},l:{reg:p,make:function(O,D){return D=parseInt(D,10),D<1||D>12?!1:(O.setUTCHours(O.getUTCHours()+D),!0)}},s:{reg:"\\d+",make:function(O,D){return D=parseInt(D,10),O.setTime(D*1e3),!0}},c:o.c,r:o.r,R:"%H:%M",T:"%H:%M:%S",x:o.x,X:o.X,D:"%m/%d/%y",F:"%Y-%m-%d",Date_iso:"%Y-%m-%dT%H:%M:%S",Date_dBY_year_in_HM:o.Date_dBY_year_in_HM,Date_dBY_year:o.Date_dBY_year,Date_dBY:o.Date_dBY,Date_dBA:o.Date_dBA,Date_AdBY:o.Date_AdBY,Date_df_in_HM:o.Date_df_in_HM,Date_dfY:o.Date_dfY,Date_dB_in_HM:o.Date_dB_in_HM,Date_dmY__dot:"%d.%m.%Y",Date_df:o.Date_df,Date_FT:"%F %T",Date_dmY__minus:"%d-%m-%Y"};i.parse=function(O,D,B){O=String(O),D=String(D);for(var F=5;/%(Date_[a-zA-Z0-9_]+|[cDFrRTxX])/g.test(D)&&F;)D=D.replace(/%(Date_[a-zA-Z0-9_]+|[cDFrRTxX])/,A),F--;A.make=[];var s=D.replace(/%(([#\^!~]{0,2})[aAbBfh]|([0\-_]?)[degHImMSVWyl]|[GnpPtuUwYzZs%])/g,A),v=O.match(new RegExp(s));if(!v||!A.make.length)return null;for(var N=new Date(Date.UTC(0,0)),h=0,c=A.make.length;h<c;h++){var l=A.make[h];if(!l[0](N,v[h+1],l[1],l[2]))return null}return B&&N.setTime(N.getTime()+N.getTimezoneOffset()*6e4),N};function A(O,D,B,F,s,v){D=String(D),B=String(B),D=D.replace(/^[#_0\^\-!~]+/,"");var N=T[D];if(!N)return O;var h=!1;if(B.indexOf("!")===-1&&D.length===1&&(B.indexOf("~")>-1||"bBf".indexOf(D)>-1&&/%[0\-_]?d[\s]+$/.test(v.substr(0,s)))&&(h=!0),(D==="I"||D==="l")&&!/%[pP]/.test(v))throw new Error("Undefined AM/PM");switch(typeof N){case"function":return N();case"string":return N;case"object":return A.make.push([N.make,B,h]),"("+N.reg+")";default:return O}}function S(O,D){return O=String(O),D=String(D),D.indexOf("#")!==-1?O.substr(0,1).toUpperCase()+O.substr(1):D.indexOf("^")!==-1?O.substr(0,1)+O.substr(1).toLowerCase():O}})(n)})()})});Sk.builtinFiles={files:{"src/builtin/sys.js":'var $builtinmodule=function(){var b,a=Math.pow,c={},d=[],e=Sk.getSysArgv();for(b=0;b<e.length;++b)d.push(new Sk.builtin.str(e[b]));return c.argv=new Sk.builtins.list(d),c.copyright=new Sk.builtin.str("Copyright 2009-2010 Scott Graham.\\nAll Rights Reserved.\\n"),Sk.__future__.python3?(c.version="3.7(ish) [Skulpt]",c.version_info=new Sk.builtin.tuple([new Sk.builtin.int_(3),new Sk.builtin.int_(7)])):(c.version="2.7(ish) [Skulpt]",c.version_info=new Sk.builtin.tuple([new Sk.builtin.int_(2),new Sk.builtin.int_(7)])),c.maxint=new Sk.builtin.int_(a(2,53)-1),c.maxsize=new Sk.builtin.int_(a(2,53)-1),c.modules=Sk.sysmodules,c.path=Sk.realsyspath,c.getExecutionLimit=new Sk.builtin.func(function(){return null===Sk.execLimit?Sk.builtin.none.none$:new Sk.builtin.int_(Sk.execLimit)}),c.setExecutionLimit=new Sk.builtin.func(function(a){if(null===Sk.execLimit)throw new Sk.builtin.NotImplementedError("Execution limiting is not enabled");void 0!==a&&(Sk.execLimit=Sk.builtin.asnum$(a))}),c.resetTimeout=new Sk.builtin.func(function(){Sk.execStart=new Date}),c.getYieldLimit=new Sk.builtin.func(function(){return null===Sk.yieldLimit?Sk.builtin.none.none$:new Sk.builtin.int_(Sk.yieldLimit)}),c.setYieldLimit=new Sk.builtin.func(function(a){if(null===Sk.yieldLimit)throw new Sk.builtin.NotImplementedError("Yielding is not enabled");void 0!==a&&(Sk.yieldLimit=Sk.builtin.asnum$(a))}),c.debug=new Sk.builtin.func(function(){return Sk.builtin.none.none$}),c.__stdout__=new Sk.builtin.file(new Sk.builtin.str("/dev/stdout"),new Sk.builtin.str("w")),c.__stdin__=new Sk.builtin.file(new Sk.builtin.str("/dev/stdin"),new Sk.builtin.str("r")),c.stdout=c.__stdout__,c.stdin=c.__stdin__,c};',"src/builtin/this.py":`s = """Gur Mra bs Clguba, ol Gvz Crgref

Ornhgvshy vf orggre guna htyl.
Rkcyvpvg vf orggre guna vzcyvpvg.
Fvzcyr vf orggre guna pbzcyrk.
Pbzcyrk vf orggre guna pbzcyvpngrq.
Syng vf orggre guna arfgrq.
Fcnefr vf orggre guna qrafr.
Ernqnovyvgl pbhagf.
Fcrpvny pnfrf nera'g fcrpvny rabhtu gb oernx gur ehyrf.
Nygubhtu cenpgvpnyvgl orngf chevgl.
Reebef fubhyq arire cnff fvyragyl.
Hayrff rkcyvpvgyl fvyraprq.
Va gur snpr bs nzovthvgl, ershfr gur grzcgngvba gb thrff.
Gurer fubhyq or bar-- naq cersrenoyl bayl bar --boivbhf jnl gb qb vg.
Nygubhtu gung jnl znl abg or boivbhf ng svefg hayrff lbh'er Qhgpu.
Abj vf orggre guna arire.
Nygubhtu arire vf bsgra orggre guna *evtug* abj.
Vs gur vzcyrzragngvba vf uneq gb rkcynva, vg'f n onq vqrn.
Vs gur vzcyrzragngvba vf rnfl gb rkcynva, vg znl or n tbbq vqrn.
Anzrfcnprf ner bar ubaxvat terng vqrn -- yrg'f qb zber bs gubfr!"""

d = {}
for c in (65, 97):
    for i in range(26):
        d[chr(i+c)] = chr((i+13) % 26 + c)

print("".join([d.get(c, c) for c in s]))
`,"src/lib/BaseHTTPServer.py":`raise NotImplementedError("BaseHTTPServer is not yet implemented in Skulpt")
`,"src/lib/Bastion.py":`raise NotImplementedError("Bastion is not yet implemented in Skulpt")
`,"src/lib/CGIHTTPServer.py":`raise NotImplementedError("CGIHTTPServer is not yet implemented in Skulpt")
`,"src/lib/ConfigParser.py":`raise NotImplementedError("ConfigParser is not yet implemented in Skulpt")
`,"src/lib/Cookie.py":`raise NotImplementedError("Cookie is not yet implemented in Skulpt")
`,"src/lib/DocXMLRPCServer.py":`raise NotImplementedError("DocXMLRPCServer is not yet implemented in Skulpt")
`,"src/lib/HTMLParser.py":`raise NotImplementedError("HTMLParser is not yet implemented in Skulpt")
`,"src/lib/MimeWriter.py":`raise NotImplementedError("MimeWriter is not yet implemented in Skulpt")
`,"src/lib/Queue.py":`raise NotImplementedError("Queue is not yet implemented in Skulpt")
`,"src/lib/SimpleHTTPServer.py":`raise NotImplementedError("SimpleHTTPServer is not yet implemented in Skulpt")
`,"src/lib/SimpleXMLRPCServer.py":`raise NotImplementedError("SimpleXMLRPCServer is not yet implemented in Skulpt")
`,"src/lib/SocketServer.py":`raise NotImplementedError("SocketServer is not yet implemented in Skulpt")
`,"src/lib/StringIO.py":`r"""File-like objects that read from or write to a string buffer.

This implements (nearly) all stdio methods.

f = StringIO()      # ready for writing
f = StringIO(buf)   # ready for reading
f.close()           # explicitly release resources held
flag = f.isatty()   # always false
pos = f.tell()      # get current position
f.seek(pos)         # set current position
f.seek(pos, mode)   # mode 0: absolute; 1: relative; 2: relative to EOF
buf = f.read()      # read until EOF
buf = f.read(n)     # read up to n bytes
buf = f.readline()  # read until end of line ('\\n') or EOF
list = f.readlines()# list of f.readline() results until EOF
f.truncate([size])  # truncate file at to at most size (default: current pos)
f.write(buf)        # write at current position
f.writelines(list)  # for line in list: f.write(line)
f.getvalue()        # return whole file's contents as a string

Notes:
- Using a real file is often faster (but less convenient).
- There's also a much faster implementation in C, called cStringIO, but
  it's not subclassable.
- fileno() is left unimplemented so that code which uses it triggers
  an exception early.
- Seeking far beyond EOF and then writing will insert real null
  bytes that occupy space in the buffer.
- There's a simple test set (see end of this file).
"""

__all__ = ["StringIO"]

def _complain_ifclosed(closed):
    if closed:
        raise ValueError("I/O operation on closed file")

class StringIO:
    """class StringIO([buffer])

    When a StringIO object is created, it can be initialized to an existing
    string by passing the string to the constructor. If no string is given,
    the StringIO will start empty.

    The StringIO object can accept either Unicode or 8-bit strings, but
    mixing the two may take some care. If both are used, 8-bit strings that
    cannot be interpreted as 7-bit ASCII (that use the 8th bit) will cause
    a UnicodeError to be raised when getvalue() is called.
    """
    def __init__(self, buf = ''):
        # Force self.buf to be a string or unicode
        if not isinstance(buf, str):
            buf = str(buf)
        self.buf = buf
        self.len = len(buf)
        self.buflist = []
        self.pos = 0
        self.closed = False
        self.softspace = 0

    def __iter__(self):
        return self

    def next(self):
        """A file object is its own iterator, for example iter(f) returns f
        (unless f is closed). When a file is used as an iterator, typically
        in a for loop (for example, for line in f: print line), the next()
        method is called repeatedly. This method returns the next input line,
        or raises StopIteration when EOF is hit.
        """
        _complain_ifclosed(self.closed)
        r = self.readline()
        if not r:
            raise StopIteration
        return r

    def close(self):
        """Free the memory buffer.
        """
        if not self.closed:
            self.closed = True
            self.buf = None
            self.pos = None

    def isatty(self):
        """Returns False because StringIO objects are not connected to a
        tty-like device.
        """
        _complain_ifclosed(self.closed)
        return False

    def seek(self, pos, mode = 0):
        """Set the file's current position.

        The mode argument is optional and defaults to 0 (absolute file
        positioning); other values are 1 (seek relative to the current
        position) and 2 (seek relative to the file's end).

        There is no return value.
        """
        _complain_ifclosed(self.closed)
        if self.buflist:
            self.buf += ''.join(self.buflist)
            self.buflist = []
        if mode == 1:
            pos += self.pos
        elif mode == 2:
            pos += self.len
        self.pos = max(0, pos)

    def tell(self):
        """Return the file's current position."""
        _complain_ifclosed(self.closed)
        return self.pos

    def read(self, n = -1):
        """Read at most size bytes from the file
        (less if the read hits EOF before obtaining size bytes).

        If the size argument is negative or omitted, read all data until EOF
        is reached. The bytes are returned as a string object. An empty
        string is returned when EOF is encountered immediately.
        """
        _complain_ifclosed(self.closed)
        if self.buflist:
            self.buf += ''.join(self.buflist)
            self.buflist = []
        if n is None or n < 0:
            newpos = self.len
        else:
            newpos = min(self.pos+n, self.len)
        r = self.buf[self.pos:newpos]
        self.pos = newpos
        return r

    def readline(self, length=None):
        r"""Read one entire line from the file.

        A trailing newline character is kept in the string (but may be absent
        when a file ends with an incomplete line). If the size argument is
        present and non-negative, it is a maximum byte count (including the
        trailing newline) and an incomplete line may be returned.

        An empty string is returned only when EOF is encountered immediately.

        Note: Unlike stdio's fgets(), the returned string contains null
        characters ('\\0') if they occurred in the input.
        """
        _complain_ifclosed(self.closed)
        if self.buflist:
            self.buf += ''.join(self.buflist)
            self.buflist = []
        i = self.buf.find('\\n', self.pos)
        if i < 0:
            newpos = self.len
        else:
            newpos = i+1
        if length is not None and length >= 0:
            if self.pos + length < newpos:
                newpos = self.pos + length
        r = self.buf[self.pos:newpos]
        self.pos = newpos
        return r

    def readlines(self, sizehint = 0):
        """Read until EOF using readline() and return a list containing the
        lines thus read.

        If the optional sizehint argument is present, instead of reading up
        to EOF, whole lines totalling approximately sizehint bytes (or more
        to accommodate a final whole line).
        """
        total = 0
        lines = []
        line = self.readline()
        while line:
            lines.append(line)
            total += len(line)
            if 0 < sizehint <= total:
                break
            line = self.readline()
        return lines

    def truncate(self, size=None):
        """Truncate the file's size.

        If the optional size argument is present, the file is truncated to
        (at most) that size. The size defaults to the current position.
        The current file position is not changed unless the position
        is beyond the new file size.

        If the specified size exceeds the file's current size, the
        file remains unchanged.
        """
        _complain_ifclosed(self.closed)
        if size is None:
            size = self.pos
        elif size < 0:
            raise IOError(22, "Negative size not allowed")
        elif size < self.pos:
            self.pos = size
        self.buf = self.getvalue()[:size]
        self.len = size

    def write(self, s):
        """Write a string to the file.

        There is no return value.
        """
        _complain_ifclosed(self.closed)
        if not s: return
        # Force s to be a string or unicode
        if not isinstance(s, str):
            s = str(s)
        spos = self.pos
        slen = self.len
        if spos == slen:
            self.buflist.append(s)
            self.len = self.pos = spos + len(s)
            return
        if spos > slen:
            self.buflist.append('\\0'*(spos - slen))
            slen = spos
        newpos = spos + len(s)
        if spos < slen:
            if self.buflist:
                self.buf += ''.join(self.buflist)
            self.buflist = [self.buf[:spos], s, self.buf[newpos:]]
            self.buf = ''
            if newpos > slen:
                slen = newpos
        else:
            self.buflist.append(s)
            slen = newpos
        self.len = slen
        self.pos = newpos

    def writelines(self, iterable):
        """Write a sequence of strings to the file. The sequence can be any
        iterable object producing strings, typically a list of strings. There
        is no return value.

        (The name is intended to match readlines(); writelines() does not add
        line separators.)
        """
        write = self.write
        for line in iterable:
            write(line)

    def flush(self):
        """Flush the internal buffer
        """
        _complain_ifclosed(self.closed)

    def getvalue(self):
        """
        Retrieve the entire contents of the "file" at any time before
        the StringIO object's close() method is called.

        The StringIO object can accept either Unicode or 8-bit strings,
        but mixing the two may take some care. If both are used, 8-bit
        strings that cannot be interpreted as 7-bit ASCII (that use the
        8th bit) will cause a UnicodeError to be raised when getvalue()
        is called.
        """
        _complain_ifclosed(self.closed)
        if self.buflist:
            self.buf += ''.join(self.buflist)
            self.buflist = []
        return self.buf
`,"src/lib/UserDict.py":`raise NotImplementedError("UserDict is not yet implemented in Skulpt")
`,"src/lib/UserList.py":`raise NotImplementedError("UserList is not yet implemented in Skulpt")
`,"src/lib/UserString.py":`raise NotImplementedError("UserString is not yet implemented in Skulpt")
`,"src/lib/_LWPCookieJar.py":`raise NotImplementedError("_LWPCookieJar is not yet implemented in Skulpt")
`,"src/lib/_MozillaCookieJar.py":`raise NotImplementedError("_MozillaCookieJar is not yet implemented in Skulpt")
`,"src/lib/__future__.py":`raise NotImplementedError("__future__ is not yet implemented in Skulpt")
`,"src/lib/__phello__.foo.py":`raise NotImplementedError("__phello__.foo is not yet implemented in Skulpt")
`,"src/lib/_abcoll.py":`raise NotImplementedError("_abcoll is not yet implemented in Skulpt")
`,"src/lib/_strptime.py":`raise NotImplementedError("_strptime is not yet implemented in Skulpt")
`,"src/lib/_threading_local.py":`raise NotImplementedError("_threading_local is not yet implemented in Skulpt")
`,"src/lib/abc.py":`raise NotImplementedError("abc is not yet implemented in Skulpt")
`,"src/lib/aifc.py":`raise NotImplementedError("aifc is not yet implemented in Skulpt")
`,"src/lib/antigravity.py":`import webbrowser

webbrowser.open("https://xkcd.com/353/")
`,"src/lib/anydbm.py":`raise NotImplementedError("anydbm is not yet implemented in Skulpt")
`,"src/lib/array.js":`$builtinmodule=function(){var a={},b=["c","b","B","u","h","H","i","I","l","L","f","d"];return a.__name__=new Sk.builtin.str("array"),a.array=Sk.misceval.buildClass(a,function(a,c){c.__init__=new Sk.builtin.func(function(a,c,d){if(Sk.builtin.pyCheckArgsLen("__init__",arguments.length,2,3),-1==b.indexOf(Sk.ffi.remapToJs(c)))throw new Sk.builtin.ValueError("bad typecode (must be c, b, B, u, h, H, i, I, l, L, f or d)");if(d&&!Sk.builtin.checkIterable(d))throw new Sk.builtin.TypeError("iteration over non-sequence");if(a.$d.mp$ass_subscript(new Sk.builtin.str("typecode"),c),a.$d.mp$ass_subscript(new Sk.builtin.str("__module__"),new Sk.builtin.str("array")),a.typecode=c,void 0===d)a.internalIterable=new Sk.builtin.list;else if(d instanceof Sk.builtin.list)a.internalIterable=d;else for(a.internalIterable=new Sk.builtin.list,iter=Sk.abstr.iter(d),item=iter.tp$iternext();void 0!==item;item=iter.tp$iternext())Sk.misceval.callsimArray(a.internalIterable.append,[a.internalIterable,item])}),c.__repr__=new Sk.builtin.func(function(a){var b=Sk.ffi.remapToJs(a.typecode),c="";return Sk.ffi.remapToJs(a.internalIterable).length&&("c"==Sk.ffi.remapToJs(a.typecode)?c=", '"+Sk.ffi.remapToJs(a.internalIterable).join("")+"'":c=", "+Sk.ffi.remapToJs(Sk.misceval.callsimArray(a.internalIterable.__repr__,[a.internalIterable]))),new Sk.builtin.str("array('"+b+"'"+c+")")}),c.__str__=c.__repr__,c.__getattribute__=new Sk.builtin.func(function(a,b){return a.tp$getattr(b)}),c.append=new Sk.builtin.func(function(a,b){return Sk.misceval.callsimArray(a.internalIterable.append,[a.internalIterable,b]),Sk.builtin.none.none$}),c.extend=new Sk.builtin.func(function(a,b){if(Sk.builtin.pyCheckArgsLen("__init__",arguments.length,2,2),!Sk.builtin.checkIterable(b))throw new Sk.builtin.TypeError("iteration over non-sequence");for(iter=Sk.abstr.iter(b),item=iter.tp$iternext();void 0!==item;item=iter.tp$iternext())Sk.misceval.callsimArray(a.internalIterable.append,[a.internalIterable,item])})},"array",[]),a};`,"src/lib/ast.py":`raise NotImplementedError("ast is not yet implemented in Skulpt")
`,"src/lib/asynchat.py":`raise NotImplementedError("asynchat is not yet implemented in Skulpt")
`,"src/lib/asyncore.py":`raise NotImplementedError("asyncore is not yet implemented in Skulpt")
`,"src/lib/atexit.py":`raise NotImplementedError("atexit is not yet implemented in Skulpt")
`,"src/lib/audiodev.py":`raise NotImplementedError("audiodev is not yet implemented in Skulpt")
`,"src/lib/base64.py":`raise NotImplementedError("base64 is not yet implemented in Skulpt")
`,"src/lib/bdb.py":`raise NotImplementedError("bdb is not yet implemented in Skulpt")
`,"src/lib/binhex.py":`raise NotImplementedError("binhex is not yet implemented in Skulpt")
`,"src/lib/bisect.py":`"""Bisection algorithms."""

def insort_right(a, x, lo=0, hi=None):
    """Insert item x in list a, and keep it sorted assuming a is sorted.

    If x is already in a, insert it to the right of the rightmost x.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if x < a[mid]: hi = mid
        else: lo = mid+1
    a.insert(lo, x)

def bisect_right(a, x, lo=0, hi=None):
    """Return the index where to insert item x in list a, assuming a is sorted.

    The return value i is such that all e in a[:i] have e <= x, and all e in
    a[i:] have e > x.  So if x already appears in the list, a.insert(x) will
    insert just after the rightmost x already there.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if x < a[mid]: hi = mid
        else: lo = mid+1
    return lo

def insort_left(a, x, lo=0, hi=None):
    """Insert item x in list a, and keep it sorted assuming a is sorted.

    If x is already in a, insert it to the left of the leftmost x.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if a[mid] < x: lo = mid+1
        else: hi = mid
    a.insert(lo, x)


def bisect_left(a, x, lo=0, hi=None):
    """Return the index where to insert item x in list a, assuming a is sorted.

    The return value i is such that all e in a[:i] have e < x, and all e in
    a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
    insert just before the leftmost x already there.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if a[mid] < x: lo = mid+1
        else: hi = mid
    return lo

# Overwrite above definitions with a fast C implementation
try:
    from _bisect import *
except ImportError:
    pass

# Create aliases
bisect = bisect_right
insort = insort_right
`,"src/lib/bsddb/__init__.py":`raise NotImplementedError("bsddb is not yet implemented in Skulpt")
`,"src/lib/cProfile.py":`raise NotImplementedError("cProfile is not yet implemented in Skulpt")
`,"src/lib/calendar.py":`raise NotImplementedError("calendar is not yet implemented in Skulpt")
`,"src/lib/cgi.py":`raise NotImplementedError("cgi is not yet implemented in Skulpt")
`,"src/lib/cgitb.py":`raise NotImplementedError("cgitb is not yet implemented in Skulpt")
`,"src/lib/chunk.py":`raise NotImplementedError("chunk is not yet implemented in Skulpt")
`,"src/lib/cmd.py":`raise NotImplementedError("cmd is not yet implemented in Skulpt")
`,"src/lib/code.py":`raise NotImplementedError("code is not yet implemented in Skulpt")
`,"src/lib/codecs.py":`raise NotImplementedError("codecs is not yet implemented in Skulpt")
`,"src/lib/codeop.py":`raise NotImplementedError("codeop is not yet implemented in Skulpt")
`,"src/lib/collections.js":`function $builtinmodule(){const a={};return Sk.misceval.chain(Sk.importModule("keyword",!1,!0),b=>(a._iskeyword=b.$d.iskeyword,Sk.importModule("itertools",!1,!0)),b=>(a._chain=b.$d.chain,a._starmap=b.$d.starmap,a._repeat=b.$d.repeat,Sk.importModule("operator",!1,!0)),b=>{a._itemgetter=b.$d.itemgetter},()=>collections_mod(a))}function collections_mod(a){function counterNumberSlot(b){return function(c){if(void 0!==c&&!(c instanceof a.Counter))return Sk.builtin.NotImplemented.NotImplemented$;const d=new a.Counter;return b.call(this,d,c),d}}function counterInplaceSlot(a,b){return function(c){if(!(c instanceof Sk.builtin.dict))throw new Sk.builtin.TypeError("Counter "+a+"= "+Sk.abstr.typeName(c)+" is not supported");return b.call(this,c),this.keep$positive()}}function namedtuple(b,c,d,l,m){function _make(a,b){return a.prototype.tp$new(Sk.misceval.arrayFromIterable(b))}function _asdict(a){const b=[];for(let c=0;c<a._fields.v.length;c++)b.push(a._fields.v[c]),b.push(a.v[c]);return new Sk.builtin.dict(b)}function _replace(a,b){a=new Sk.builtin.dict(a);const c=a.tp$getattr(new Sk.builtin.str("pop")),d=Sk.abstr.gattr(b,new Sk.builtin.str("_make")),e=Sk.misceval.callsimArray,f=e(d,[e(Sk.builtin.map_,[c,r,b])]);if(a.sq$length()){const b=a.sk$asarray();throw new Sk.builtin.ValueError("Got unexpectd field names: ["+b.map(a=>"'"+a.$jsstr()+"'")+"]")}return f}if(b=b.tp$str(),Sk.misceval.isTrue(Sk.misceval.callsimArray(a._iskeyword,[b])))throw new Sk.builtin.ValueError("Type names and field names cannot be a keyword: '"+Sk.misceval.objectRepr(b)+"'");const n=b.$jsstr();if(e.test(n)||!g.test(n)||!n)throw new Sk.builtin.ValueError("Type names and field names must be valid identifiers: '"+n+"'");let o,p;if(Sk.builtin.checkString(c))o=c.$jsstr().replace(h," ").split(j),1==o.length&&""===o[0]&&(o=[]),p=o.map(a=>new Sk.builtin.str(a));else{o=[],p=[];for(let a=Sk.abstr.iter(c),b=a.tp$iternext();void 0!==b;b=a.tp$iternext())b=b.tp$str(),p.push(b),o.push(b.$jsstr())}let q=new Set;if(Sk.misceval.isTrue(d))for(i=0;i<o.length;i++)(Sk.misceval.isTrue(Sk.misceval.callsimArray(a._iskeyword,[p[i]]))||f.test(o[i])||!g.test(o[i])||!o[i]||q.has(o[i]))&&(o[i]="_"+i,p[i]=new Sk.builtin.str("_"+i)),q.add(o[i]);else for(i=0;i<o.length;i++){if(Sk.misceval.isTrue(Sk.misceval.callsimArray(a._iskeyword,[p[i]])))throw new Sk.builtin.ValueError("Type names and field names cannot be a keyword: '"+o[i]+"'");else if(f.test(o[i]))throw new Sk.builtin.ValueError("Field names cannot start with an underscore: '"+o[i]+"'");else if(!g.test(o[i])||!o[i])throw new Sk.builtin.ValueError("Type names and field names must be valid identifiers: '"+o[i]+"'");else if(q.has(o[i]))throw new Sk.builtin.ValueError("Encountered duplicate field name: '"+o[i]+"'");q.add(o[i])}const r=new Sk.builtin.tuple(p),s=[];let t=[];if(!Sk.builtin.checkNone(l)){if(t=Sk.misceval.arrayFromIterable(l),t.length>o.length)throw new Sk.builtin.TypeError("Got more default values than field names");for(let a=0,b=p.length-t.length;b<p.length;a++,b++)s.push(p[b]),s.push(t[a])}const u=new Sk.builtin.dict(s);_make.co_varnames=["_cls","iterable"],_asdict.co_varnames=["self"],_replace.co_kwargs=1,_replace.co_varnames=["_self"];const v={};for(let e=0;e<o.length;e++)v[p[e].$mangled]=new Sk.builtin.property(new a._itemgetter([new Sk.builtin.int_(e)]),void 0,void 0,new Sk.builtin.str("Alias for field number "+e));return Sk.abstr.buildNativeClass(n,{constructor:function NamedTuple(){},base:Sk.builtin.tuple,slots:{tp$doc:n+"("+o.join(", ")+")",tp$new(a,b){a=Sk.abstr.copyKeywordsToNamedArgs("__new__",o,a,b,t);const c=new this.constructor;return Sk.builtin.tuple.call(c,a),c},$r(){const a=this.v.map((a,b)=>o[b]+"="+Sk.misceval.objectRepr(a));return new Sk.builtin.str(Sk.abstr.typeName(this)+"("+a.join(", ")+")")}},proto:Object.assign({__module__:Sk.builtin.checkNone(m)?Sk.globals.__name__:m,__slots__:new Sk.builtin.tuple,_fields:r,_field_defaults:u,_make:new Sk.builtin.classmethod(new Sk.builtin.func(_make)),_asdict:new Sk.builtin.func(_asdict),_replace:new Sk.builtin.func(_replace)},v)})}a.__all__=new Sk.builtin.list(["deque","defaultdict","namedtuple","Counter","OrderedDict"].map(a=>new Sk.builtin.str(a))),a.defaultdict=Sk.abstr.buildNativeClass("collections.defaultdict",{constructor:function defaultdict(a,b){this.default_factory=a,Sk.builtin.dict.call(this,b)},base:Sk.builtin.dict,methods:{copy:{$meth(){return this.$copy()},$flags:{NoArgs:!0}},__copy__:{$meth(){return this.$copy()},$flags:{NoArgs:!0}},__missing__:{$meth(a){if(Sk.builtin.checkNone(this.default_factory))throw new Sk.builtin.KeyError(Sk.misceval.objectRepr(a));else{const b=Sk.misceval.callsimArray(this.default_factory,[]);return this.mp$ass_subscript(a,b),b}},$flags:{OneArg:!0}}},getsets:{default_factory:{$get(){return this.default_factory},$set(a){a=a||Sk.builtin.none.none$,this.default_factory=a}}},slots:{tp$doc:"defaultdict(default_factory[, ...]) --> dict with default factory\\n\\nThe default factory is called without arguments to produce\\na new value when a key is not present, in __getitem__ only.\\nA defaultdict compares equal to a dict with the same items.\\nAll remaining arguments are treated the same as if they were\\npassed to the dict constructor, including keyword arguments.\\n",tp$init(a,b){const c=a.shift();if(void 0===c)this.default_factory=Sk.builtin.none.none$;else if(!Sk.builtin.checkCallable(c)&&!Sk.builtin.checkNone(c))throw new Sk.builtin.TypeError("first argument must be callable");else this.default_factory=c;return Sk.builtin.dict.prototype.tp$init.call(this,a,b)},$r(){const a=Sk.misceval.objectRepr(this.default_factory),b=Sk.builtin.dict.prototype.$r.call(this).v;return new Sk.builtin.str("defaultdict("+a+", "+b+")")}},proto:{$copy(){const b=[];return Sk.misceval.iterFor(Sk.abstr.iter(this),a=>{b.push(a),b.push(this.mp$subscript(a))}),new a.defaultdict(this.default_factory,b)}}}),a.Counter=Sk.abstr.buildNativeClass("Counter",{constructor:function Counter(){this.$d=new Sk.builtin.dict,Sk.builtin.dict.apply(this)},base:Sk.builtin.dict,methods:{elements:{$flags:{NoArgs:!0},$meth(){const b=a._chain.tp$getattr(new Sk.builtin.str("from_iterable")),c=a._starmap,d=a._repeat,e=Sk.misceval.callsimArray;return e(b,[e(c,[d,e(this.tp$getattr(this.str$items))])])}},most_common:{$flags:{NamedArgs:["n"],Defaults:[Sk.builtin.none.none$]},$meth(a){length=this.sq$length(),Sk.builtin.checkNone(a)?a=length:(a=Sk.misceval.asIndexOrThrow(a),a=a>length?length:0>a?0:a);const b=this.$items().sort((c,a)=>Sk.misceval.richCompareBool(c[1],a[1],"Lt")?1:Sk.misceval.richCompareBool(c[1],a[1],"Gt")?-1:0);return new Sk.builtin.list(b.slice(0,a).map(a=>new Sk.builtin.tuple(a)))}},update:{$flags:{FastCall:!0},$meth(a,b){return Sk.abstr.checkArgsLen("update",a,0,1),this.counter$update(a,b)}},subtract:{$flags:{FastCall:!0},$meth(a,b){Sk.abstr.checkArgsLen("subtract",a,0,1);const c=a[0];if(void 0!==c)if(c instanceof Sk.builtin.dict)for(let a=Sk.abstr.iter(c),b=a.tp$iternext();void 0!==b;b=a.tp$iternext()){const a=this.mp$subscript(b);this.mp$ass_subscript(b,Sk.abstr.numberBinOp(a,c.mp$subscript(b),"Sub"))}else for(iter=Sk.abstr.iter(c),k=iter.tp$iternext();void 0!==k;k=iter.tp$iternext()){const a=this.mp$subscript(k);this.mp$ass_subscript(k,Sk.abstr.numberBinOp(a,this.$one,"Sub"))}b=b||[];for(let c=0;c<b.length;c+=2){const a=new Sk.builtin.str(b[c]),d=this.mp$subscript(a);this.mp$ass_subscript(a,Sk.abstr.numberBinOp(d,b[c+1],"Sub"))}return Sk.builtin.none.none$}},__missing__:{$meth(){return this.$zero},$flags:{OneArg:!0}},copy:{$meth(){return Sk.misceval.callsimArray(a.Counter,[this])},$flags:{NoArgs:!0}}},getsets:{__dict__:Sk.generic.getSetDict},slots:{tp$doc:"Dict subclass for counting hashable items.  Sometimes called a bag\\n    or multiset.  Elements are stored as dictionary keys and their counts\\n    are stored as dictionary values.\\n\\n    >>> c = Counter('abcdeabcdabcaba')  # count elements from a string\\n\\n    >>> c.most_common(3)                # three most common elements\\n    [('a', 5), ('b', 4), ('c', 3)]\\n    >>> sorted(c)                       # list all unique elements\\n    ['a', 'b', 'c', 'd', 'e']\\n    >>> ''.join(sorted(c.elements()))   # list elements with repetitions\\n    'aaaaabbbbcccdde'\\n    >>> sum(c.values())                 # total of all counts\\n    15\\n\\n    >>> c['a']                          # count of letter 'a'\\n    5\\n    >>> for elem in 'shazam':           # update counts from an iterable\\n    ...     c[elem] += 1                # by adding 1 to each element's count\\n    >>> c['a']                          # now there are seven 'a'\\n    7\\n    >>> del c['b']                      # remove all 'b'\\n    >>> c['b']                          # now there are zero 'b'\\n    0\\n\\n    >>> d = Counter('simsalabim')       # make another counter\\n    >>> c.update(d)                     # add in the second counter\\n    >>> c['a']                          # now there are nine 'a'\\n    9\\n\\n    >>> c.clear()                       # empty the counter\\n    >>> c\\n    Counter()\\n\\n    Note:  If a count is set to zero or reduced to zero, it will remain\\n    in the counter until the entry is deleted or the counter is cleared:\\n\\n    >>> c = Counter('aaabbc')\\n    >>> c['b'] -= 2                     # reduce the count of 'b' by two\\n    >>> c.most_common()                 # 'b' is still in, but its count is zero\\n    [('a', 3), ('c', 1), ('b', 0)]\\n\\n",tp$init(a,b){return Sk.abstr.checkArgsLen(this.tpjs_name,a,0,1),this.counter$update(a,b)},$r(){const a=0<this.size?Sk.builtin.dict.prototype.$r.call(this).v:"";return new Sk.builtin.str(Sk.abstr.typeName(this)+"("+a+")")},tp$as_sequence_or_mapping:!0,mp$ass_subscript(a,b){return void 0===b?this.mp$lookup(a)&&Sk.builtin.dict.prototype.mp$ass_subscript.call(this,a,b):Sk.builtin.dict.prototype.mp$ass_subscript.call(this,a,b)},tp$as_number:!0,nb$positive:counterNumberSlot(function(a){this.$items().forEach(([b,c])=>{Sk.misceval.richCompareBool(c,this.$zero,"Gt")&&a.mp$ass_subscript(b,c)})}),nb$negative:counterNumberSlot(function(a){this.$items().forEach(([b,c])=>{Sk.misceval.richCompareBool(c,this.$zero,"Lt")&&a.mp$ass_subscript(b,Sk.abstr.numberBinOp(this.$zero,c,"Sub"))})}),nb$subtract:counterNumberSlot(function(a,b){this.$items().forEach(([c,d])=>{const e=Sk.abstr.numberBinOp(d,b.mp$subscript(c),"Sub");Sk.misceval.richCompareBool(e,this.$zero,"Gt")&&a.mp$ass_subscript(c,e)}),b.$items().forEach(([b,c])=>{void 0===this.mp$lookup(b)&&Sk.misceval.richCompareBool(c,this.$zero,"Lt")&&a.mp$ass_subscript(b,Sk.abstr.numberBinOp(this.$zero,c,"Sub"))})}),nb$add:counterNumberSlot(function(a,b){this.$items().forEach(([c,d])=>{const e=Sk.abstr.numberBinOp(d,b.mp$subscript(c),"Add");Sk.misceval.richCompareBool(e,this.$zero,"Gt")&&a.mp$ass_subscript(c,e)}),b.$items().forEach(([b,c])=>{void 0===this.mp$lookup(b)&&Sk.misceval.richCompareBool(c,this.$zero,"Gt")&&a.mp$ass_subscript(b,c)})}),nb$inplace_add:counterInplaceSlot("+",function(a){a.$items().forEach(([a,b])=>{const c=Sk.abstr.numberInplaceBinOp(this.mp$subscript(a),b,"Add");this.mp$ass_subscript(a,c)})}),nb$inplace_subtract:counterInplaceSlot("-",function(a){a.$items().forEach(([a,b])=>{const c=Sk.abstr.numberInplaceBinOp(this.mp$subscript(a),b,"Sub");this.mp$ass_subscript(a,c)})}),nb$or:counterNumberSlot(function(a,b){this.$items().forEach(([c,d])=>{const e=b.mp$subscript(c),f=Sk.misceval.richCompareBool(d,e,"Lt")?e:d;Sk.misceval.richCompareBool(f,this.$zero,"Gt")&&a.mp$ass_subscript(c,f)}),b.$items().forEach(([b,c])=>{void 0===this.mp$lookup(b)&&Sk.misceval.richCompareBool(c,this.$zero,"Gt")&&a.mp$ass_subscript(b,c)})}),nb$and:counterNumberSlot(function(a,b){this.$items().forEach(([c,d])=>{const e=b.mp$subscript(c),f=Sk.misceval.richCompareBool(d,e,"Lt")?d:e;Sk.misceval.richCompareBool(f,this.$zero,"Gt")&&a.mp$ass_subscript(c,f)})}),nb$inplace_and:counterInplaceSlot("&",function(a){this.$items().forEach(([b,c])=>{const d=a.mp$subscript(b);Sk.misceval.richCompareBool(d,c,"Lt")&&this.mp$ass_subscript(b,d)})}),nb$inplace_or:counterInplaceSlot("|",function(a){a.$items().forEach(([a,b])=>{Sk.misceval.richCompareBool(b,this.mp$subscript(a),"Gt")&&this.mp$ass_subscript(a,b)})}),nb$reflected_and:null,nb$reflected_or:null,nb$reflected_add:null,nb$reflected_subtract:null},proto:{keep$positive(){return this.$items().forEach(([a,b])=>{Sk.misceval.richCompareBool(b,this.$zero,"LtE")&&this.mp$ass_subscript(a)}),this},$zero:new Sk.builtin.int_(0),$one:new Sk.builtin.int_(1),str$items:new Sk.builtin.str("items"),counter$update(a,b){const c=a[0];if(void 0!==c)if(!Sk.builtin.checkMapping(c))for(let a=Sk.abstr.iter(c),b=a.tp$iternext();void 0!==b;b=a.tp$iternext()){const a=this.mp$subscript(b);this.mp$ass_subscript(b,Sk.abstr.numberBinOp(a,this.$one,"Add"))}else if(!this.sq$length())this.update$common(a,void 0,"update");else for(let a=Sk.abstr.iter(c),b=a.tp$iternext();void 0!==b;b=a.tp$iternext()){const a=this.mp$subscript(b);this.mp$ass_subscript(b,Sk.abstr.numberBinOp(a,c.mp$subscript(b),"Add"))}if(b&&b.length)if(!this.sq$length())this.update$common([],b,"update");else for(let a=0;a<b.length;a+=2){const c=new Sk.builtin.str(b[a]),d=this.mp$subscript(c);this.mp$ass_subscript(c,Sk.abstr.numberBinOp(d,b[a+1],"Add"))}return Sk.builtin.none.none$}},classmethods:{fromkeys:{$meth:function fromkeys(){throw new Sk.builtin.NotImplementedError("Counter.fromkeys() is undefined.  Use Counter(iterable) instead.")},$flags:{MinArgs:1,MaxArgs:2}}}});const b=Sk.abstr.buildIteratorClass("odict_iterator",{constructor:function odict_iter_(a){this.$index=0,this.$seq=a.sk$asarray(),this.$orig=a},iternext:Sk.generic.iterNextWithArrayCheckSize,flags:{sk$acceptable_as_base_class:!1}});a.OrderedDict=Sk.abstr.buildNativeClass("OrderedDict",{constructor:function OrderedDict(){return this.orderedkeys=[],Sk.builtin.dict.call(this),this},base:Sk.builtin.dict,slots:{tp$as_sequence_or_mapping:!0,tp$init(a,b){Sk.abstr.checkArgsLen("OrderedDict",a,0,1),a.unshift(this),res=Sk.misceval.callsimArray(this.update,a,b)},tp$doc:"Dictionary that remembers insertion order",$r(){let a,b;const c=[];for(let b=this.tp$iter(),d=b.tp$iternext();void 0!==d;d=b.tp$iternext())a=this.mp$subscript(d),void 0===a&&(a=null),c.push("("+Sk.misceval.objectRepr(d)+", "+Sk.misceval.objectRepr(a)+")");return b=c.join(", "),0<c.length&&(b="["+b+"]"),new Sk.builtin.str("OrderedDict("+b+")")},tp$richcompare(b,c){if("Eq"!=c&&"Ne"!=c)return Sk.builtin.NotImplemented.NotImplemented$;const d="Eq"==c;if(!(b instanceof a.OrderedDict))return Sk.builtin.dict.prototype.tp$richcompare.call(this,b,c);const e=this.size,f=b.size;if(e!==f)return!d;for(let a=this.tp$iter(),e=b.tp$iter(),f=a.tp$iternext(),g=e.tp$iternext();void 0!==f;f=a.tp$iternext(),g=e.tp$iternext()){if(!Sk.misceval.isTrue(Sk.misceval.richCompareBool(f,g,"Eq")))return!d;const a=this.mp$subscript(f),c=b.mp$subscript(g);if(!Sk.misceval.isTrue(Sk.misceval.richCompareBool(a,c,"Eq")))return!d}return d},mp$ass_subscript(a,b){if(void 0===b){const b=this.pop$item(a);if(void 0===b)throw new Sk.builtin.KeyError(a)}else this.set$item(a,b)},tp$iter(){return new b(this)}},methods:{pop:{$flags:{NamedArgs:["key","default"],Defaults:[null]},$meth(a,b){return null===b?Sk.misceval.callsimArray(Sk.builtin.dict.prototype.pop,[this,a]):Sk.misceval.callsimArray(Sk.builtin.dict.prototype.pop,[this,a,b])}},popitem:{$flags:{NamedArgs:["last"],Defaults:[Sk.builtin.bool.true$]},$meth(a){let b,c;if(!this.orderedkeys.length)throw new Sk.builtin.KeyError("dictionary is empty");return b=this.orderedkeys[0],Sk.misceval.isTrue(a)&&(b=this.orderedkeys[this.orderedkeys.length-1]),c=Sk.misceval.callsimArray(this.pop,[this,b]),new Sk.builtin.tuple([b,c])}},move_to_end:{$flags:{NamedArgs:["key","last"],Defaults:[Sk.builtin.bool.true$]},$meth(a,b){let c,d=-1;for(let e=0;e<this.orderedkeys.length;e++)if(c=this.orderedkeys[e],c===a||Sk.misceval.richCompareBool(c,a,"Eq")){d=e;break}if(-1!==d)this.orderedkeys.splice(d,1);else throw new Sk.builtin.KeyError(a);return Sk.misceval.isTrue(b)?this.orderedkeys.push(a):this.orderedkeys.unshift(a),Sk.builtin.none.none$}}},proto:{sk$asarray(){return this.orderedkeys.slice(0)},set$item(a,b){const c=this.orderedkeys.indexOf(a);-1==c&&this.orderedkeys.push(a),Sk.builtin.dict.prototype.set$item.call(this,a,b)},pop$item(a){var b=this.orderedkeys.indexOf(a);if(-1!=b)return this.orderedkeys.splice(b,1),Sk.builtin.dict.prototype.pop$item.call(this,a)}}}),a.deque=Sk.abstr.buildNativeClass("collections.deque",{constructor:function deque(a,b,c,d,e){this.head=c||0,this.tail=d||0,this.mask=e||1,this.maxlen=b,this.v=a||[,,]},slots:{tp$doc:"deque([iterable[, maxlen]]) --> deque object\\n\\nA list-like sequence optimized for data accesses near its endpoints.",tp$hash:Sk.builtin.none.none$,tp$new:Sk.generic.new,tp$init(a,b){if([iterable,maxlen]=Sk.abstr.copyKeywordsToNamedArgs("deque",["iterable","maxlen"],a,b),void 0!==maxlen&&!Sk.builtin.checkNone(maxlen))if(maxlen=Sk.misceval.asIndexSized(maxlen,Sk.builtin.OverflowError,"an integer is required"),0>maxlen)throw new Sk.builtin.ValueError("maxlen must be non-negative");else this.maxlen=maxlen;this.$clear(),void 0!==iterable&&this.$extend(iterable)},tp$getattr:Sk.generic.getAttr,tp$richcompare(b,c){var d=Math.max;if(this===b&&Sk.misceval.opAllowsEquality(c))return!0;if(!(b instanceof a.deque))return Sk.builtin.NotImplemented.NotImplemented$;const e=b,f=this.v;b=b.v;const g=this.tail-this.head&this.mask,h=e.tail-e.head&e.mask;let j,l=d(g,h);if(g===h)for(l=0;l<g&&l<h&&(j=Sk.misceval.richCompareBool(f[this.head+l&this.mask],b[e.head+l&e.mask],"Eq"),!!j);++l);if(l>=g||l>=h)switch(c){case"Lt":return g<h;case"LtE":return g<=h;case"Eq":return g===h;case"NotEq":return g!==h;case"Gt":return g>h;case"GtE":return g>=h;}return"Eq"!==c&&("NotEq"===c||Sk.misceval.richCompareBool(f[this.head+l&this.mask],b[e.head+l&e.mask],c))},tp$iter(){return new c(this)},$r(){const a=[],b=this.tail-this.head&this.mask;if(this.$entered_repr)return new Sk.builtin.str("[...]");this.$entered_repr=!0;for(let c=0;c<b;c++)a.push(Sk.misceval.objectRepr(this.v[this.head+c&this.mask]));const c=Sk.abstr.typeName(this);return void 0===this.maxlen?(this.$entered_repr=void 0,new Sk.builtin.str(c+"(["+a.filter(Boolean).join(", ")+"])")):new Sk.builtin.str(c+"(["+a.filter(Boolean).join(", ")+"], maxlen="+this.maxlen+")")},tp$as_number:!0,nb$bool(){return 0!=(this.tail-this.head&this.mask)},tp$as_sequence_or_mapping:!0,sq$contains(a){for(let b=this.tp$iter(),c=b.tp$iternext();void 0!==c;c=b.tp$iternext())if(Sk.misceval.richCompareBool(c,a,"Eq"))return!0;return!1},sq$concat(b){if(!(b instanceof a.deque))throw new Sk.builtin.TypeError("can only concatenate deque (not '"+Sk.abstr.typeName(b)+"') to deque");const c=this.$copy();for(let a=b.tp$iter(),d=a.tp$iternext();void 0!==d;d=a.tp$iternext())c.$push(d);return c},sq$length(){return this.tail-this.head&this.mask},sq$repeat(a){a=Sk.misceval.asIndexOrThrow(a,"can't multiply sequence by non-int of type '{tp$name}'");const b=this.tail-this.head&this.mask,c=this.$copy();let d;0>=a&&c.$clear();for(let e=1;e<a;e++)for(let a=0;a<b;a++)d=this.head+a&this.mask,c.$push(this.v[d]);return c},mp$subscript(a){a=Sk.misceval.asIndexOrThrow(a);const b=this.tail-this.head&this.mask;if(a>=b||a<-b)throw new Sk.builtin.IndexError("deque index out of range");const c=(0<=a?this.head:this.tail)+a&this.mask;return this.v[c]},mp$ass_subscript(a,b){a=Sk.misceval.asIndexOrThrow(a);const c=this.tail-this.head&this.mask;if(a>=c||a<-c)throw new Sk.builtin.IndexError("deque index out of range");void 0===b?this.del$item(a):this.set$item(a,b)},nb$inplace_add(a){for(this.maxlen=void 0,it=Sk.abstr.iter(a),i=it.tp$iternext();void 0!==i;i=it.tp$iternext())this.$push(i);return this},nb$inplace_multiply(a){a=Sk.misceval.asIndexSized(a,Sk.builtin.OverflowError,"can't multiply sequence by non-int of type '{tp$name}'"),0>=a&&this.$clear();const b=this.$copy(),c=this.tail-this.head&this.mask;for(let d=1;d<a;d++)for(let a=0;a<c;a++){const c=this.head+a&this.mask;b.$push(this.v[c])}return this.v=b.v,this.head=b.head,this.tail=b.tail,this.mask=b.mask,this}},methods:{append:{$meth(a){return this.$push(a),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:"Add an element to the right side of the deque."},appendleft:{$meth(a){return this.$pushLeft(a),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:"Add an element to the left side of the deque."},clear:{$meth(){return this.$clear(),Sk.builtin.none.none$},$flags:{NoArgs:!0},$textsig:null,$doc:"Remove all elements from the deque."},__copy__:{$meth(){return this.$copy()},$flags:{NoArgs:!0},$textsig:null,$doc:"Return a shallow copy of a deque."},copy:{$meth(){return this.$copy()},$flags:{NoArgs:!0},$textsig:null,$doc:"Return a shallow copy of a deque."},count:{$meth(a){const b=this.tail-this.head&this.mask;let c=0;for(let d=0;d<b;d++)Sk.misceval.richCompareBool(this.v[this.head+d&this.mask],a,"Eq")&&c++;return new Sk.builtin.int_(c)},$flags:{OneArg:!0},$textsig:null,$doc:"D.count(value) -> integer -- return number of occurrences of value"},extend:{$meth(a){return this.$extend(a),Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:"Extend the right side of the deque with elements from the iterable"},extendleft:{$meth(a){for(it=Sk.abstr.iter(a),i=it.tp$iternext();void 0!==i;i=it.tp$iternext())this.$pushLeft(i);return Sk.builtin.none.none$},$flags:{OneArg:!0},$textsig:null,$doc:"Extend the left side of the deque with elements from the iterable"},index:{$meth(a,b,c){const d=this.$index(a,b,c);if(void 0!==d)return new Sk.builtin.int_(d);throw new Sk.builtin.ValueError(Sk.misceval.objectRepr(a)+" is not in deque")},$flags:{MinArgs:1,MaxArgs:3},$textsig:null,$doc:"D.index(value, [start, [stop]]) -> integer -- return first index of value.\\nRaises ValueError if the value is not present."},insert:{$meth(a,b){a=Sk.misceval.asIndexOrThrow(a,"integer argument expected, got {tp$name}");const c=this.tail-this.head&this.mask;if(void 0!==this.maxlen&&c>=this.maxlen)throw new Sk.builtin.IndexError("deque already at its maximum size");a>c&&(a=c),a<=-c&&(a=0);const d=(0<=a?this.head:this.tail)+a&this.mask;let e=this.tail;for(this.tail=this.tail+1&this.mask;e!==d;){const a=e-1&this.mask;this.v[e]=this.v[a],e=a}return this.v[d]=b,this.head===this.tail&&this.$resize(this.v.length,this.v.length<<1),Sk.builtin.none.none$},$flags:{MinArgs:2,MaxArgs:2},$textsig:null,$doc:"D.insert(index, object) -- insert object before index"},pop:{$meth(){return this.$pop()},$flags:{NoArgs:!0},$textsig:null,$doc:"Remove and return the rightmost element."},popleft:{$meth(){return this.$popLeft()},$flags:{NoArgs:!0},$textsig:null,$doc:"Remove and return the leftmost element."},remove:{$meth(a){const b=this.$index(a);if(void 0===b)throw new Sk.builtin.ValueError(Sk.misceval.objectRepr(a)+" is not in deque");const c=this.head+b&this.mask;for(let b=c;b!==this.tail;){const a=b+1&this.mask;this.v[b]=this.v[a],b=a}this.tail=this.tail-1&this.mask;var d=this.tail-this.head&this.mask;d<this.mask>>>1&&this.$resize(d,this.v.length>>>1)},$flags:{OneArg:!0},$textsig:null,$doc:"D.remove(value) -- remove first occurrence of value."},__reversed__:{$meth(){return new d(this)},$flags:{NoArgs:!0},$textsig:null,$doc:"D.__reversed__() -- return a reverse iterator over the deque"},reverse:{$meth(){const c=this.head,d=this.tail,e=this.mask,f=this.tail-this.head&this.mask;for(let g=0;g<~~(f/2);g++){const f=d-g-1&e,a=c+g&e,b=this.v[f];this.v[f]=this.v[a],this.v[a]=b}return Sk.builtin.none.none$},$flags:{NoArgs:!0},$textsig:null,$doc:"D.reverse() -- reverse *IN PLACE*"},rotate:{$meth(a){a=void 0===a?1:Sk.misceval.asIndexSized(a,Sk.builtin.OverflowError);const c=this.head,d=this.tail;if(0===a||c===d)return this;if(this.head=c-a&this.mask,this.tail=d-a&this.mask,0<a)for(let e=1;e<=a;e++){const f=c-e&this.mask,a=d-e&this.mask;this.v[f]=this.v[a],this.v[a]=void 0}else for(let e=0;e>a;e--){const f=d-e&this.mask,a=c-e&this.mask;this.v[f]=this.v[a],this.v[a]=void 0}return Sk.builtin.none.none$},$flags:{MinArgs:0,MaxArgs:1},$textsig:null,$doc:"Rotate the deque n steps to the right (default n=1).  If n is negative, rotates left."}},getsets:{maxlen:{$get(){return void 0===this.maxlen?Sk.builtin.none.none$:new Sk.builtin.int_(this.maxlen)},$doc:"maximum size of a deque or None if unbounded"}},proto:{$clear(){this.head=0,this.tail=0,this.mask=1,this.v=[,,]},$copy(){return new a.deque(this.v.slice(0),this.maxlen,this.head,this.tail,this.mask)},$extend(a){for(it=Sk.abstr.iter(a),i=it.tp$iternext();void 0!==i;i=it.tp$iternext())this.$push(i)},set$item(a,b){const c=(0<=a?this.head:this.tail)+a&this.mask;this.v[c]=b},del$item(a){const b=(0<=a?this.head:this.tail)+a&this.mask;for(let c=b;c!==this.tail;){const a=c+1&this.mask;this.v[c]=this.v[a],c=a}const c=this.tail-this.head&this.mask;this.tail=this.tail-1&this.mask,c<this.mask>>>1&&this.$resize(c,this.v.length>>>1)},$push(a){this.v[this.tail]=a,this.tail=this.tail+1&this.mask,this.head===this.tail&&this.$resize(this.v.length,this.v.length<<1);const b=this.tail-this.head&this.mask;return void 0!==this.maxlen&&b>this.maxlen&&this.$popLeft(),this},$pushLeft(a){this.head=this.head-1&this.mask,this.v[this.head]=a,this.head===this.tail&&this.$resize(this.v.length,this.v.length<<1);const b=this.tail-this.head&this.mask;return void 0!==this.maxlen&&b>this.maxlen&&this.$pop(),this},$pop(){if(this.head===this.tail)throw new Sk.builtin.IndexError("pop from an empty deque");this.tail=this.tail-1&this.mask;const a=this.v[this.tail];this.v[this.tail]=void 0;const b=this.tail-this.head&this.mask;return b<this.mask>>>1&&this.$resize(b,this.v.length>>>1),a},$popLeft(){if(this.head===this.tail)throw new Sk.builtin.IndexError("pop from an empty deque");const a=this.v[this.head];this.v[this.head]=void 0,this.head=this.head+1&this.mask;const b=this.tail-this.head&this.mask;return b<this.mask>>>1&&this.$resize(b,this.v.length>>>1),a},$resize(a,b){const c=this.head,d=this.mask;if(this.head=0,this.tail=a,this.mask=b-1,0===c)return void(this.v.length=b);const e=Array(b);for(let f=0;f<a;f++)e[f]=this.v[c+f&d];this.v=e},$index(a,b,c){const d=this.tail-this.head&this.mask;b=void 0===b?0:Sk.misceval.asIndexOrThrow(b),c=c===void 0?d:Sk.misceval.asIndexOrThrow(c);const e=this.head,f=this.mask,g=this.v,h=0<=b?b:b<-d?0:d+b;c=0<=c?c:c<-d?0:d+c;for(let d=h;d<c;d++)if(g[e+d&f]===a)return d},sk$asarray(){const a=[],b=this.tail-this.head&this.mask;for(let c=0;c<b;++c){const b=this.head+c&this.mask;a.push(this.v[b])}return a}}});const c=Sk.abstr.buildIteratorClass("_collections._deque_iterator",{constructor:function _deque_iterator(a){this.$index=0,this.dq=a.v,this.$length=a.tail-a.head&a.mask,this.$head=a.head,this.$tail=a.tail,this.$mask=a.mask},iternext(){if(!(this.$index>=this.$length)){const a=(0<=this.$index?this.$head:this.$tail)+this.$index&this.$mask;return this.$index++,this.dq[a]}},methods:{__length_hint__:{$meth:function __length_hint__(){return new Sk.builtin.int_(this.$length-this.$index)},$flags:{NoArgs:!0}}}}),d=Sk.abstr.buildIteratorClass("_collections._deque_reverse_iterator",{constructor:function _deque_reverse_iterator(a){this.$index=(a.tail-a.head&a.mask)-1,this.dq=a.v,this.$head=a.head,this.$mask=a.mask},iternext(){if(!(0>this.$index)){const a=this.$head+this.$index&this.$mask;return this.$index--,this.dq[a]}},methods:{__length_hint__:Sk.generic.iterReverseLengthHintMethodDef}}),e=new RegExp(/^[0-9].*/),f=new RegExp(/^[0-9_].*/),g=new RegExp(/^\\w*$/),h=/,/g,j=/\\s+/;return namedtuple.co_argcount=2,namedtuple.co_kwonlyargcount=3,namedtuple.$kwdefs=[Sk.builtin.bool.false$,Sk.builtin.none.none$,Sk.builtin.none.none$],namedtuple.co_varnames=["typename","field_names","rename","defaults","module"],a.namedtuple=new Sk.builtin.func(namedtuple),a}`,"src/lib/colorsys.py":`raise NotImplementedError("colorsys is not yet implemented in Skulpt")
`,"src/lib/commands.py":`raise NotImplementedError("commands is not yet implemented in Skulpt")
`,"src/lib/compileall.py":`raise NotImplementedError("compileall is not yet implemented in Skulpt")
`,"src/lib/compiler/__init__.py":`raise NotImplementedError("compiler is not yet implemented in Skulpt")
`,"src/lib/config/__init__.py":`raise NotImplementedError("config is not yet implemented in Skulpt")
`,"src/lib/contextlib.py":`raise NotImplementedError("contextlib is not yet implemented in Skulpt")
`,"src/lib/cookielib.py":`raise NotImplementedError("cookielib is not yet implemented in Skulpt")
`,"src/lib/copy.py":`"""
This file was modified from CPython.
Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
2011, 2012, 2013, 2014, 2015 Python Software Foundation; All Rights Reserved
"""
import types
class Error(Exception):
    pass
error = Error 
class _EmptyClass:
    pass
try:
    long
except NameError:
    long = int

def copy(x):
    cls = type(x)
    if callable(x):
        return x
    copier = getattr(cls, "__copy__", None)
    if copier:
        return copier(x)
    if cls in (type(None), int, float, bool, str, tuple, type, frozenset, long):
        return x
    if (cls == list) or (cls == dict) or (cls == set) or (cls == slice):
        return cls(x)
    try:
        getstate = getattr(x, "__getstate__", None)
        setstate = getattr(x, "__setstate__", None)
        initargs = getattr(x, "__getinitargs__", None)
    except:
        reductor = False
    if getstate or setstate or initargs:
        raise NotImplementedError("Skulpt does not yet support copying with user-defined __getstate__, __setstate__ or __getinitargs__()")
    reductor = getattr(x, "__reduce_ex__", None)
    if reductor:
        rv = reductor(4)
    else:
        reductor = getattr(x, "__reduce__", None)
        if reductor:
            rv = reductor()
        elif str(cls)[1:6] == "class":
            copier = _copy_inst
            return copier(x)
        else:
            raise Error("un(shallow)copyable object of type %s" % cls)
    if isinstance(rv, str):
        return x
    return _reconstruct(x, rv, 0)

def _copy_inst(x):
    if hasattr(x, '__copy__'):
        return x.__copy__()
    if hasattr(x, '__getinitargs__'):
        args = x.__getinitargs__()
        y = x.__class__(*args)
    else:
        y = _EmptyClass()
        y.__class__ = x.__class__
    if hasattr(x, '__getstate__'):
        state = x.__getstate__()
    else:
        state = x.__dict__
    if hasattr(y, '__setstate__'):
        y.__setstate__(state)
    else:
        y.__dict__.update(state)
    return y

d = _deepcopy_dispatch = {}

def deepcopy(x, memo=None, _nil=[]):
    """Deep copy operation on arbitrary Python objects.
    See the module's __doc__ string for more info.
    """
    if memo is None:
        memo = {}
    idx = id(x)
    y = memo.get(idx, _nil)
    if y is not _nil:
        return y
    cls = type(x)
    try:
        getstate = getattr(x, "__getstate__", None)
        setstate = getattr(x, "__setstate__", None)
        initargs = getattr(x, "__getinitargs__", None)
    except:
        reductor = False
    if getstate or setstate or initargs:
        raise NotImplementedError("Skulpt does not yet support copying with user-defined __getstate__, __setstate__ or __getinitargs__()")
    copier = _deepcopy_dispatch.get(cls)
    if copier:
        y = copier(x, memo)
    elif str(cls)[1:6] == "class":
        copier = _deepcopy_dispatch["InstanceType"]
        y = copier(x, memo)
    else:
        try:
            issc = issubclass(cls, type)
        except TypeError: # cls is not a class (old Boost; see SF #502085)
            issc = 0
        if issc:
            y = _deepcopy_atomic(x, memo)
        else:
            copier = getattr(x, "__deepcopy__", None)
            if copier:
                y = copier(memo)
            else:
                reductor = getattr(x, "__reduce_ex__", None)
                if reductor:
                    rv = reductor(2)
                else:
                    reductor = getattr(x, "__reduce__", None)
                    if reductor:
                        rv = reductor()
                    else:
                        raise Error(
                            "un(deep)copyable object of type %s" % cls)
                y = _reconstruct(x, rv, 1, memo)
    memo[idx] = y
    _keep_alive(x, memo) # Make sure x lives at least as long as d
    return y

def _deepcopy_atomic(x, memo):
    return x
d[type(None)] = _deepcopy_atomic
# d[type(Ellipsis)] = _deepcopy_atomic
d[type(NotImplemented)] = _deepcopy_atomic
d[int] = _deepcopy_atomic
d[float] = _deepcopy_atomic
d[bool] = _deepcopy_atomic
d[complex] = _deepcopy_atomic
# d[bytes] = _deepcopy_atomic
d[str] = _deepcopy_atomic
# try:
# d[types.CodeType] = _deepcopy_atomic
# except AttributeError:
#   pass
d[type] = _deepcopy_atomic
# d[types.BuiltinFunctionType] = _deepcopy_atomic
d[types.FunctionType] = _deepcopy_atomic
# d[weakref.ref] = _deepcopy_atomic

def _deepcopy_list(x, memo):
    y = []
    memo[id(x)] = y
    for a in x:
        y.append(deepcopy(a, memo))
    return y
d[list] = _deepcopy_list

def _deepcopy_set(x, memo):
    result = set([])  # make empty set
    memo[id(x)] = result  # register this set in the memo for loop checking
    for a in x:   # go through elements of set
        result.add(deepcopy(a, memo))  # add the copied elements into the new set
    return result # return the new set
d[set] = _deepcopy_set

def _deepcopy_frozenset(x, memo):
    result = frozenset(_deepcopy_set(x,memo)) 
    memo[id(x)] = result 
    return result
d[frozenset] = _deepcopy_frozenset

def _deepcopy_tuple(x, memo):
    y = [deepcopy(a, memo) for a in x]
    # We're not going to put the tuple in the memo, but it's still important we
    # check for it, in case the tuple contains recursive mutable structures.
    try:
        return memo[id(x)]
    except KeyError:
        pass
    for k, j in zip(x, y):
        if k is not j:
            y = tuple(y)
            break
    else:
        y = x
    return y
d[tuple] = _deepcopy_tuple

def _deepcopy_dict(x, memo):
    y = {}
    memo[id(x)] = y
    for key, value in x.items():
        y[deepcopy(key, memo)] = deepcopy(value, memo)
    return y
d[dict] = _deepcopy_dict

# def _deepcopy_method(x, memo): # Copy instance methods
#     y = type(x)(x.im_func, deepcopy(x.im_self, memo), x.im_class);
#     return y
d[types.MethodType] = _deepcopy_atomic

def _deepcopy_inst(x, memo):
    if hasattr(x, '__deepcopy__'):
         return x.__deepcopy__(memo)
    if hasattr(x, '__getinitargs__'):
        args = x.__getinitargs__()
        args = deepcopy(args, memo)
        y = x.__class__(*args)
    else:
        y = _EmptyClass()
        y.__class__ = x.__class__
    memo[id(x)] = y
    if hasattr(x, '__getstate__'):
        state = x.__getstate__()
    else:
        state = x.__dict__
    state = deepcopy(state, memo)
    if hasattr(y, '__setstate__'):
        y.__setstate__(state)
    else:
        y.__dict__.update(state)
        return y
d["InstanceType"] = _deepcopy_inst

def _keep_alive(x, memo):
    """Keeps a reference to the object x in the memo.
    Because we remember objects by their id, we have
    to assure that possibly temporary objects are kept
    alive by referencing them.
    We store a reference at the id of the memo, which should
    normally not be used unless someone tries to deepcopy
    the memo itself...
    """
    try:
        memo[id(memo)].append(x)
    except KeyError:
        # aha, this is the first one :-)
        memo[id(memo)]=[x]

def _reconstruct(x, info, deep, memo=None):
    if isinstance(info, str):
        return x
    assert isinstance(info, tuple)
    if memo is None:
        memo = {}
    n = len(info)
    assert n in (2, 3, 4, 5)
    callable, args = info[:2]
    if n > 2:
        state = info[2]
    else:
        state = None
    if n > 3:
        listiter = info[3]
    else:
        listiter = None
    if n > 4:
        dictiter = info[4]
    else:
        dictiter = None
    if deep:
        args = deepcopy(args, memo)
    y = callable(*args)
    memo[id(x)] = y

    if state is not None:
        if deep:
            state = deepcopy(state, memo)
        if hasattr(y, '__setstate__'):
            y.__setstate__(state)
        else:
            if isinstance(state, tuple) and len(state) == 2:
                state, slotstate = state
            else:
                slotstate = None
            if state is not None:
                y.__dict__.update(state)
            if slotstate is not None:
                for key, value in slotstate.items():
                    setattr(y, key, value)

    if listiter is not None:
        for item in listiter:
            if deep:
                item = deepcopy(item, memo)
            y.append(item)
    if dictiter is not None:
        for key, value in dictiter:
            if deep:
                key = deepcopy(key, memo)
                value = deepcopy(value, memo)
            y[key] = value
    return y

del d

del types

# Helper for instance creation without calling __init__
class _EmptyClass:
    pass`,"src/lib/copy_reg.py":`raise NotImplementedError("copy_reg is not yet implemented in Skulpt")
`,"src/lib/csv.py":`raise NotImplementedError("csv is not yet implemented in Skulpt")
`,"src/lib/ctypes/__init__.py":`raise NotImplementedError("ctypes is not yet implemented in Skulpt")
`,"src/lib/ctypes/macholib/__init__.py":`raise NotImplementedError("macholib is not yet implemented in Skulpt")
`,"src/lib/curses/__init__.py":`raise NotImplementedError("curses is not yet implemented in Skulpt")
`,"src/lib/datetime.py":`"""Concrete date/time and related types -- prototype implemented in Python.

See http://www.zope.org/Members/fdrake/DateTimeWiki/FrontPage

See also http://dir.yahoo.com/Reference/calendars/

For a primer on DST, including many current DST rules, see
http://webexhibits.org/daylightsaving/

For more about DST than you ever wanted to know, see
ftp://elsie.nci.nih.gov/pub/

Sources for time zone and DST data: http://www.twinsun.com/tz/tz-link.htm

This was originally copied from the sandbox of the CPython CVS repository.
Thanks to Tim Peters for suggesting using it.

This was then copied from PyPy v5.1.0 into Skulpt by Meredydd Luff, removing
'from __future__ import division' (and replacing division operators accordingly)
and pickle support (which requires 'struct', which Skulpt does not currently
[as of 31/8/2016] have)
"""

import time as _time
import math as _math

# Python 2-vs-3 compat hack
import sys
unicode = unicode if sys.version_info < (3,) else str

_SENTINEL = object()

def _cmp(x, y):
    return 0 if x == y else 1 if x > y else -1

def _round(x):
    return int(_math.floor(x + 0.5) if x >= 0.0 else _math.ceil(x - 0.5))

MINYEAR = 1
MAXYEAR = 9999
_MINYEARFMT = 1900

_MAX_DELTA_DAYS = 999999999

# Utility functions, adapted from Python's Demo/classes/Dates.py, which
# also assumes the current Gregorian calendar indefinitely extended in
# both directions.  Difference:  Dates.py calls January 1 of year 0 day
# number 1.  The code here calls January 1 of year 1 day number 1.  This is
# to match the definition of the "proleptic Gregorian" calendar in Dershowitz
# and Reingold's "Calendrical Calculations", where it's the base calendar
# for all computations.  See the book for algorithms for converting between
# proleptic Gregorian ordinals and many other calendar systems.

_DAYS_IN_MONTH = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

_DAYS_BEFORE_MONTH = [-1]
dbm = 0
for dim in _DAYS_IN_MONTH[1:]:
    _DAYS_BEFORE_MONTH.append(dbm)
    dbm += dim
del dbm, dim

def _is_leap(year):
    "year -> 1 if leap year, else 0."
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

def _days_before_year(year):
    "year -> number of days before January 1st of year."
    y = year - 1
    return y*365 + y//4 - y//100 + y//400

def _days_in_month(year, month):
    "year, month -> number of days in that month in that year."
    assert 1 <= month <= 12, month
    if month == 2 and _is_leap(year):
        return 29
    return _DAYS_IN_MONTH[month]

def _days_before_month(year, month):
    "year, month -> number of days in year preceding first day of month."
    assert 1 <= month <= 12, 'month must be in 1..12'
    return _DAYS_BEFORE_MONTH[month] + (month > 2 and _is_leap(year))

def _ymd2ord(year, month, day):
    "year, month, day -> ordinal, considering 01-Jan-0001 as day 1."
    assert 1 <= month <= 12, 'month must be in 1..12'
    dim = _days_in_month(year, month)
    assert 1 <= day <= dim, ('day must be in 1..%d' % dim)
    return (_days_before_year(year) +
            _days_before_month(year, month) +
            day)

_DI400Y = _days_before_year(401)    # number of days in 400 years
_DI100Y = _days_before_year(101)    #    "    "   "   " 100   "
_DI4Y   = _days_before_year(5)      #    "    "   "   "   4   "

# A 4-year cycle has an extra leap day over what we'd get from pasting
# together 4 single years.
assert _DI4Y == 4 * 365 + 1

# Similarly, a 400-year cycle has an extra leap day over what we'd get from
# pasting together 4 100-year cycles.
assert _DI400Y == 4 * _DI100Y + 1

# OTOH, a 100-year cycle has one fewer leap day than we'd get from
# pasting together 25 4-year cycles.
assert _DI100Y == 25 * _DI4Y - 1

_US_PER_US = 1
_US_PER_MS = 1000
_US_PER_SECOND = 1000000
_US_PER_MINUTE = 60000000
_SECONDS_PER_DAY = 24 * 3600
_US_PER_HOUR = 3600000000
_US_PER_DAY = 86400000000
_US_PER_WEEK = 604800000000

def _ord2ymd(n):
    "ordinal -> (year, month, day), considering 01-Jan-0001 as day 1."

    # n is a 1-based index, starting at 1-Jan-1.  The pattern of leap years
    # repeats exactly every 400 years.  The basic strategy is to find the
    # closest 400-year boundary at or before n, then work with the offset
    # from that boundary to n.  Life is much clearer if we subtract 1 from
    # n first -- then the values of n at 400-year boundaries are exactly
    # those divisible by _DI400Y:
    #
    #     D  M   Y            n              n-1
    #     -- --- ----        ----------     ----------------
    #     31 Dec -400        -_DI400Y       -_DI400Y -1
    #      1 Jan -399         -_DI400Y +1   -_DI400Y      400-year boundary
    #     ...
    #     30 Dec  000        -1             -2
    #     31 Dec  000         0             -1
    #      1 Jan  001         1              0            400-year boundary
    #      2 Jan  001         2              1
    #      3 Jan  001         3              2
    #     ...
    #     31 Dec  400         _DI400Y        _DI400Y -1
    #      1 Jan  401         _DI400Y +1     _DI400Y      400-year boundary
    n -= 1
    n400, n = divmod(n, _DI400Y)
    year = n400 * 400 + 1   # ..., -399, 1, 401, ...

    # Now n is the (non-negative) offset, in days, from January 1 of year, to
    # the desired date.  Now compute how many 100-year cycles precede n.
    # Note that it's possible for n100 to equal 4!  In that case 4 full
    # 100-year cycles precede the desired day, which implies the desired
    # day is December 31 at the end of a 400-year cycle.
    n100, n = divmod(n, _DI100Y)

    # Now compute how many 4-year cycles precede it.
    n4, n = divmod(n, _DI4Y)

    # And now how many single years.  Again n1 can be 4, and again meaning
    # that the desired day is December 31 at the end of the 4-year cycle.
    n1, n = divmod(n, 365)

    year += n100 * 100 + n4 * 4 + n1
    if n1 == 4 or n100 == 4:
        assert n == 0
        return year-1, 12, 31

    # Now the year is correct, and n is the offset from January 1.  We find
    # the month via an estimate that's either exact or one too large.
    leapyear = n1 == 3 and (n4 != 24 or n100 == 3)
    assert leapyear == _is_leap(year)
    month = (n + 50) >> 5
    preceding = _DAYS_BEFORE_MONTH[month] + (month > 2 and leapyear)
    if preceding > n:  # estimate is too large
        month -= 1
        preceding -= _DAYS_IN_MONTH[month] + (month == 2 and leapyear)
    n -= preceding
    assert 0 <= n < _days_in_month(year, month)

    # Now the year and month are correct, and n is the offset from the
    # start of that month:  we're done!
    return year, month, n+1

# Month and day names.  For localized versions, see the calendar module.
_MONTHNAMES = [None, "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
_DAYNAMES = [None, "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def _build_struct_time(y, m, d, hh, mm, ss, dstflag):
    wday = (_ymd2ord(y, m, d) + 6) % 7
    dnum = _days_before_month(y, m) + d
    return _time.struct_time((y, m, d, hh, mm, ss, wday, dnum, dstflag))

def _format_time(hh, mm, ss, us):
    # Skip trailing microseconds when us==0.
    result = "%02d:%02d:%02d" % (hh, mm, ss)
    if us:
        result += ".%06d" % us
    return result

# Correctly substitute for %z and %Z escapes in strftime formats.
def _wrap_strftime(object, format, timetuple):
    year = timetuple[0]
    if year < _MINYEARFMT:
        raise ValueError("year=%d is before %d; the datetime strftime() "
                         "methods require year >= %d" %
                         (year, _MINYEARFMT, _MINYEARFMT))
    # Don't call utcoffset() or tzname() unless actually needed.
    freplace = None  # the string to use for %f
    zreplace = None  # the string to use for %z
    Zreplace = None  # the string to use for %Z

    # Scan format for %z and %Z escapes, replacing as needed.
    newformat = []
    push = newformat.append
    i, n = 0, len(format)
    while i < n:
        ch = format[i]
        i += 1
        if ch == '%':
            if i < n:
                ch = format[i]
                i += 1
                if ch == 'f':
                    if freplace is None:
                        freplace = '%06d' % getattr(object,
                                                    'microsecond', 0)
                    newformat.append(freplace)
                elif ch == 'z':
                    if zreplace is None:
                        zreplace = ""
                        if hasattr(object, "_utcoffset"):
                            offset = object._utcoffset()
                            if offset is not None:
                                sign = '+'
                                if offset < 0:
                                    offset = -offset
                                    sign = '-'
                                h, m = divmod(offset, 60)
                                zreplace = '%c%02d%02d' % (sign, h, m)
                    assert '%' not in zreplace
                    newformat.append(zreplace)
                elif ch == 'Z':
                    if Zreplace is None:
                        Zreplace = ""
                        if hasattr(object, "tzname"):
                            s = object.tzname()
                            if s is not None:
                                # strftime is going to have at this: escape %
                                Zreplace = s.replace('%', '%%')
                    newformat.append(Zreplace)
                else:
                    push('%')
                    push(ch)
            else:
                push('%')
        else:
            push(ch)
    newformat = "".join(newformat)
    return _time.strftime(newformat, timetuple)

# Just raise TypeError if the arg isn't None or a string.
def _check_tzname(name):
    if name is not None and not isinstance(name, str):
        raise TypeError("tzinfo.tzname() must return None or string, "
                        "not '%s'" % type(name))

# name is the offset-producing method, "utcoffset" or "dst".
# offset is what it returned.
# If offset isn't None or timedelta, raises TypeError.
# If offset is None, returns None.
# Else offset is checked for being in range, and a whole # of minutes.
# If it is, its integer value is returned.  Else ValueError is raised.
def _check_utc_offset(name, offset):
    assert name in ("utcoffset", "dst")
    if offset is None:
        return
    if not isinstance(offset, timedelta):
        raise TypeError("tzinfo.%s() must return None "
                        "or timedelta, not '%s'" % (name, type(offset)))
    days = offset.days
    if days < -1 or days > 0:
        offset = 1440  # trigger out-of-range
    else:
        seconds = days * 86400 + offset.seconds
        minutes, seconds = divmod(seconds, 60)
        if seconds or offset.microseconds:
            raise ValueError("tzinfo.%s() must return a whole number "
                             "of minutes" % name)
        offset = minutes
    if not -1440 < offset < 1440:
        raise ValueError("%s()=%d, must be in -1439..1439" % (name, offset))
    return offset

def _check_int_field(value):
    if isinstance(value, int):
        return int(value)
    if not isinstance(value, float):
        try:
            value = value.__int__()
        except AttributeError:
            pass
        else:
            if isinstance(value, int):
                return int(value)
            raise TypeError('__int__ method should return an integer')
        raise TypeError('an integer is required')
    raise TypeError('integer argument expected, got float')

def _check_date_fields(year, month, day):
    year = _check_int_field(year)
    month = _check_int_field(month)
    day = _check_int_field(day)
    if not MINYEAR <= year <= MAXYEAR:
        raise ValueError('year must be in %d..%d' % (MINYEAR, MAXYEAR), year)
    if not 1 <= month <= 12:
        raise ValueError('month must be in 1..12', month)
    dim = _days_in_month(year, month)
    if not 1 <= day <= dim:
        raise ValueError('day must be in 1..%d' % dim, day)
    return year, month, day

def _check_time_fields(hour, minute, second, microsecond):
    hour = _check_int_field(hour)
    minute = _check_int_field(minute)
    second = _check_int_field(second)
    microsecond = _check_int_field(microsecond)
    if not 0 <= hour <= 23:
        raise ValueError('hour must be in 0..23', hour)
    if not 0 <= minute <= 59:
        raise ValueError('minute must be in 0..59', minute)
    if not 0 <= second <= 59:
        raise ValueError('second must be in 0..59', second)
    if not 0 <= microsecond <= 999999:
        raise ValueError('microsecond must be in 0..999999', microsecond)
    return hour, minute, second, microsecond

def _check_tzinfo_arg(tz):
    if tz is not None and not isinstance(tz, tzinfo):
        raise TypeError("tzinfo argument must be None or of a tzinfo subclass")


# Notes on comparison:  In general, datetime module comparison operators raise
# TypeError when they don't know how to do a comparison themself.  If they
# returned NotImplemented instead, comparison could (silently) fall back to
# the default compare-objects-by-comparing-their-memory-addresses strategy,
# and that's not helpful.  There are two exceptions:
#
# 1. For date and datetime, if the other object has a "timetuple" attr,
#    NotImplemented is returned.  This is a hook to allow other kinds of
#    datetime-like objects a chance to intercept the comparison.
#
# 2. Else __eq__ and __ne__ return False and True, respectively.  This is
#    so opertaions like
#
#        x == y
#        x != y
#        x in sequence
#        x not in sequence
#        dict[x] = y
#
#    don't raise annoying TypeErrors just because a datetime object
#    is part of a heterogeneous collection.  If there's no known way to
#    compare X to a datetime, saying they're not equal is reasonable.

def _cmperror(x, y):
    raise TypeError("can't compare '%s' to '%s'" % (
                    type(x).__name__, type(y).__name__))

def _normalize_pair(hi, lo, factor):
    if not 0 <= lo <= factor-1:
        inc, lo = divmod(lo, factor)
        hi += inc
    return hi, lo

def _normalize_datetime(y, m, d, hh, mm, ss, us, ignore_overflow=False):
    # Normalize all the inputs, and store the normalized values.
    ss, us = _normalize_pair(ss, us, 1000000)
    mm, ss = _normalize_pair(mm, ss, 60)
    hh, mm = _normalize_pair(hh, mm, 60)
    d, hh = _normalize_pair(d, hh, 24)
    y, m, d = _normalize_date(y, m, d, ignore_overflow)
    return y, m, d, hh, mm, ss, us

def _normalize_date(year, month, day, ignore_overflow=False):
    # That was easy.  Now it gets muddy:  the proper range for day
    # can't be determined without knowing the correct month and year,
    # but if day is, e.g., plus or minus a million, the current month
    # and year values make no sense (and may also be out of bounds
    # themselves).
    # Saying 12 months == 1 year should be non-controversial.
    if not 1 <= month <= 12:
        year, month = _normalize_pair(year, month-1, 12)
        month += 1
        assert 1 <= month <= 12

    # Now only day can be out of bounds (year may also be out of bounds
    # for a datetime object, but we don't care about that here).
    # If day is out of bounds, what to do is arguable, but at least the
    # method here is principled and explainable.
    dim = _days_in_month(year, month)
    if not 1 <= day <= dim:
        # Move day-1 days from the first of the month.  First try to
        # get off cheap if we're only one day out of range (adjustments
        # for timezone alone can't be worse than that).
        if day == 0:    # move back a day
            month -= 1
            if month > 0:
                day = _days_in_month(year, month)
            else:
                year, month, day = year-1, 12, 31
        elif day == dim + 1:    # move forward a day
            month += 1
            day = 1
            if month > 12:
                month = 1
                year += 1
        else:
            ordinal = _ymd2ord(year, month, 1) + (day - 1)
            year, month, day = _ord2ymd(ordinal)

    if not ignore_overflow and not MINYEAR <= year <= MAXYEAR:
        raise OverflowError("date value out of range")
    return year, month, day

def _accum(tag, sofar, num, factor, leftover):
    if isinstance(num, int):
        prod = num * factor
        rsum = sofar + prod
        return rsum, leftover
    if isinstance(num, float):
        fracpart, intpart = _math.modf(num)
        prod = int(intpart) * factor
        rsum = sofar + prod
        if fracpart == 0.0:
            return rsum, leftover
        assert isinstance(factor, int)
        fracpart, intpart = _math.modf(factor * fracpart)
        rsum += int(intpart)
        return rsum, leftover + fracpart
    raise TypeError("unsupported type for timedelta %s component: %s" %
                    (tag, type(num)))

class timedelta(object):
    """Represent the difference between two datetime objects.

    Supported operators:

    - add, subtract timedelta
    - unary plus, minus, abs
    - compare to timedelta
    - multiply, divide by int/long

    In addition, datetime supports subtraction of two datetime objects
    returning a timedelta, and addition or subtraction of a datetime
    and a timedelta giving a datetime.

    Representation: (days, seconds, microseconds).  Why?  Because I
    felt like it.
    """
    __slots__ = '_days', '_seconds', '_microseconds', '_hashcode'

    def __new__(cls, days=_SENTINEL, seconds=_SENTINEL, microseconds=_SENTINEL,
                milliseconds=_SENTINEL, minutes=_SENTINEL, hours=_SENTINEL, weeks=_SENTINEL):
        x = 0
        leftover = 0.0
        if microseconds is not _SENTINEL:
            x, leftover = _accum("microseconds", x, microseconds, _US_PER_US, leftover)
        if milliseconds is not _SENTINEL:
            x, leftover = _accum("milliseconds", x, milliseconds, _US_PER_MS, leftover)
        if seconds is not _SENTINEL:
            x, leftover = _accum("seconds", x, seconds, _US_PER_SECOND, leftover)
        if minutes is not _SENTINEL:
            x, leftover = _accum("minutes", x, minutes, _US_PER_MINUTE, leftover)
        if hours is not _SENTINEL:
            x, leftover = _accum("hours", x, hours, _US_PER_HOUR, leftover)
        if days is not _SENTINEL:
            x, leftover = _accum("days", x, days, _US_PER_DAY, leftover)
        if weeks is not _SENTINEL:
            x, leftover = _accum("weeks", x, weeks, _US_PER_WEEK, leftover)
        if leftover != 0.0:
            x += _round(leftover)
        return cls._from_microseconds(x)

    @classmethod
    def _from_microseconds(cls, us):
        s, us = divmod(us, _US_PER_SECOND)
        d, s = divmod(s, _SECONDS_PER_DAY)
        return cls._create(d, s, us, False)

    @classmethod
    def _create(cls, d, s, us, normalize):
        if normalize:
            s, us = _normalize_pair(s, us, 1000000)
            d, s = _normalize_pair(d, s, 24*3600)

        if not -_MAX_DELTA_DAYS <= d <= _MAX_DELTA_DAYS:
            raise OverflowError("days=%d; must have magnitude <= %d" % (d, _MAX_DELTA_DAYS))

        self = object.__new__(cls)
        self._days = d
        self._seconds = s
        self._microseconds = us
        self._hashcode = -1
        return self

    def _to_microseconds(self):
        return ((self._days * _SECONDS_PER_DAY + self._seconds) * _US_PER_SECOND +
                self._microseconds)

    def __repr__(self):
        module = "datetime." if self.__class__ is timedelta else ""
        if self._microseconds:
            return "%s(%d, %d, %d)" % (module + self.__class__.__name__,
                                       self._days,
                                       self._seconds,
                                       self._microseconds)
        if self._seconds:
            return "%s(%d, %d)" % (module + self.__class__.__name__,
                                   self._days,
                                   self._seconds)
        return "%s(%d)" % (module + self.__class__.__name__, self._days)

    def __str__(self):
        mm, ss = divmod(self._seconds, 60)
        hh, mm = divmod(mm, 60)
        s = "%d:%02d:%02d" % (hh, mm, ss)
        if self._days:
            def plural(n):
                return n, abs(n) != 1 and "s" or ""
            s = ("%d day%s, " % plural(self._days)) + s
        if self._microseconds:
            s = s + ".%06d" % self._microseconds
        return s

    def total_seconds(self):
        """Total seconds in the duration."""
        return self._to_microseconds() / 10.0**6

    # Read-only field accessors
    @property
    def days(self):
        """days"""
        return self._days

    @property
    def seconds(self):
        """seconds"""
        return self._seconds

    @property
    def microseconds(self):
        """microseconds"""
        return self._microseconds

    def __add__(self, other):
        if isinstance(other, timedelta):
            # for CPython compatibility, we cannot use
            # our __class__ here, but need a real timedelta
            return timedelta._create(self._days + other._days,
                                     self._seconds + other._seconds,
                                     self._microseconds + other._microseconds,
                                     True)
        return NotImplemented

    def __sub__(self, other):
        if isinstance(other, timedelta):
            # for CPython compatibility, we cannot use
            # our __class__ here, but need a real timedelta
            return timedelta._create(self._days - other._days,
                                     self._seconds - other._seconds,
                                     self._microseconds - other._microseconds,
                                     True)
        return NotImplemented

    def __neg__(self):
        # for CPython compatibility, we cannot use
        # our __class__ here, but need a real timedelta
        return timedelta._create(-self._days,
                                 -self._seconds,
                                 -self._microseconds,
                                 True)

    def __pos__(self):
        # for CPython compatibility, we cannot use
        # our __class__ here, but need a real timedelta
        return timedelta._create(self._days,
                                 self._seconds,
                                 self._microseconds,
                                 False)

    def __abs__(self):
        if self._days < 0:
            return -self
        else:
            return self

    def __mul__(self, other):
        if not isinstance(other, int):
            return NotImplemented
        usec = self._to_microseconds()
        return timedelta._from_microseconds(usec * other)

    __rmul__ = __mul__

    def __div__(self, other):
        if not isinstance(other, int):
            return NotImplemented
        usec = self._to_microseconds()
        return timedelta._from_microseconds(usec // other)

    __floordiv__ = __div__

    # Comparisons of timedelta objects with other.

    def __eq__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) == 0
        else:
            return False

    def __ne__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) != 0
        else:
            return True

    def __le__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) <= 0
        else:
            _cmperror(self, other)

    def __lt__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) < 0
        else:
            _cmperror(self, other)

    def __ge__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) >= 0
        else:
            _cmperror(self, other)

    def __gt__(self, other):
        if isinstance(other, timedelta):
            return self._cmp(other) > 0
        else:
            _cmperror(self, other)

    def _cmp(self, other):
        assert isinstance(other, timedelta)
        return _cmp(self._getstate(), other._getstate())

    def __hash__(self):
        if self._hashcode == -1:
            self._hashcode = hash(self._getstate())
        return self._hashcode

    def __nonzero__(self):
        return (self._days != 0 or
                self._seconds != 0 or
                self._microseconds != 0)

timedelta.min = timedelta(-_MAX_DELTA_DAYS)
timedelta.max = timedelta(_MAX_DELTA_DAYS, 24*3600-1, 1000000-1)
timedelta.resolution = timedelta(microseconds=1)

class date(object):
    """Concrete date type.

    Constructors:

    __new__()
    fromtimestamp()
    today()
    fromordinal()

    Operators:

    __repr__, __str__
    __cmp__, __hash__
    __add__, __radd__, __sub__ (add/radd only with timedelta arg)

    Methods:

    timetuple()
    toordinal()
    weekday()
    isoweekday(), isocalendar(), isoformat()
    ctime()
    strftime()

    Properties (readonly):
    year, month, day
    """
    __slots__ = '_year', '_month', '_day', '_hashcode'

    def __new__(cls, year, month=None, day=None):
        """Constructor.

        Arguments:

        year, month, day (required, base 1)
        """
        year, month, day = _check_date_fields(year, month, day)
        self = object.__new__(cls)
        self._year = year
        self._month = month
        self._day = day
        self._hashcode = -1
        return self

    # Additional constructors

    @classmethod
    def fromtimestamp(cls, t):
        "Construct a date from a POSIX timestamp (like time.time())."
        y, m, d, hh, mm, ss, weekday, jday, dst = _time.localtime(t)
        return cls(y, m, d)

    @classmethod
    def today(cls):
        "Construct a date from time.time()."
        t = _time.time()
        return cls.fromtimestamp(t)

    @classmethod
    def fromordinal(cls, n):
        """Contruct a date from a proleptic Gregorian ordinal.

        January 1 of year 1 is day 1.  Only the year, month and day are
        non-zero in the result.
        """
        y, m, d = _ord2ymd(n)
        return cls(y, m, d)

    # Conversions to string

    def __repr__(self):
        """Convert to formal string, for repr().

        >>> dt = datetime(2010, 1, 1)
        >>> repr(dt)
        'datetime.datetime(2010, 1, 1, 0, 0)'

        >>> dt = datetime(2010, 1, 1, tzinfo=timezone.utc)
        >>> repr(dt)
        'datetime.datetime(2010, 1, 1, 0, 0, tzinfo=datetime.timezone.utc)'
        """
        module = "datetime." if self.__class__ is date else ""
        return "%s(%d, %d, %d)" % (module + self.__class__.__name__,
                                   self._year,
                                   self._month,
                                   self._day)

    # XXX These shouldn't depend on time.localtime(), because that
    # clips the usable dates to [1970 .. 2038).  At least ctime() is
    # easily done without using strftime() -- that's better too because
    # strftime("%c", ...) is locale specific.

    def ctime(self):
        "Return ctime() style string."
        weekday = self.toordinal() % 7 or 7
        return "%s %s %2d 00:00:00 %04d" % (
            _DAYNAMES[weekday],
            _MONTHNAMES[self._month],
            self._day, self._year)

    def strftime(self, format):
        "Format using strftime()."
        return _wrap_strftime(self, format, self.timetuple())

    def __format__(self, fmt):
        if not isinstance(fmt, (str, unicode)):
            raise ValueError("__format__ expects str or unicode, not %s" %
                             fmt.__class__.__name__)
        if len(fmt) != 0:
            return self.strftime(fmt)
        return str(self)

    def isoformat(self):
        """Return the date formatted according to ISO.

        This is 'YYYY-MM-DD'.

        References:
        - http://www.w3.org/TR/NOTE-datetime
        - http://www.cl.cam.ac.uk/~mgk25/iso-time.html
        """
        return "%04d-%02d-%02d" % (self._year, self._month, self._day)

    __str__ = isoformat

    # Read-only field accessors
    @property
    def year(self):
        """year (1-9999)"""
        return self._year

    @property
    def month(self):
        """month (1-12)"""
        return self._month

    @property
    def day(self):
        """day (1-31)"""
        return self._day

    # Standard conversions, __cmp__, __hash__ (and helpers)

    def timetuple(self):
        "Return local time tuple compatible with time.localtime()."
        return _build_struct_time(self._year, self._month, self._day,
                                  0, 0, 0, -1)

    def toordinal(self):
        """Return proleptic Gregorian ordinal for the year, month and day.

        January 1 of year 1 is day 1.  Only the year, month and day values
        contribute to the result.
        """
        return _ymd2ord(self._year, self._month, self._day)

    def replace(self, year=None, month=None, day=None):
        """Return a new date with new values for the specified fields."""
        if year is None:
            year = self._year
        if month is None:
            month = self._month
        if day is None:
            day = self._day
        return date(year, month, day)

    # Comparisons of date objects with other.

    def __eq__(self, other):
        if isinstance(other, date):
            return self._cmp(other) == 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            return False

    def __ne__(self, other):
        if isinstance(other, date):
            return self._cmp(other) != 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            return True

    def __le__(self, other):
        if isinstance(other, date):
            return self._cmp(other) <= 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __lt__(self, other):
        if isinstance(other, date):
            return self._cmp(other) < 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __ge__(self, other):
        if isinstance(other, date):
            return self._cmp(other) >= 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __gt__(self, other):
        if isinstance(other, date):
            return self._cmp(other) > 0
        elif hasattr(other, "timetuple"):
            return NotImplemented
        else:
            _cmperror(self, other)

    def _cmp(self, other):
        assert isinstance(other, date)
        y, m, d = self._year, self._month, self._day
        y2, m2, d2 = other._year, other._month, other._day
        return _cmp((y, m, d), (y2, m2, d2))

    def __hash__(self):
        "Hash."
        if self._hashcode == -1:
            self._hashcode = hash(self._getstate())
        return self._hashcode

    # Computations

    def _add_timedelta(self, other, factor):
        y, m, d = _normalize_date(
            self._year,
            self._month,
            self._day + other.days * factor)
        return date(y, m, d)

    def __add__(self, other):
        "Add a date to a timedelta."
        if isinstance(other, timedelta):
            return self._add_timedelta(other, 1)
        return NotImplemented

    __radd__ = __add__

    def __sub__(self, other):
        """Subtract two dates, or a date and a timedelta."""
        if isinstance(other, date):
            days1 = self.toordinal()
            days2 = other.toordinal()
            return timedelta._create(days1 - days2, 0, 0, False)
        if isinstance(other, timedelta):
            return self._add_timedelta(other, -1)
        return NotImplemented

    def weekday(self):
        "Return day of the week, where Monday == 0 ... Sunday == 6."
        return (self.toordinal() + 6) % 7

    # Day-of-the-week and week-of-the-year, according to ISO

    def isoweekday(self):
        "Return day of the week, where Monday == 1 ... Sunday == 7."
        # 1-Jan-0001 is a Monday
        return self.toordinal() % 7 or 7

    def isocalendar(self):
        """Return a 3-tuple containing ISO year, week number, and weekday.

        The first ISO week of the year is the (Mon-Sun) week
        containing the year's first Thursday; everything else derives
        from that.

        The first week is 1; Monday is 1 ... Sunday is 7.

        ISO calendar algorithm taken from
        http://www.phys.uu.nl/~vgent/calendar/isocalendar.htm
        """
        year = self._year
        week1monday = _isoweek1monday(year)
        today = _ymd2ord(self._year, self._month, self._day)
        # Internally, week and day have origin 0
        week, day = divmod(today - week1monday, 7)
        if week < 0:
            year -= 1
            week1monday = _isoweek1monday(year)
            week, day = divmod(today - week1monday, 7)
        elif week >= 52:
            if today >= _isoweek1monday(year+1):
                year += 1
                week = 0
        return year, week+1, day+1

_date_class = date  # so functions w/ args named "date" can get at the class

date.min = date(1, 1, 1)
date.max = date(9999, 12, 31)
date.resolution = timedelta(days=1)

class tzinfo(object):
    """Abstract base class for time zone info classes.

    Subclasses must override the name(), utcoffset() and dst() methods.
    """
    __slots__ = ()

    def tzname(self, dt):
        "datetime -> string name of time zone."
        raise NotImplementedError("tzinfo subclass must override tzname()")

    def utcoffset(self, dt):
        "datetime -> minutes east of UTC (negative for west of UTC)"
        raise NotImplementedError("tzinfo subclass must override utcoffset()")

    def dst(self, dt):
        """datetime -> DST offset in minutes east of UTC.

        Return 0 if DST not in effect.  utcoffset() must include the DST
        offset.
        """
        raise NotImplementedError("tzinfo subclass must override dst()")

    def fromutc(self, dt):
        "datetime in UTC -> datetime in local time."

        if not isinstance(dt, datetime):
            raise TypeError("fromutc() requires a datetime argument")
        if dt.tzinfo is not self:
            raise ValueError("dt.tzinfo is not self")

        dtoff = dt.utcoffset()
        if dtoff is None:
            raise ValueError("fromutc() requires a non-None utcoffset() "
                             "result")

        # See the long comment block at the end of this file for an
        # explanation of this algorithm.
        dtdst = dt.dst()
        if dtdst is None:
            raise ValueError("fromutc() requires a non-None dst() result")
        delta = dtoff - dtdst
        if delta:
            dt = dt + delta
            dtdst = dt.dst()
            if dtdst is None:
                raise ValueError("fromutc(): dt.dst gave inconsistent "
                                 "results; cannot convert")
        if dtdst:
            return dt + dtdst
        else:
            return dt

_tzinfo_class = tzinfo

class time(object):
    """Time with time zone.

    Constructors:

    __new__()

    Operators:

    __repr__, __str__
    __cmp__, __hash__

    Methods:

    strftime()
    isoformat()
    utcoffset()
    tzname()
    dst()

    Properties (readonly):
    hour, minute, second, microsecond, tzinfo
    """
    __slots__ = '_hour', '_minute', '_second', '_microsecond', '_tzinfo', '_hashcode'

    def __new__(cls, hour=0, minute=0, second=0, microsecond=0, tzinfo=None):
        """Constructor.

        Arguments:

        hour, minute (required)
        second, microsecond (default to zero)
        tzinfo (default to None)
        """
        hour, minute, second, microsecond = _check_time_fields(
            hour, minute, second, microsecond)
        _check_tzinfo_arg(tzinfo)
        self = object.__new__(cls)
        self._hour = hour
        self._minute = minute
        self._second = second
        self._microsecond = microsecond
        self._tzinfo = tzinfo
        self._hashcode = -1
        return self

    # Read-only field accessors
    @property
    def hour(self):
        """hour (0-23)"""
        return self._hour

    @property
    def minute(self):
        """minute (0-59)"""
        return self._minute

    @property
    def second(self):
        """second (0-59)"""
        return self._second

    @property
    def microsecond(self):
        """microsecond (0-999999)"""
        return self._microsecond

    @property
    def tzinfo(self):
        """timezone info object"""
        return self._tzinfo

    # Standard conversions, __hash__ (and helpers)

    # Comparisons of time objects with other.

    def __eq__(self, other):
        if isinstance(other, time):
            return self._cmp(other) == 0
        else:
            return False

    def __ne__(self, other):
        if isinstance(other, time):
            return self._cmp(other) != 0
        else:
            return True

    def __le__(self, other):
        if isinstance(other, time):
            return self._cmp(other) <= 0
        else:
            _cmperror(self, other)

    def __lt__(self, other):
        if isinstance(other, time):
            return self._cmp(other) < 0
        else:
            _cmperror(self, other)

    def __ge__(self, other):
        if isinstance(other, time):
            return self._cmp(other) >= 0
        else:
            _cmperror(self, other)

    def __gt__(self, other):
        if isinstance(other, time):
            return self._cmp(other) > 0
        else:
            _cmperror(self, other)

    def _cmp(self, other):
        assert isinstance(other, time)
        mytz = self._tzinfo
        ottz = other._tzinfo
        myoff = otoff = None

        if mytz is ottz:
            base_compare = True
        else:
            myoff = self._utcoffset()
            otoff = other._utcoffset()
            base_compare = myoff == otoff

        if base_compare:
            return _cmp((self._hour, self._minute, self._second,
                         self._microsecond),
                        (other._hour, other._minute, other._second,
                         other._microsecond))
        if myoff is None or otoff is None:
            raise TypeError("can't compare offset-naive and offset-aware times")
        myhhmm = self._hour * 60 + self._minute - myoff
        othhmm = other._hour * 60 + other._minute - otoff
        return _cmp((myhhmm, self._second, self._microsecond),
                    (othhmm, other._second, other._microsecond))

    def __hash__(self):
        """Hash."""
        if self._hashcode == -1:
            tzoff = self._utcoffset()
            if not tzoff:  # zero or None
                self._hashcode = hash(self._getstate()[0])
            else:
                h, m = divmod(self.hour * 60 + self.minute - tzoff, 60)
                if 0 <= h < 24:
                    self._hashcode = hash(time(h, m, self.second, self.microsecond))
                else:
                    self._hashcode = hash((h, m, self.second, self.microsecond))
        return self._hashcode

    # Conversion to string

    def _tzstr(self, sep=":"):
        """Return formatted timezone offset (+xx:xx) or None."""
        off = self._utcoffset()
        if off is not None:
            if off < 0:
                sign = "-"
                off = -off
            else:
                sign = "+"
            hh, mm = divmod(off, 60)
            assert 0 <= hh < 24
            off = "%s%02d%s%02d" % (sign, hh, sep, mm)
        return off

    def __repr__(self):
        """Convert to formal string, for repr()."""
        if self._microsecond != 0:
            s = ", %d, %d" % (self._second, self._microsecond)
        elif self._second != 0:
            s = ", %d" % self._second
        else:
            s = ""
        module = "datetime." if self.__class__ is time else ""
        s= "%s(%d, %d%s)" % (module + self.__class__.__name__,
                             self._hour, self._minute, s)
        if self._tzinfo is not None:
            assert s[-1:] == ")"
            s = s[:-1] + ", tzinfo=%r" % self._tzinfo + ")"
        return s

    def isoformat(self):
        """Return the time formatted according to ISO.

        This is 'HH:MM:SS.mmmmmm+zz:zz', or 'HH:MM:SS+zz:zz' if
        self.microsecond == 0.
        """
        s = _format_time(self._hour, self._minute, self._second,
                         self._microsecond)
        tz = self._tzstr()
        if tz:
            s += tz
        return s

    __str__ = isoformat

    def strftime(self, format):
        """Format using strftime().  The date part of the timestamp passed
        to underlying strftime should not be used.
        """
        # The year must be >= _MINYEARFMT else Python's strftime implementation
        # can raise a bogus exception.
        timetuple = (1900, 1, 1,
                     self._hour, self._minute, self._second,
                     0, 1, -1)
        return _wrap_strftime(self, format, timetuple)

    def __format__(self, fmt):
        if not isinstance(fmt, (str, unicode)):
            raise ValueError("__format__ expects str or unicode, not %s" %
                             fmt.__class__.__name__)
        if len(fmt) != 0:
            return self.strftime(fmt)
        return str(self)

    # Timezone functions

    def utcoffset(self):
        """Return the timezone offset in minutes east of UTC (negative west of
        UTC)."""
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.utcoffset(None)
        offset = _check_utc_offset("utcoffset", offset)
        if offset is not None:
            offset = timedelta._create(0, offset * 60, 0, True)
        return offset

    # Return an integer (or None) instead of a timedelta (or None).
    def _utcoffset(self):
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.utcoffset(None)
        offset = _check_utc_offset("utcoffset", offset)
        return offset

    def tzname(self):
        """Return the timezone name.

        Note that the name is 100% informational -- there's no requirement that
        it mean anything in particular. For example, "GMT", "UTC", "-500",
        "-5:00", "EDT", "US/Eastern", "America/New York" are all valid replies.
        """
        if self._tzinfo is None:
            return None
        name = self._tzinfo.tzname(None)
        _check_tzname(name)
        return name

    def dst(self):
        """Return 0 if DST is not in effect, or the DST offset (in minutes
        eastward) if DST is in effect.

        This is purely informational; the DST offset has already been added to
        the UTC offset returned by utcoffset() if applicable, so there's no
        need to consult dst() unless you're interested in displaying the DST
        info.
        """
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.dst(None)
        offset = _check_utc_offset("dst", offset)
        if offset is not None:
            offset = timedelta._create(0, offset * 60, 0, True)
        return offset

    # Return an integer (or None) instead of a timedelta (or None).
    def _dst(self):
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.dst(None)
        offset = _check_utc_offset("dst", offset)
        return offset

    def replace(self, hour=None, minute=None, second=None, microsecond=None,
                tzinfo=True):
        """Return a new time with new values for the specified fields."""
        if hour is None:
            hour = self.hour
        if minute is None:
            minute = self.minute
        if second is None:
            second = self.second
        if microsecond is None:
            microsecond = self.microsecond
        if tzinfo is True:
            tzinfo = self.tzinfo
        return time(hour, minute, second, microsecond, tzinfo)

    def __nonzero__(self):
        if self.second or self.microsecond:
            return True
        offset = self._utcoffset() or 0
        return self.hour * 60 + self.minute != offset

_time_class = time  # so functions w/ args named "time" can get at the class

time.min = time(0, 0, 0)
time.max = time(23, 59, 59, 999999)
time.resolution = timedelta(microseconds=1)

class datetime(date):
    """datetime(year, month, day[, hour[, minute[, second[, microsecond[,tzinfo]]]]])

    The year, month and day arguments are required. tzinfo may be None, or an
    instance of a tzinfo subclass. The remaining arguments may be ints or longs.
    """
    __slots__ = date.__slots__ + time.__slots__

    def __new__(cls, year, month=None, day=None, hour=0, minute=0, second=0,
                microsecond=0, tzinfo=None):
        year, month, day = _check_date_fields(year, month, day)
        hour, minute, second, microsecond = _check_time_fields(
            hour, minute, second, microsecond)
        _check_tzinfo_arg(tzinfo)
        self = object.__new__(cls)
        self._year = year
        self._month = month
        self._day = day
        self._hour = hour
        self._minute = minute
        self._second = second
        self._microsecond = microsecond
        self._tzinfo = tzinfo
        self._hashcode = -1
        return self

    # Read-only field accessors
    @property
    def hour(self):
        """hour (0-23)"""
        return self._hour

    @property
    def minute(self):
        """minute (0-59)"""
        return self._minute

    @property
    def second(self):
        """second (0-59)"""
        return self._second

    @property
    def microsecond(self):
        """microsecond (0-999999)"""
        return self._microsecond

    @property
    def tzinfo(self):
        """timezone info object"""
        return self._tzinfo

    @classmethod
    def fromtimestamp(cls, timestamp, tz=None):
        """Construct a datetime from a POSIX timestamp (like time.time()).

        A timezone info object may be passed in as well.
        """
        _check_tzinfo_arg(tz)
        converter = _time.localtime if tz is None else _time.gmtime
        self = cls._from_timestamp(converter, timestamp, tz)
        if tz is not None:
            self = tz.fromutc(self)
        return self

    @classmethod
    def utcfromtimestamp(cls, t):
        "Construct a UTC datetime from a POSIX timestamp (like time.time())."
        return cls._from_timestamp(_time.gmtime, t, None)

    @classmethod
    def _from_timestamp(cls, converter, timestamp, tzinfo):
        t_full = timestamp
        timestamp = int(_math.floor(timestamp))
        frac = t_full - timestamp
        us = _round(frac * 1e6)

        # If timestamp is less than one microsecond smaller than a
        # full second, us can be rounded up to 1000000.  In this case,
        # roll over to seconds, otherwise, ValueError is raised
        # by the constructor.
        if us == 1000000:
            timestamp += 1
            us = 0
        y, m, d, hh, mm, ss, weekday, jday, dst = converter(timestamp)
        ss = min(ss, 59)    # clamp out leap seconds if the platform has them
        return cls(y, m, d, hh, mm, ss, us, tzinfo)

    @classmethod
    def now(cls, tz=None):
        "Construct a datetime from time.time() and optional time zone info."
        t = _time.time()
        return cls.fromtimestamp(t, tz)

    @classmethod
    def utcnow(cls):
        "Construct a UTC datetime from time.time()."
        t = _time.time()
        return cls.utcfromtimestamp(t)

    @classmethod
    def combine(cls, date, time):
        "Construct a datetime from a given date and a given time."
        if not isinstance(date, _date_class):
            raise TypeError("date argument must be a date instance")
        if not isinstance(time, _time_class):
            raise TypeError("time argument must be a time instance")
        return cls(date.year, date.month, date.day,
                   time.hour, time.minute, time.second, time.microsecond,
                   time.tzinfo)

    def timetuple(self):
        "Return local time tuple compatible with time.localtime()."
        dst = self._dst()
        if dst is None:
            dst = -1
        elif dst:
            dst = 1
        return _build_struct_time(self.year, self.month, self.day,
                                  self.hour, self.minute, self.second,
                                  dst)

    def utctimetuple(self):
        "Return UTC time tuple compatible with time.gmtime()."
        y, m, d = self.year, self.month, self.day
        hh, mm, ss = self.hour, self.minute, self.second
        offset = self._utcoffset()
        if offset:  # neither None nor 0
            mm -= offset
            y, m, d, hh, mm, ss, _ = _normalize_datetime(
                y, m, d, hh, mm, ss, 0, ignore_overflow=True)
        return _build_struct_time(y, m, d, hh, mm, ss, 0)

    def date(self):
        "Return the date part."
        return date(self._year, self._month, self._day)

    def time(self):
        "Return the time part, with tzinfo None."
        return time(self.hour, self.minute, self.second, self.microsecond)

    def timetz(self):
        "Return the time part, with same tzinfo."
        return time(self.hour, self.minute, self.second, self.microsecond,
                    self._tzinfo)

    def replace(self, year=None, month=None, day=None, hour=None,
                minute=None, second=None, microsecond=None, tzinfo=True):
        """Return a new datetime with new values for the specified fields."""
        if year is None:
            year = self.year
        if month is None:
            month = self.month
        if day is None:
            day = self.day
        if hour is None:
            hour = self.hour
        if minute is None:
            minute = self.minute
        if second is None:
            second = self.second
        if microsecond is None:
            microsecond = self.microsecond
        if tzinfo is True:
            tzinfo = self.tzinfo
        return datetime(year, month, day, hour, minute, second, microsecond,
                        tzinfo)

    def astimezone(self, tz):
        if not isinstance(tz, tzinfo):
            raise TypeError("tz argument must be an instance of tzinfo")

        mytz = self.tzinfo
        if mytz is None:
            raise ValueError("astimezone() requires an aware datetime")

        if tz is mytz:
            return self

        # Convert self to UTC, and attach the new time zone object.
        myoffset = self.utcoffset()
        if myoffset is None:
            raise ValueError("astimezone() requires an aware datetime")
        utc = (self - myoffset).replace(tzinfo=tz)

        # Convert from UTC to tz's local time.
        return tz.fromutc(utc)

    # Ways to produce a string.

    def ctime(self):
        "Return ctime() style string."
        weekday = self.toordinal() % 7 or 7
        return "%s %s %2d %02d:%02d:%02d %04d" % (
            _DAYNAMES[weekday],
            _MONTHNAMES[self._month],
            self._day,
            self._hour, self._minute, self._second,
            self._year)

    def isoformat(self, sep='T'):
        """Return the time formatted according to ISO.

        This is 'YYYY-MM-DD HH:MM:SS.mmmmmm', or 'YYYY-MM-DD HH:MM:SS' if
        self.microsecond == 0.

        If self.tzinfo is not None, the UTC offset is also attached, giving
        'YYYY-MM-DD HH:MM:SS.mmmmmm+HH:MM' or 'YYYY-MM-DD HH:MM:SS+HH:MM'.

        Optional argument sep specifies the separator between date and
        time, default 'T'.
        """
        s = ("%04d-%02d-%02d%c" % (self._year, self._month, self._day, sep) +
             _format_time(self._hour, self._minute, self._second,
                          self._microsecond))
        off = self._utcoffset()
        if off is not None:
            if off < 0:
                sign = "-"
                off = -off
            else:
                sign = "+"
            hh, mm = divmod(off, 60)
            s += "%s%02d:%02d" % (sign, hh, mm)
        return s

    def __repr__(self):
        """Convert to formal string, for repr()."""
        L = [self._year, self._month, self._day,  # These are never zero
             self._hour, self._minute, self._second, self._microsecond]
        if L[-1] == 0:
            del L[-1]
        if L[-1] == 0:
            del L[-1]
        s = ", ".join(map(str, L))
        module = "datetime." if self.__class__ is datetime else ""
        s = "%s(%s)" % (module + self.__class__.__name__, s)
        if self._tzinfo is not None:
            assert s[-1:] == ")"
            s = s[:-1] + ", tzinfo=%r" % self._tzinfo + ")"
        return s

    def __str__(self):
        "Convert to string, for str()."
        return self.isoformat(sep=' ')

    @classmethod
    def strptime(cls, date_string, format):
        'string, format -> new datetime parsed from a string (like time.strptime()).'
        from _strptime import _strptime
        # _strptime._strptime returns a two-element tuple.  The first
        # element is a time.struct_time object.  The second is the
        # microseconds (which are not defined for time.struct_time).
        struct, micros = _strptime(date_string, format)
        return cls(*(struct[0:6] + (micros,)))

    def utcoffset(self):
        """Return the timezone offset in minutes east of UTC (negative west of
        UTC)."""
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.utcoffset(self)
        offset = _check_utc_offset("utcoffset", offset)
        if offset is not None:
            offset = timedelta._create(0, offset * 60, 0, True)
        return offset

    # Return an integer (or None) instead of a timedelta (or None).
    def _utcoffset(self):
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.utcoffset(self)
        offset = _check_utc_offset("utcoffset", offset)
        return offset

    def tzname(self):
        """Return the timezone name.

        Note that the name is 100% informational -- there's no requirement that
        it mean anything in particular. For example, "GMT", "UTC", "-500",
        "-5:00", "EDT", "US/Eastern", "America/New York" are all valid replies.
        """
        if self._tzinfo is None:
            return None
        name = self._tzinfo.tzname(self)
        _check_tzname(name)
        return name

    def dst(self):
        """Return 0 if DST is not in effect, or the DST offset (in minutes
        eastward) if DST is in effect.

        This is purely informational; the DST offset has already been added to
        the UTC offset returned by utcoffset() if applicable, so there's no
        need to consult dst() unless you're interested in displaying the DST
        info.
        """
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.dst(self)
        offset = _check_utc_offset("dst", offset)
        if offset is not None:
            offset = timedelta._create(0, offset * 60, 0, True)
        return offset

    # Return an integer (or None) instead of a timedelta (or None).
    def _dst(self):
        if self._tzinfo is None:
            return None
        offset = self._tzinfo.dst(self)
        offset = _check_utc_offset("dst", offset)
        return offset

    # Comparisons of datetime objects with other.

    def __eq__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) == 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            return False

    def __ne__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) != 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            return True

    def __le__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) <= 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __lt__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) < 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __ge__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) >= 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            _cmperror(self, other)

    def __gt__(self, other):
        if isinstance(other, datetime):
            return self._cmp(other) > 0
        elif hasattr(other, "timetuple") and not isinstance(other, date):
            return NotImplemented
        else:
            _cmperror(self, other)

    def _cmp(self, other):
        assert isinstance(other, datetime)
        mytz = self._tzinfo
        ottz = other._tzinfo
        myoff = otoff = None

        if mytz is ottz:
            base_compare = True
        else:
            if mytz is not None:
                myoff = self._utcoffset()
            if ottz is not None:
                otoff = other._utcoffset()
            base_compare = myoff == otoff

        if base_compare:
            return _cmp((self._year, self._month, self._day,
                         self._hour, self._minute, self._second,
                         self._microsecond),
                        (other._year, other._month, other._day,
                         other._hour, other._minute, other._second,
                         other._microsecond))
        if myoff is None or otoff is None:
            raise TypeError("can't compare offset-naive and offset-aware datetimes")
        # XXX What follows could be done more efficiently...
        diff = self - other     # this will take offsets into account
        if diff.days < 0:
            return -1
        return diff and 1 or 0

    def _add_timedelta(self, other, factor):
        y, m, d, hh, mm, ss, us = _normalize_datetime(
            self._year,
            self._month,
            self._day + other.days * factor,
            self._hour,
            self._minute,
            self._second + other.seconds * factor,
            self._microsecond + other.microseconds * factor)
        return datetime(y, m, d, hh, mm, ss, us, tzinfo=self._tzinfo)

    def __add__(self, other):
        "Add a datetime and a timedelta."
        if not isinstance(other, timedelta):
            return NotImplemented
        return self._add_timedelta(other, 1)

    __radd__ = __add__

    def __sub__(self, other):
        "Subtract two datetimes, or a datetime and a timedelta."
        if not isinstance(other, datetime):
            if isinstance(other, timedelta):
                return self._add_timedelta(other, -1)
            return NotImplemented

        delta_d = self.toordinal() - other.toordinal()
        delta_s = (self._hour - other._hour) * 3600 + \\
                  (self._minute - other._minute) * 60 + \\
                  (self._second - other._second)
        delta_us = self._microsecond - other._microsecond
        base = timedelta._create(delta_d, delta_s, delta_us, True)
        if self._tzinfo is other._tzinfo:
            return base
        myoff = self._utcoffset()
        otoff = other._utcoffset()
        if myoff == otoff:
            return base
        if myoff is None or otoff is None:
            raise TypeError("can't subtract offset-naive and offset-aware datetimes")
        return base + timedelta(minutes = otoff-myoff)

    def __hash__(self):
        if self._hashcode == -1:
            tzoff = self._utcoffset()
            if tzoff is None:
                self._hashcode = hash(self._getstate()[0])
            else:
                days = _ymd2ord(self.year, self.month, self.day)
                seconds = self.hour * 3600 + (self.minute - tzoff) * 60 + self.second
                self._hashcode = hash(timedelta(days, seconds, self.microsecond))
        return self._hashcode



datetime.min = datetime(1, 1, 1)
datetime.max = datetime(9999, 12, 31, 23, 59, 59, 999999)
datetime.resolution = timedelta(microseconds=1)


def _isoweek1monday(year):
    # Helper to calculate the day number of the Monday starting week 1
    # XXX This could be done more efficiently
    THURSDAY = 3
    firstday = _ymd2ord(year, 1, 1)
    firstweekday = (firstday + 6) % 7  # See weekday() above
    week1monday = firstday - firstweekday
    if firstweekday > THURSDAY:
        week1monday += 7
    return week1monday

"""
Some time zone algebra.  For a datetime x, let
    x.n = x stripped of its timezone -- its naive time.
    x.o = x.utcoffset(), and assuming that doesn't raise an exception or
          return None
    x.d = x.dst(), and assuming that doesn't raise an exception or
          return None
    x.s = x's standard offset, x.o - x.d

Now some derived rules, where k is a duration (timedelta).

1. x.o = x.s + x.d
   This follows from the definition of x.s.

2. If x and y have the same tzinfo member, x.s = y.s.
   This is actually a requirement, an assumption we need to make about
   sane tzinfo classes.

3. The naive UTC time corresponding to x is x.n - x.o.
   This is again a requirement for a sane tzinfo class.

4. (x+k).s = x.s
   This follows from #2, and that datimetimetz+timedelta preserves tzinfo.

5. (x+k).n = x.n + k
   Again follows from how arithmetic is defined.

Now we can explain tz.fromutc(x).  Let's assume it's an interesting case
(meaning that the various tzinfo methods exist, and don't blow up or return
None when called).

The function wants to return a datetime y with timezone tz, equivalent to x.
x is already in UTC.

By #3, we want

    y.n - y.o = x.n                             [1]

The algorithm starts by attaching tz to x.n, and calling that y.  So
x.n = y.n at the start.  Then it wants to add a duration k to y, so that [1]
becomes true; in effect, we want to solve [2] for k:

   (y+k).n - (y+k).o = x.n                      [2]

By #1, this is the same as

   (y+k).n - ((y+k).s + (y+k).d) = x.n          [3]

By #5, (y+k).n = y.n + k, which equals x.n + k because x.n=y.n at the start.
Substituting that into [3],

   x.n + k - (y+k).s - (y+k).d = x.n; the x.n terms cancel, leaving
   k - (y+k).s - (y+k).d = 0; rearranging,
   k = (y+k).s - (y+k).d; by #4, (y+k).s == y.s, so
   k = y.s - (y+k).d

On the RHS, (y+k).d can't be computed directly, but y.s can be, and we
approximate k by ignoring the (y+k).d term at first.  Note that k can't be
very large, since all offset-returning methods return a duration of magnitude
less than 24 hours.  For that reason, if y is firmly in std time, (y+k).d must
be 0, so ignoring it has no consequence then.

In any case, the new value is

    z = y + y.s                                 [4]

It's helpful to step back at look at [4] from a higher level:  it's simply
mapping from UTC to tz's standard time.

At this point, if

    z.n - z.o = x.n                             [5]

we have an equivalent time, and are almost done.  The insecurity here is
at the start of daylight time.  Picture US Eastern for concreteness.  The wall
time jumps from 1:59 to 3:00, and wall hours of the form 2:MM don't make good
sense then.  The docs ask that an Eastern tzinfo class consider such a time to
be EDT (because it's "after 2"), which is a redundant spelling of 1:MM EST
on the day DST starts.  We want to return the 1:MM EST spelling because that's
the only spelling that makes sense on the local wall clock.

In fact, if [5] holds at this point, we do have the standard-time spelling,
but that takes a bit of proof.  We first prove a stronger result.  What's the
difference between the LHS and RHS of [5]?  Let

    diff = x.n - (z.n - z.o)                    [6]

Now
    z.n =                       by [4]
    (y + y.s).n =               by #5
    y.n + y.s =                 since y.n = x.n
    x.n + y.s =                 since z and y are have the same tzinfo member,
                                    y.s = z.s by #2
    x.n + z.s

Plugging that back into [6] gives

    diff =
    x.n - ((x.n + z.s) - z.o) =     expanding
    x.n - x.n - z.s + z.o =         cancelling
    - z.s + z.o =                   by #2
    z.d

So diff = z.d.

If [5] is true now, diff = 0, so z.d = 0 too, and we have the standard-time
spelling we wanted in the endcase described above.  We're done.  Contrarily,
if z.d = 0, then we have a UTC equivalent, and are also done.

If [5] is not true now, diff = z.d != 0, and z.d is the offset we need to
add to z (in effect, z is in tz's standard time, and we need to shift the
local clock into tz's daylight time).

Let

    z' = z + z.d = z + diff                     [7]

and we can again ask whether

    z'.n - z'.o = x.n                           [8]

If so, we're done.  If not, the tzinfo class is insane, according to the
assumptions we've made.  This also requires a bit of proof.  As before, let's
compute the difference between the LHS and RHS of [8] (and skipping some of
the justifications for the kinds of substitutions we've done several times
already):

    diff' = x.n - (z'.n - z'.o) =           replacing z'.n via [7]
            x.n  - (z.n + diff - z'.o) =    replacing diff via [6]
            x.n - (z.n + x.n - (z.n - z.o) - z'.o) =
            x.n - z.n - x.n + z.n - z.o + z'.o =    cancel x.n
            - z.n + z.n - z.o + z'.o =              cancel z.n
            - z.o + z'.o =                      #1 twice
            -z.s - z.d + z'.s + z'.d =          z and z' have same tzinfo
            z'.d - z.d

So z' is UTC-equivalent to x iff z'.d = z.d at this point.  If they are equal,
we've found the UTC-equivalent so are done.  In fact, we stop with [7] and
return z', not bothering to compute z'.d.

How could z.d and z'd differ?  z' = z + z.d [7], so merely moving z' by
a dst() offset, and starting *from* a time already in DST (we know z.d != 0),
would have to change the result dst() returns:  we start in DST, and moving
a little further into it takes us out of DST.

There isn't a sane case where this can happen.  The closest it gets is at
the end of DST, where there's an hour in UTC with no spelling in a hybrid
tzinfo class.  In US Eastern, that's 5:MM UTC = 0:MM EST = 1:MM EDT.  During
that hour, on an Eastern clock 1:MM is taken as being in standard time (6:MM
UTC) because the docs insist on that, but 0:MM is taken as being in daylight
time (4:MM UTC).  There is no local time mapping to 5:MM UTC.  The local
clock jumps from 1:59 back to 1:00 again, and repeats the 1:MM hour in
standard time.  Since that's what the local clock *does*, we want to map both
UTC hours 5:MM and 6:MM to 1:MM Eastern.  The result is ambiguous
in local time, but so it goes -- it's the way the local clock works.

When x = 5:MM UTC is the input to this algorithm, x.o=0, y.o=-5 and y.d=0,
so z=0:MM.  z.d=60 (minutes) then, so [5] doesn't hold and we keep going.
z' = z + z.d = 1:MM then, and z'.d=0, and z'.d - z.d = -60 != 0 so [8]
(correctly) concludes that z' is not UTC-equivalent to x.

Because we know z.d said z was in daylight time (else [5] would have held and
we would have stopped then), and we know z.d != z'.d (else [8] would have held
and we have stopped then), and there are only 2 possible values dst() can
return in Eastern, it follows that z'.d must be 0 (which it is in the example,
but the reasoning doesn't depend on the example -- it depends on there being
two possible dst() outcomes, one zero and the other non-zero).  Therefore
z' must be in standard time, and is the spelling we want in this case.

Note again that z' is not UTC-equivalent as far as the hybrid tzinfo class is
concerned (because it takes z' as being in standard time rather than the
daylight time we intend here), but returning it gives the real-life "local
clock repeats an hour" behavior when mapping the "unspellable" UTC hour into
tz.

When the input is 6:MM, z=1:MM and z.d=0, and we stop at once, again with
the 1:MM standard time spelling we want.

So how can this break?  One of the assumptions must be violated.  Two
possibilities:

1) [2] effectively says that y.s is invariant across all y belong to a given
   time zone.  This isn't true if, for political reasons or continental drift,
   a region decides to change its base offset from UTC.

2) There may be versions of "double daylight" time where the tail end of
   the analysis gives up a step too early.  I haven't thought about that
   enough to say.

In any case, it's clear that the default fromutc() is strong enough to handle
"almost all" time zones:  so long as the standard offset is invariant, it
doesn't matter if daylight time transition points change from year to year, or
if daylight time is skipped in some years; it doesn't matter how large or
small dst() may get within its bounds; and it doesn't even matter if some
perverse time zone returns a negative dst()).  So a breaking case must be
pretty bizarre, and a tzinfo subclass can override fromutc() if it is.
"""
`,"src/lib/dbhash.py":`raise NotImplementedError("dbhash is not yet implemented in Skulpt")
`,"src/lib/decimal.py":`raise NotImplementedError("decimal is not yet implemented in Skulpt")
`,"src/lib/difflib.py":`raise NotImplementedError("difflib is not yet implemented in Skulpt")
`,"src/lib/dircache.py":`raise NotImplementedError("dircache is not yet implemented in Skulpt")
`,"src/lib/dis.py":`raise NotImplementedError("dis is not yet implemented in Skulpt")
`,"src/lib/distutils/__init__.py":`raise NotImplementedError("distutils is not yet implemented in Skulpt")
`,"src/lib/distutils/command/__init__.py":`raise NotImplementedError("command is not yet implemented in Skulpt")
`,"src/lib/distutils/tests/__init__.py":`raise NotImplementedError("tests is not yet implemented in Skulpt")
`,"src/lib/doctest.py":`raise NotImplementedError("doctest is not yet implemented in Skulpt")
`,"src/lib/document.js":'var $builtinmodule=function(){var a,b={__name__:new Sk.builtin.str("document")};return b.getElementById=new Sk.builtin.func(function(a){var c=document.getElementById(a.v);return c?Sk.misceval.callsimArray(b.Element,[c]):Sk.builtin.none.none$}),b.createElement=new Sk.builtin.func(function(a){var c=document.createElement(a.v);if(c)return Sk.misceval.callsimArray(b.Element,[c])}),b.getElementsByTagName=new Sk.builtin.func(function(a){for(var c=document.getElementsByTagName(a.v),d=[],e=c.length-1;0<=e;e--)d.push(Sk.misceval.callsimArray(b.Element,[c[e]]));return new Sk.builtin.list(d)}),b.getElementsByClassName=new Sk.builtin.func(function(a){for(var c=document.getElementsByClassName(a.v),d=[],e=0;e<c.length;e++)d.push(Sk.misceval.callsimArray(b.Element,[c[e]]));return new Sk.builtin.list(d)}),b.getElementsByName=new Sk.builtin.func(function(a){for(var c=document.getElementsByName(a.v),d=[],e=0;e<c.length;e++)d.push(Sk.misceval.callsimArray(b.Element,[c[e]]));return new Sk.builtin.list(d)}),b.currentDiv=new Sk.builtin.func(function(){if(void 0!==Sk.divid)return new Sk.builtin.str(Sk.divid);throw new Sk.builtin.AttributeError("There is no value set for divid")}),a=function(a,b){b.__init__=new Sk.builtin.func(function(a,b){a.v=b,a.innerHTML=b.innerHTML,a.innerText=b.innerText,void 0!==b.value&&(a.value=b.value,Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("value"),new Sk.builtin.str(a.value))),void 0!==b.checked&&(a.checked=b.checked,Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("checked"),new Sk.builtin.str(a.checked))),Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("innerHTML"),new Sk.builtin.str(a.innerHTML)),Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("innerText"),new Sk.builtin.str(a.innerText))}),b.tp$getattr=Sk.generic.getAttr,b.__setattr__=new Sk.builtin.func(function(a,b,c){b=Sk.ffi.remapToJs(b),"innerHTML"===b&&(a.innerHTML=c,a.v.innerHTML=c.v,Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("innerHTML"),c)),"innerText"===b&&(a.innerText=c,a.v.innerText=c.v,Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str("innerText"),c))}),b.appendChild=new Sk.builtin.func(function(a,b){a.v.appendChild(b.v)}),b.removeChild=new Sk.builtin.func(function(a,b){a.v.removeChild(b.v)}),b.getCSS=new Sk.builtin.func(function(a,b){return new Sk.builtin.str(a.v.style[b.v])}),b.setCSS=new Sk.builtin.func(function(a,b,c){a.v.style[b.v]=c.v}),b.getAttribute=new Sk.builtin.func(function(a,b){var c=a.v.getAttribute(b.v);return c?new Sk.builtin.str(c):Sk.builtin.none.none$}),b.setAttribute=new Sk.builtin.func(function(a,b,c){a.v.setAttribute(b.v,c.v)}),b.getProperty=new Sk.builtin.func(function(a,b){var c=a.v[b.v];return c?new Sk.builtin.str(c):Sk.builtin.none.none$}),b.__str__=new Sk.builtin.func(function(a){return console.log(a.v.tagName),new Sk.builtin.str(a.v.tagName)}),b.__repr__=new Sk.builtin.func(function(){return new Sk.builtin.str("[DOM Element]")})},b.Element=Sk.misceval.buildClass(b,a,"Element",[]),b};',"src/lib/dumbdbm.py":`raise NotImplementedError("dumbdbm is not yet implemented in Skulpt")
`,"src/lib/dummy_thread.py":`raise NotImplementedError("dummy_thread is not yet implemented in Skulpt")
`,"src/lib/dummy_threading.py":`raise NotImplementedError("dummy_threading is not yet implemented in Skulpt")
`,"src/lib/email/__init__.py":`raise NotImplementedError("email is not yet implemented in Skulpt")
`,"src/lib/email/mime/__init__.py":`raise NotImplementedError("mime is not yet implemented in Skulpt")
`,"src/lib/email/test/data/__init__.py":`raise NotImplementedError("data is not yet implemented in Skulpt")
`,"src/lib/encodings/__init__.py":`raise NotImplementedError("encodings is not yet implemented in Skulpt")
`,"src/lib/filecmp.py":`raise NotImplementedError("filecmp is not yet implemented in Skulpt")
`,"src/lib/fileinput.py":`raise NotImplementedError("fileinput is not yet implemented in Skulpt")
`,"src/lib/fnmatch.py":`raise NotImplementedError("fnmatch is not yet implemented in Skulpt")
`,"src/lib/formatter.py":`raise NotImplementedError("formatter is not yet implemented in Skulpt")
`,"src/lib/fpformat.py":`raise NotImplementedError("fpformat is not yet implemented in Skulpt")
`,"src/lib/fractions.py":`raise NotImplementedError("fractions is not yet implemented in Skulpt")
`,"src/lib/ftplib.py":`raise NotImplementedError("ftplib is not yet implemented in Skulpt")
`,"src/lib/functools.py":`raise NotImplementedError("functools is not yet implemented in Skulpt")
`,"src/lib/genericpath.py":`raise NotImplementedError("genericpath is not yet implemented in Skulpt")
`,"src/lib/getopt.py":`raise NotImplementedError("getopt is not yet implemented in Skulpt")
`,"src/lib/getpass.py":`raise NotImplementedError("getpass is not yet implemented in Skulpt")
`,"src/lib/gettext.py":`raise NotImplementedError("gettext is not yet implemented in Skulpt")
`,"src/lib/glob.py":`raise NotImplementedError("glob is not yet implemented in Skulpt")
`,"src/lib/gzip.py":`raise NotImplementedError("gzip is not yet implemented in Skulpt")
`,"src/lib/hashlib.py":`raise NotImplementedError("hashlib is not yet implemented in Skulpt")
`,"src/lib/heapq.py":`raise NotImplementedError("heapq is not yet implemented in Skulpt")
`,"src/lib/hmac.py":`raise NotImplementedError("hmac is not yet implemented in Skulpt")
`,"src/lib/hotshot/__init__.py":`raise NotImplementedError("hotshot is not yet implemented in Skulpt")
`,"src/lib/htmlentitydefs.py":`raise NotImplementedError("htmlentitydefs is not yet implemented in Skulpt")
`,"src/lib/htmllib.py":`raise NotImplementedError("htmllib is not yet implemented in Skulpt")
`,"src/lib/httplib.py":`raise NotImplementedError("httplib is not yet implemented in Skulpt")
`,"src/lib/idlelib/Icons/__init__.py":`raise NotImplementedError("Icons is not yet implemented in Skulpt")
`,"src/lib/idlelib/__init__.py":`raise NotImplementedError("idlelib is not yet implemented in Skulpt")
`,"src/lib/ihooks.py":`raise NotImplementedError("ihooks is not yet implemented in Skulpt")
`,"src/lib/image.js":'var ImageMod,$builtinmodule;ImageMod||(ImageMod={},ImageMod.canvasLib=[]),$builtinmodule=function(){var a,b,c,d,e,f,g,h={__name__:new Sk.builtin.str("image")};return h.Image=Sk.misceval.buildClass(h,function(a,b){var c=Math.floor;e=function(a){a.width=a.image.width,a.height=a.image.height,a.delay=0,a.updateCount=0,a.updateInterval=1,a.lastx=0,a.lasty=0,a.canvas=document.createElement("canvas"),a.canvas.height=a.height,a.canvas.width=a.width,a.ctx=a.canvas.getContext("2d"),a.ctx.drawImage(a.image,0,0),a.imagedata=a.ctx.getImageData(0,0,a.width,a.height)},b.__init__=new Sk.builtin.func(function(a,b){var c;Sk.builtin.pyCheckArgsLen("__init__",arguments.length,2,2);try{a.image=document.getElementById(Sk.ffi.remapToJs(b)),e(a)}catch(b){a.image=null}if(null==a.image)return c=new Sk.misceval.Suspension,c.resume=function(){if(c.data.error)throw new Sk.builtin.IOError(c.data.error.message)},c.data={type:"Sk.promise",promise:new Promise(function(c,d){var f=new Image;f.crossOrigin="",f.onerror=function(){d(Error("Failed to load URL: "+f.src))},f.onload=function(){a.image=this,e(a),c()},f.src=g(b)})},c}),g=function(a){var b,c,d="function"==typeof Sk.imageProxy?Sk.imageProxy:function(a){return b=document.createElement("a"),b.href=c,window.location.host===b.host?a:Sk.imageProxy+"/"+a};return c=Sk.ffi.remapToJs(a),c=d(c),c},f=function(a,b,c){if(0>b||0>c||b>=a.width||c>=a.height)throw new Sk.builtin.ValueError("Pixel index out of range.")};var i=function(a,b,c){var d;Sk.builtin.pyCheckArgsLen("setdelay",arguments.length,2,3),a.delay=Sk.ffi.remapToJs(b),d=Sk.builtin.asnum$(c),a.updateInterval=d?d:1};b.set_delay=new Sk.builtin.func(i),b.setDelay=new Sk.builtin.func(i);var j=function(a){var b,d=[];for(Sk.builtin.pyCheckArgsLen("getpixels",arguments.length,1,1),b=0;b<a.image.height*a.image.width;b++)d[b]=Sk.misceval.callsimArray(a.getPixel,[a,b%a.image.width,c(b/a.image.width)]);return new Sk.builtin.tuple(d)};b.get_pixels=new Sk.builtin.func(j),b.getPixels=new Sk.builtin.func(j),b.getData=new Sk.builtin.func(function(a){var b,d,e,g,h,j,k,l=[];for(Sk.builtin.pyCheckArgsLen("getData",arguments.length,1,1),b=0;b<a.image.height*a.image.width;b++)d=b%a.image.width,e=c(b/a.image.width),f(a,d,e),k=4*e*a.width+4*d,g=a.imagedata.data[k],h=a.imagedata.data[k+1],j=a.imagedata.data[k+2],l[b]=new Sk.builtin.tuple([new Sk.builtin.int_(g),new Sk.builtin.int_(h),new Sk.builtin.int_(j)]);return new Sk.builtin.list(l)});var k=function(a,b,c){var d,e,g,i;return Sk.builtin.pyCheckArgsLen("getpixel",arguments.length,3,3),b=Sk.builtin.asnum$(b),c=Sk.builtin.asnum$(c),f(a,b,c),i=4*c*a.width+4*b,d=a.imagedata.data[i],g=a.imagedata.data[i+1],e=a.imagedata.data[i+2],Sk.misceval.callsimArray(h.Pixel,[d,g,e,b,c])};b.get_pixel=new Sk.builtin.func(k),b.getPixel=new Sk.builtin.func(k),d=function(a,b,c){var d=new Sk.misceval.Suspension;return d.resume=function(){return Sk.builtin.none.none$},d.data={type:"Sk.promise",promise:new Promise(function(d){var e=Math.max,f=Math.abs,g=Math.min;a.updateCount++,0==a.updateCount%a.updateInterval?(a.lastx+a.updateInterval>=a.width?a.lastCtx.putImageData(a.imagedata,a.lastUlx,a.lastUly,0,a.lasty,a.width,2):a.lasty+a.updateInterval>=a.height?a.lastCtx.putImageData(a.imagedata,a.lastUlx,a.lastUly,a.lastx,0,2,a.height):a.lastCtx.putImageData(a.imagedata,a.lastUlx,a.lastUly,g(b,a.lastx),g(c,a.lasty),e(f(b-a.lastx),1),e(f(c-a.lasty),1)),a.lastx=b,a.lasty=c,0<a.delay?window.setTimeout(d,a.delay):d()):d()})},d};var l=function(a,b,c,e){var g;return Sk.builtin.pyCheckArgsLen("setpixel",arguments.length,4,4),b=Sk.builtin.asnum$(b),c=Sk.builtin.asnum$(c),f(a,b,c),g=4*c*a.width+4*b,a.imagedata.data[g]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getRed,[e])),a.imagedata.data[g+1]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getGreen,[e])),a.imagedata.data[g+2]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getBlue,[e])),a.imagedata.data[g+3]=255,d(a,b,c)};b.set_pixel=new Sk.builtin.func(l),b.setPixel=new Sk.builtin.func(l);var m=function(a,b,e){var g,h,i;return Sk.builtin.pyCheckArgsLen("setpixelat",arguments.length,3,3),b=Sk.builtin.asnum$(b),g=b%a.image.width,h=c(b/a.image.width),f(a,g,h),i=4*h*a.width+4*g,a.imagedata.data[i]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getRed,[e])),a.imagedata.data[i+1]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getGreen,[e])),a.imagedata.data[i+2]=Sk.builtin.asnum$(Sk.misceval.callsimArray(e.getBlue,[e])),a.imagedata.data[i+3]=255,d(a,g,h)};b.set_pixel_at=new Sk.builtin.func(m),b.setPixelAt=new Sk.builtin.func(m);var n=function(a,b){var c,e,g;return Sk.builtin.pyCheckArgsLen("updatepixel",arguments.length,2,2),c=Sk.builtin.asnum$(Sk.misceval.callsimArray(b.getX,[b])),e=Sk.builtin.asnum$(Sk.misceval.callsimArray(b.getY,[b])),f(a,c,e),g=4*e*a.width+4*c,a.imagedata.data[g]=Sk.builtin.asnum$(Sk.misceval.callsimArray(b.getRed,[b])),a.imagedata.data[g+1]=Sk.builtin.asnum$(Sk.misceval.callsimArray(b.getGreen,[b])),a.imagedata.data[g+2]=Sk.builtin.asnum$(Sk.misceval.callsimArray(b.getBlue,[b])),a.imagedata.data[g+3]=255,d(a,c,e)};b.update_pixel=new Sk.builtin.func(n),b.updatePixel=new Sk.builtin.func(n);var o=function(a){return Sk.builtin.pyCheckArgsLen("getheight",arguments.length,1,1),new Sk.builtin.int_(a.height)};b.get_height=new Sk.builtin.func(o),b.getHeight=new Sk.builtin.func(o);var p=function(a){return Sk.builtin.pyCheckArgsLen("getwidth",arguments.length,1,1),new Sk.builtin.int_(a.width)};b.get_width=new Sk.builtin.func(p),b.getWidth=new Sk.builtin.func(p),b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"height"===b)?Sk.builtin.assk$(a.height):"width"===b?Sk.builtin.assk$(a.width):void 0}),b.__setattr__=new Sk.builtin.func(function(a,b){if(b=Sk.ffi.remapToJs(b),"height"===b||"width"===b)throw new Sk.builtin.Exception("Cannot change height or width they can only be set on creation");else throw new Sk.builtin.Exception("Unknown attribute: "+b)}),b.draw=new Sk.builtin.func(function(a,b,c,d){var e;return Sk.builtin.pyCheckArgsLen("draw",arguments.length,2,4),e=new Sk.misceval.Suspension,e.resume=function(){return Sk.builtin.none.none$},e.data={type:"Sk.promise",promise:new Promise(function(e){var f,g;b=Sk.builtin.asnum$(b),c=Sk.builtin.asnum$(c),d=Sk.builtin.asnum$(d),f=Sk.misceval.callsimArray(b.getWin,[b]),g=f.getContext("2d"),void 0===c&&(c=0,d=0),a.lastUlx=c,a.lastUly=d,a.lastCtx=g,g.putImageData(a.imagedata,c,d),0<a.delay?window.setTimeout(e,a.delay):window.setTimeout(e,200)})},e})},"Image",[]),c=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c){Sk.builtin.pyCheckArgsLen("__init__",arguments.length,3,3),a.width=Sk.builtin.asnum$(b),a.height=Sk.builtin.asnum$(c),a.canvas=document.createElement("canvas"),a.ctx=a.canvas.getContext("2d"),a.canvas.height=a.height,a.canvas.width=a.width,a.imagedata=a.ctx.getImageData(0,0,a.width,a.height)})},h.EmptyImage=Sk.misceval.buildClass(h,c,"EmptyImage",[h.Image]),b=function(a,b){b.__init__=new Sk.builtin.func(function(a,c,d,e,b,f){Sk.builtin.pyCheckArgsLen("__init__",arguments.length,4,6),a.red=Sk.builtin.asnum$(c),a.green=Sk.builtin.asnum$(d),a.blue=Sk.builtin.asnum$(e),a.x=Sk.builtin.asnum$(b),a.y=Sk.builtin.asnum$(f)});var c=function(a){return Sk.builtin.pyCheckArgsLen("getred",arguments.length,1,1),Sk.builtin.assk$(a.red)};b.get_red=new Sk.builtin.func(c),b.getRed=new Sk.builtin.func(c);var d=function(a){return Sk.builtin.pyCheckArgsLen("getgreen",arguments.length,1,1),Sk.builtin.assk$(a.green)};b.get_green=new Sk.builtin.func(d),b.getGreen=new Sk.builtin.func(d);var e=function(a){return Sk.builtin.pyCheckArgsLen("getblue",arguments.length,1,1),Sk.builtin.assk$(a.blue)};b.get_blue=new Sk.builtin.func(e),b.getBlue=new Sk.builtin.func(e);var f=function(a){return Sk.builtin.pyCheckArgsLen("getx",arguments.length,1,1),Sk.builtin.assk$(a.x)};b.get_x=new Sk.builtin.func(f),b.getX=new Sk.builtin.func(f);var g=function(a){return Sk.builtin.pyCheckArgsLen("gety",arguments.length,1,1),Sk.builtin.assk$(a.y)};b.get_y=new Sk.builtin.func(g),b.getY=new Sk.builtin.func(g);var h=function(a,b){Sk.builtin.pyCheckArgsLen("setred",arguments.length,2,2),a.red=Sk.builtin.asnum$(b)};b.set_red=new Sk.builtin.func(h),b.setRed=new Sk.builtin.func(h);var i=function(a,b){Sk.builtin.pyCheckArgsLen("setgreen",arguments.length,2,2),a.green=Sk.builtin.asnum$(b)};b.set_green=new Sk.builtin.func(i),b.setGreen=new Sk.builtin.func(i);var j=function(a,c){Sk.builtin.pyCheckArgsLen("setblue",arguments.length,2,2),a.blue=Sk.builtin.asnum$(c)};b.set_blue=new Sk.builtin.func(j),b.setBlue=new Sk.builtin.func(j),b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"red"===b)?Sk.builtin.assk$(a.red):"green"===b?Sk.builtin.assk$(a.green):"blue"===b?Sk.builtin.assk$(a.blue):void 0}),b.__setattr__=new Sk.builtin.func(function(a,b,c){b=Sk.ffi.remapToJs(b),("red"===b||"green"===b||"blue"===b)&&(a[b]=Sk.builtin.asnum$(c))});var k=function(a,b){Sk.builtin.pyCheckArgsLen("setx",arguments.length,2,2),a.x=Sk.builtin.asnum$(b)};b.set_x=new Sk.builtin.func(k),b.setX=new Sk.builtin.func(k);var l=function(a,b){Sk.builtin.pyCheckArgsLen("sety",arguments.length,2,2),a.y=Sk.builtin.asnum$(b)};b.set_y=new Sk.builtin.func(l),b.setY=new Sk.builtin.func(l),b.__getitem__=new Sk.builtin.func(function(a,b){return(b=Sk.builtin.asnum$(b),0===b)?a.red:1==b?a.green:2==b?a.blue:void 0}),b.__str__=new Sk.builtin.func(function(a){return Sk.ffi.remapToPy("["+a.red+","+a.green+","+a.blue+"]")}),b.getColorTuple=new Sk.builtin.func(function(){}),b.setRange=new Sk.builtin.func(function(a,b){a.max=Sk.builtin.asnum$(b)})},h.Pixel=Sk.misceval.buildClass(h,b,"Pixel",[]),a=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c){var d,e,f;Sk.builtin.pyCheckArgsLen("__init__",arguments.length,1,3),d=ImageMod.canvasLib[Sk.canvas],void 0===d?(e=document.createElement("canvas"),f=document.getElementById(Sk.canvas),a.theScreen=e,f.appendChild(e),ImageMod.canvasLib[Sk.canvas]=e,ImageMod.canvasLib[Sk.canvas]=a.theScreen):(a.theScreen=d,a.theScreen.height=a.theScreen.height),void 0===b?(Sk.availableHeight&&(a.theScreen.height=Sk.availableHeight),Sk.availableWidth&&(a.theScreen.width=Sk.availableWidth)):(a.theScreen.height=c.v,a.theScreen.width=b.v),a.theScreen.style.display="block"}),b.getWin=new Sk.builtin.func(function(a){return a.theScreen}),b.exitonclick=new Sk.builtin.func(function(a){var b=a.theScreen.id;a.theScreen.onclick=function(){document.getElementById(b).style.display="none",document.getElementById(b).onclick=null,delete ImageMod.canvasLib[b]}})},h.ImageWin=Sk.misceval.buildClass(h,a,"ImageWin",[]),h};',"src/lib/imaplib.py":`raise NotImplementedError("imaplib is not yet implemented in Skulpt")
`,"src/lib/imghdr.py":`raise NotImplementedError("imghdr is not yet implemented in Skulpt")
`,"src/lib/imputil.py":`raise NotImplementedError("imputil is not yet implemented in Skulpt")
`,"src/lib/io.py":`raise NotImplementedError("io is not yet implemented in Skulpt")
`,"src/lib/itertools.js":`var $builtinmodule=function(){function combinationsNew(a,b,c){let d,e;[d,e]=Sk.abstr.copyKeywordsToNamedArgs(a.tp$name,["iterable","r"],b,c,[]);const f=Sk.misceval.arrayFromIterable(d);if(e=Sk.misceval.asIndexSized(e,Sk.builtin.OverFlowError),0>e)throw new Sk.builtin.ValueError("r must be non-negative");if(this===a)return new a.constructor(f,e);else{const b=new this.constructor;return a.constructor.call(b,f,e),b}}var a={};return a.accumulate=Sk.abstr.buildIteratorClass("itertools.accumulate",{constructor:function accumulate(a,b,c){this.iter=a,this.func=b,this.total=c,this.tp$iternext=()=>(this.total=Sk.builtin.checkNone(this.total)?this.iter.tp$iternext():this.total,this.tp$iternext=this.constructor.prototype.tp$iternext,this.total)},iternext(){let a=this.iter.tp$iternext();if(void 0!==a)return this.total=Sk.misceval.callsimArray(this.func,[this.total,a]),this.total},slots:{tp$doc:"accumulate(iterable[, func, initial]) --> accumulate object\\n\\nReturn series of accumulated sums (or other binary function results).",tp$new(b,c){Sk.abstr.checkArgsLen("accumulate",b,0,2);let[d,e,f]=Sk.abstr.copyKeywordsToNamedArgs("accumulate",["iterable","func","initial"],b,c,[Sk.builtin.none.none$,Sk.builtin.none.none$]);if(d=Sk.abstr.iter(d),e=Sk.builtin.checkNone(e)?new Sk.builtin.func((c,a)=>Sk.abstr.numberBinOp(c,a,"Add")):e,this===a.accumulate.prototype)return new a.accumulate(d,e,f);else{const b=new this.constructor;return a.accumulate.call(b,d,e,f),b}}}}),a.chain=Sk.abstr.buildIteratorClass("itertools.chain",{constructor:function chain(a){this.iterables=a,this.current_it=null,this.tp$iternext=()=>(this.tp$iternext=this.constructor.prototype.tp$iternext,this.current_it=this.iterables.tp$iternext(),void 0===this.current_it)?void(this.tp$iternext=()=>void 0):(this.current_it=Sk.abstr.iter(this.current_it),this.tp$iternext())},iternext(){for(let a;void 0===a;)if(a=this.current_it.tp$iternext(),void 0===a){if(this.current_it=this.iterables.tp$iternext(),void 0===this.current_it)return void(this.tp$iternext=()=>void 0);this.current_it=Sk.abstr.iter(this.current_it)}else return a},slots:{tp$doc:"chain(*iterables) --> chain object\\n\\nReturn a chain object whose .__next__() method returns elements from the\\nfirst iterable until it is exhausted, then elements from the next\\niterable, until all of the iterables are exhausted.",tp$new(b,c){if(Sk.abstr.checkNoKwargs("chain",c),b=new Sk.builtin.tuple(b.slice(0)).tp$iter(),this===a.chain.prototype)return new a.chain(b);else{const c=new this.constructor;return a.chain.call(c,b),c}}},classmethods:{from_iterable:{$meth(b){const c=Sk.abstr.iter(b);return new a.chain(c)},$flags:{OneArg:!0},$doc:"chain.from_iterable(iterable) --> chain object\\n\\nAlternate chain() constructor taking a single iterable argument\\nthat evaluates lazily.",$textsig:null}}}),a.combinations=Sk.abstr.buildIteratorClass("itertools.combinations",{constructor:function combinations(a,b){this.pool=a,this.r=b,this.indices=Array(b).fill().map((a,b)=>b),this.n=a.length,this.tp$iternext=()=>{if(!(this.r>this.n))return this.tp$iternext=this.constructor.prototype.tp$iternext,new Sk.builtin.tuple(this.pool.slice(0,this.r))}},iternext(){let a,b=!1;for(a=this.r-1;0<=a;a--)if(this.indices[a]!=a+this.n-this.r){b=!0;break}if(!b)return void(this.r=0);this.indices[a]++;for(let b=a+1;b<this.r;b++)this.indices[b]=this.indices[b-1]+1;const c=this.indices.map(a=>this.pool[a]);return new Sk.builtin.tuple(c)},slots:{tp$doc:"combinations(iterable, r) --> combinations object\\n\\nReturn successive r-length combinations of elements in the iterable.\\n\\ncombinations(range(4), 3) --> (0,1,2), (0,1,3), (0,2,3), (1,2,3)",tp$new(b,c){return combinationsNew.call(this,a.combinations.prototype,b,c)}}}),a.combinations_with_replacement=Sk.abstr.buildIteratorClass("itertools.combinations_with_replacement",{constructor:function combinations_with_replacement(a,b){this.pool=a,this.r=b,this.indices=Array(b).fill(0),this.n=a.length,this.tp$iternext=()=>{if(!this.r||this.n){this.tp$iternext=this.constructor.prototype.tp$iternext;const a=this.indices.map(a=>this.pool[a]);return new Sk.builtin.tuple(a)}}},iternext(){let a,b=!1;for(a=this.r-1;0<=a;a--)if(this.indices[a]!=this.n-1){b=!0;break}if(!b)return void(this.r=0);const c=this.indices[a]+1;for(let b=a;b<this.r;b++)this.indices[b]=c;const d=this.indices.map(a=>this.pool[a]);return new Sk.builtin.tuple(d)},slots:{tp$doc:"combinations_with_replacement(iterable, r) --> combinations_with_replacement object\\n\\nReturn successive r-length combinations of elements in the iterable\\nallowing individual elements to have successive repeats.\\ncombinations_with_replacement('ABC', 2) --> AA AB AC BB BC CC",tp$new(b,c){return combinationsNew.call(this,a.combinations_with_replacement.prototype,b,c)}}}),a.compress=Sk.abstr.buildIteratorClass("itertools.compress",{constructor:function compress(a,b){this.data=a,this.selectors=b},iternext(){let a=this.data.tp$iternext(),b=this.selectors.tp$iternext();for(;void 0!==a&&void 0!==b;){if(Sk.misceval.isTrue(b))return a;a=this.data.tp$iternext(),b=this.selectors.tp$iternext()}},slots:{tp$doc:"compress(data, selectors) --> iterator over selected data\\n\\nReturn data elements corresponding to true selector elements.\\nForms a shorter iterator from selected data elements using the\\nselectors to choose the data elements.",tp$new(b,c){let d,e;if([d,e]=Sk.abstr.copyKeywordsToNamedArgs("compress",["data","selectors"],b,c,[]),d=Sk.abstr.iter(d),e=Sk.abstr.iter(e),this===a.count.prototype)return new a.compress(d,e);else{const b=new this.constructor;return a.compress.call(b,d,e),b}}}}),a.count=Sk.abstr.buildIteratorClass("itertools.count",{constructor:function count(a,b){this.start=a,this.step=b},iternext(){const a=this.start;return this.start=Sk.abstr.numberBinOp(this.start,this.step,"Add"),a},slots:{tp$doc:"count(start=0, step=1) --> count object\\n\\nReturn a count object whose .__next__() method returns consecutive values.\\nEquivalent to:\\n\\n    def count(firstval=0, step=1):\\n        x = firstval\\n        while 1:\\n            yield x\\n            x += step\\n",tp$new(b,c){const[d,e]=Sk.abstr.copyKeywordsToNamedArgs("count",["start","step"],b,c,[new Sk.builtin.int_(0),new Sk.builtin.int_(1)]);if(!Sk.builtin.checkNumber(d)&&!Sk.builtin.checkComplex(d))throw new Sk.builtin.TypeError("a number is required");if(!Sk.builtin.checkNumber(e)&&!Sk.builtin.checkComplex(e))throw new Sk.builtin.TypeError("a number is required");if(this===a.count.prototype)return new a.count(d,e);else{const b=new this.constructor;return a.count.call(b,d,e),b}},$r(){const a=Sk.misceval.objectRepr(this.start);let b=Sk.misceval.objectRepr(this.step);return b="1"===b?"":", "+b,new Sk.builtin.str(Sk.abstr.typeName(this)+"("+a+b+")")}}}),a.cycle=Sk.abstr.buildIteratorClass("itertools.cycle",{constructor:function cycle(a){this.iter=a,this.saved=[],this.consumed=!1,this.i=0,this.length},iternext(){let a;if(!this.consumed){if(a=this.iter.tp$iternext(),void 0!==a)return this.saved.push(a),a;if(this.consumed=!0,this.length=this.saved.length,!this.length)return}return a=this.saved[this.i],this.i=(this.i+1)%this.length,a},slots:{tp$doc:"cycle(iterable) --> cycle object\\n\\nReturn elements from the iterable until it is exhausted.\\nThen repeat the sequence indefinitely.",tp$new(b,c){Sk.abstr.checkOneArg("cycle",b,c);const d=Sk.abstr.iter(b[0]);if(this===a.cycle.prototype)return new a.cycle(d);else{const b=new this.constructor;return a.cycle.call(b,d),b}}}}),a.dropwhile=Sk.abstr.buildIteratorClass("itertools.dropwhile",{constructor:function dropwhile(a,b){this.predicate=a,this.iter=b,this.passed},iternext(){let a=this.iter.tp$iternext();for(;void 0===this.passed&&void 0!==a;){const b=Sk.misceval.callsimArray(this.predicate,[a]);if(!Sk.misceval.isTrue(b))return this.passed=!0,a;a=this.iter.tp$iternext()}return a},slots:{tp$doc:"dropwhile(predicate, iterable) --> dropwhile object\\n\\nDrop items from the iterable while predicate(item) is true.\\nAfterwards, return every element until the iterable is exhausted.",tp$new(b,c){Sk.abstr.checkNoKwargs("dropwhile",c),Sk.abstr.checkArgsLen("dropwhile",b,2,2);const d=b[0],e=Sk.abstr.iter(b[1]);if(this===a.dropwhile.prototype)return new a.dropwhile(d,e);else{const b=new this.constructor;return a.dropwhile.call(b,d,e),b}}}}),a.filterfalse=Sk.abstr.buildIteratorClass("itertools.filterfalse",{constructor:function filterfalse(a,b){this.predicate=a,this.iter=b},iternext(){let a=this.iter.tp$iternext();if(void 0!==a){for(let b=Sk.misceval.callsimArray(this.predicate,[a]);Sk.misceval.isTrue(b);){if(a=this.iter.tp$iternext(),void 0===a)return;b=Sk.misceval.callsimArray(this.predicate,[a])}return a}},slots:{tp$doc:"filterfalse(function or None, sequence) --> filterfalse object\\n\\nReturn those items of sequence for which function(item) is false.\\nIf function is None, return the items that are false.",tp$new(b,c){Sk.abstr.checkNoKwargs("filterfalse",c),Sk.abstr.checkArgsLen("filterfalse",b,2,2);const d=Sk.builtin.checkNone(b[0])?Sk.builtin.bool:b[0],e=Sk.abstr.iter(b[1]);if(this===a.filterfalse.prototype)return new a.filterfalse(d,e);else{const b=new this.constructor;return a.filterfalse.call(b,d,e),b}}}}),a._grouper=Sk.abstr.buildIteratorClass("itertools._grouper",{constructor:function _grouper(a){this.groupby=a,this.tgtkey=a.tgtkey,this.id=a.id},iternext(){const a=Sk.misceval.richCompareBool(this.groupby.currkey,this.tgtkey,"Eq");if(this.groupby.id===this.id&&a){let a=this.groupby.currval;return this.groupby.currval=this.groupby.iter.tp$iternext(),void 0!==this.groupby.currval&&(this.groupby.currkey=Sk.misceval.callsimArray(this.groupby.keyf,[this.groupby.currval])),a}}}),a.groupby=Sk.abstr.buildIteratorClass("itertools.groupby",{constructor:function groupby(a,b){this.iter=a,this.keyf=b,this.currval,this.currkey=this.tgtkey=new Sk.builtin.object,this.id},iternext(){this.id={};for(let a=Sk.misceval.richCompareBool(this.currkey,this.tgtkey,"Eq");a;){if(this.currval=this.iter.tp$iternext(),void 0===this.currval)return;this.currkey=Sk.misceval.callsimArray(this.keyf,[this.currval]),a=Sk.misceval.richCompareBool(this.currkey,this.tgtkey,"Eq")}this.tgtkey=this.currkey;const b=new a._grouper(this);return new Sk.builtin.tuple([this.currkey,b])},slots:{tp$doc:"groupby(iterable, key=None) -> make an iterator that returns consecutive\\nkeys and groups from the iterable.  If the key function is not specified or\\nis None, the element itself is used for grouping.\\n",tp$new(b,c){let d,e;if([d,e]=Sk.abstr.copyKeywordsToNamedArgs("groupby",["iterable","key"],b,c,[Sk.builtin.none.none$]),d=Sk.abstr.iter(d),e=Sk.builtin.checkNone(e)?new Sk.builtin.func(a=>a):e,this===a.groupby.prototype)return new a.groupby(d,e);else{const b=new this.constructor;return a.groupby.call(b,d,e),b}}}}),a.islice=Sk.abstr.buildIteratorClass("itertools.islice",{constructor:function islice(a,b,c,d){this.iter=a,this.previt=b,this.stop=c,this.step=d,this.tp$iternext=()=>{if(this.tp$iternext=this.constructor.prototype.tp$iternext,this.previt>=this.stop){for(let a=0;a<this.stop;a++)this.iter.tp$iternext();return}for(let a=0;a<this.previt;a++)this.iter.tp$iternext();return this.iter.tp$iternext()}},iternext(){if(this.previt+this.step>=this.stop){for(let a=this.previt+1;a<this.stop;a++)this.previt+=this.step,this.iter.tp$iternext();return}for(let a=this.previt+1;a<this.previt+this.step;a++)this.iter.tp$iternext();return this.previt+=this.step,this.iter.tp$iternext()},slots:{tp$doc:"islice(iterable, stop) --> islice object\\nislice(iterable, start, stop[, step]) --> islice object\\n\\nReturn an iterator whose next() method returns selected values from an\\niterable.  If start is specified, will skip all preceding elements;\\notherwise, start defaults to zero.  Step defaults to one.  If\\nspecified as another value, step determines how many values are \\nskipped between successive calls.  Works like a slice() on a list\\nbut returns an iterator.",tp$new(b,c){var d=Number.MAX_SAFE_INTEGER;Sk.abstr.checkNoKwargs("islice",c),Sk.abstr.checkArgsLen("islice",b,2,4);const e=Sk.abstr.iter(b[0]);let f=b[1],g=b[2],h=b[3];if(void 0===g?(g=f,f=Sk.builtin.none.none$,h=Sk.builtin.none.none$):void 0===h&&(h=Sk.builtin.none.none$),!(Sk.builtin.checkNone(g)||Sk.misceval.isIndex(g)))throw new Sk.builtin.ValueError("Stop for islice() must be None or an integer: 0 <= x <= sys.maxsize.");else if(g=Sk.builtin.checkNone(g)?d:Sk.misceval.asIndexSized(g),0>g||g>d)throw new Sk.builtin.ValueError("Stop for islice() must be None or an integer: 0 <= x <= sys.maxsize.");if(!(Sk.builtin.checkNone(f)||Sk.misceval.isIndex(f)))throw new Sk.builtin.ValueError("Indices for islice() must be None or an integer: 0 <= x <= sys.maxsize.");else if(f=Sk.builtin.checkNone(f)?0:Sk.misceval.asIndexSized(f),0>f||f>d)throw new Sk.builtin.ValueError("Indices for islice() must be None or an integer: 0 <= x <= sys.maxsize.");if(!(Sk.builtin.checkNone(h)||Sk.misceval.isIndex(h)))throw new Sk.builtin.ValueError("Step for islice() must be a positive integer or None");else if(h=Sk.builtin.checkNone(h)?1:Sk.misceval.asIndexSized(h),0>=h||h>d)throw new Sk.builtin.ValueError("Step for islice() must be a positive integer or None.");if(this===a.islice.prototype)return new a.islice(e,f,g,h);else{const b=new this.constructor;return a.islice.call(b,e,f,g,h),b}}}}),a.permutations=Sk.abstr.buildIteratorClass("itertools.permutations",{constructor:function permutations(a,b){this.pool=a,this.r=b;const c=a.length;this.indices=Array(c).fill().map((a,b)=>b),this.cycles=Array(b).fill().map((a,b)=>c-b),this.n=c,this.tp$iternext=()=>{if(!(this.r>this.n))return this.tp$iternext=this.constructor.prototype.tp$iternext,new Sk.builtin.tuple(this.pool.slice(0,this.r))}},iternext(){for(let a=this.r-1;0<=a;a--)if(this.cycles[a]--,0==this.cycles[a])this.indices.push(this.indices.splice(a,1)[0]),this.cycles[a]=this.n-a;else{j=this.cycles[a],[this.indices[a],this.indices[this.n-j]]=[this.indices[this.n-j],this.indices[a]];const b=this.indices.map(a=>this.pool[a]).slice(0,this.r);return new Sk.builtin.tuple(b)}this.r=0},slots:{tp$doc:"permutations(iterable[, r]) --> permutations object\\n\\nReturn successive r-length permutations of elements in the iterable.\\n\\npermutations(range(3), 2) --> (0,1), (0,2), (1,0), (1,2), (2,0), (2,1)",tp$new(b,c){let d,e;[d,e]=Sk.abstr.copyKeywordsToNamedArgs("permutations",["iterable","r"],b,c,[Sk.builtin.none.none$]);const f=Sk.misceval.arrayFromIterable(d);if(e=Sk.builtin.checkNone(e)?f.length:Sk.misceval.asIndexSized(e,Sk.builtin.OverFlowError),0>e)throw new Sk.builtin.ValueError("r must be non-negative");if(this===a.permutations.prototype)return new a.permutations(f,e);else{const b=new this.constructor;return a.permutations.call(b,f,e),b}}}}),a.product=Sk.abstr.buildIteratorClass("itertools.product",{constructor:function product(a){this.pools=a,this.n=a.length,this.indices=Array(a.length).fill(0),this.pool_sizes=a.map(a=>a.length),this.tp$iternext=()=>{this.tp$iternext=this.constructor.prototype.tp$iternext;const a=this.indices.map((a,b)=>this.pools[b][this.indices[b]]);return a.some(a=>void 0===a)?void(this.n=0):new Sk.builtin.tuple(a)}},iternext(){for(let a=this.n-1;0<=a&&a<this.n;)this.indices[a]++,this.indices[a]>=this.pool_sizes[a]?(this.indices[a]=-1,a--):a++;if(!this.n||this.indices.every(a=>-1===a))return void(this.n=0);else{const a=this.indices.map((a,b)=>this.pools[b][this.indices[b]]);return new Sk.builtin.tuple(a)}},slots:{tp$doc:"product(*iterables, repeat=1) --> product object\\n\\nCartesian product of input iterables.  Equivalent to nested for-loops.\\n\\nFor example, product(A, B) returns the same as:  ((x,y) for x in A for y in B).\\nThe leftmost iterators are in the outermost for-loop, so the output tuples\\ncycle in a manner similar to an odometer (with the rightmost element changing\\non every iteration).\\n\\nTo compute the product of an iterable with itself, specify the number\\nof repetitions with the optional repeat keyword argument. For example,\\nproduct(A, repeat=4) means the same as product(A, A, A, A).\\n\\nproduct('ab', range(3)) --> ('a',0) ('a',1) ('a',2) ('b',0) ('b',1) ('b',2)\\nproduct((0,1), (0,1), (0,1)) --> (0,0,0) (0,0,1) (0,1,0) (0,1,1) (1,0,0) ...",tp$new(b,c){let[d]=Sk.abstr.copyKeywordsToNamedArgs("product",["repeat"],[],c,[new Sk.builtin.int_(1)]);if(d=Sk.misceval.asIndexSized(d,Sk.builtin.OverFlowError),0>d)throw new Sk.builtin.ValueError("repeat argument cannot be negative");const e=[];for(let a=0;a<b.length;a++)e.push(Sk.misceval.arrayFromIterable(b[a]));const f=[].concat(...Array(d).fill(e));if(this===a.product.prototype)return new a.product(f);else{const b=new this.constructor;return a.product.call(b,f),b}}}}),a.repeat=Sk.abstr.buildIteratorClass("itertools.repeat",{constructor:function repeat(a,b){this.object=a,this.times=b,void 0===b&&(this.tp$iternext=()=>this.object)},iternext(){return 0<this.times--?this.object:void 0},slots:{tp$doc:"repeat(object [,times]) -> create an iterator which returns the object\\nfor the specified number of times.  If not specified, returns the object\\nendlessly.",tp$new(b,c){let d,e;if([d,e]=Sk.abstr.copyKeywordsToNamedArgs("repeat",["object","times"],b,c,[null]),e=null===e?void 0:Sk.misceval.asIndexSized(e,Sk.builtin.OverFlowError),this===a.repeat.prototype)return new a.repeat(d,e);else{const b=new this.constructor;return a.repeat.call(b,d,e),b}},$r(){return object_repr=Sk.misceval.objectRepr(this.object),times_repr=void 0===this.times?"":", "+(0<=this.times?this.times:0),new Sk.builtin.str(Sk.abstr.typeName(this)+"("+object_repr+times_repr+")")}},methods:{__lenght_hint__:{$meth(){if(void 0===this.times)throw new Sk.builtin.TypeError("len() of unsized object");return new Sk.builtin.int_(this.times)},$flags:{NoArgs:!0},$textsig:null}}}),a.starmap=Sk.abstr.buildIteratorClass("itertools.starmap",{constructor:function starmap(a,b){this.func=a,this.iter=b},iternext(){const a=this.iter.tp$iternext();if(void 0===a)return;const b=Sk.misceval.arrayFromIterable(a),c=Sk.misceval.callsimArray(this.func,b);return c},slots:{tp$new(b,c){let d,e;if([d,e]=Sk.abstr.copyKeywordsToNamedArgs("starmap",["func","iterable"],b,c,[]),e=Sk.abstr.iter(e),d=Sk.builtin.checkNone(d)?Sk.builtin.bool:d,this===a.starmap.prototype)return new a.starmap(d,e);else{const b=new this.constructor;return a.starmap.call(b,d,e),b}}}}),a.takewhile=Sk.abstr.buildIteratorClass("itertools.takewhile",{constructor:function takewhile(a,b){this.predicate=a,this.iter=b},iternext(){const a=this.iter.tp$iternext();if(void 0!==a){const b=Sk.misceval.callsimArray(this.predicate,[a]);if(Sk.misceval.isTrue(b))return a;this.tp$iternext=()=>void 0}},slots:{tp$doc:"takewhile(predicate, iterable) --> takewhile object\\n\\nReturn successive entries from an iterable as long as the \\npredicate evaluates to true for each entry.",tp$new(b,c){Sk.abstr.checkNoKwargs("takewhile",c),Sk.abstr.checkArgsLen("takewhile",b,2,2);const d=b[0],e=Sk.abstr.iter(b[1]);if(this===a.takewhile.prototype)return new a.takewhile(d,e);else{const b=new this.constructor;return a.takewhile.call(b,d,e),b}}}}),a.tee=new Sk.builtin.func(function(){throw new Sk.builtin.NotImplementedError("tee is not yet implemented in Skulpt")}),a.zip_longest=Sk.abstr.buildIteratorClass("itertools.zip_longest",{constructor:function zip_longest(a,b){this.iters=a,this.fillvalue=b,this.active=this.iters.length},iternext(){if(!this.active)return;let b;const c=[];for(let d=0;d<this.iters.length;d++){if(b=this.iters[d].tp$iternext(),void 0===b){if(this.active--,!this.active)return;this.iters[d]=new a.repeat(this.fillvalue),b=this.fillvalue}c.push(b)}return new Sk.builtin.tuple(c)},slots:{tp$doc:"zip_longest(iter1 [,iter2 [...]], [fillvalue=None]) --> zip_longest object\\n\\nReturn a zip_longest object whose .__next__() method returns a tuple where\\nthe i-th element comes from the i-th iterable argument.  The .__next__()\\nmethod continues until the longest iterable in the argument sequence\\nis exhausted and then it raises StopIteration.  When the shorter iterables\\nare exhausted, the fillvalue is substituted in their place.  The fillvalue\\ndefaults to None or can be specified by a keyword argument.\\n",tp$new(b,c){const[d]=Sk.abstr.copyKeywordsToNamedArgs("zip_longest",["fillvalue"],[],c,[Sk.builtin.none.none$]),e=[];for(let a=0;a<b.length;a++)e.push(Sk.abstr.iter(b[a]));if(this===a.zip_longest.prototype)return new a.zip_longest(e,d);else{const b=new this.constructor;return a.zip_longest.call(b,e,d),b}}}}),a.__doc__=new Sk.builtin.str("An implementation of the python itertools module in Skulpt"),a.__package__=new Sk.builtin.str(""),a};`,"src/lib/json/__init__.py":`raise NotImplementedError("json is not yet implemented in Skulpt")
`,"src/lib/json/tests/__init__.py":`raise NotImplementedError("tests is not yet implemented in Skulpt")
`,"src/lib/keyword.py":`
__all__ = ["iskeyword", "kwlist"]

kwlist = [
#--start keywords--
        'and',
        'as',
        'assert',
        'break',
        'class',
        'continue',
        'def',
        'del',
        'elif',
        'else',
        'except',
        'exec',
        'finally',
        'for',
        'from',
        'global',
        'if',
        'import',
        'in',
        'is',
        'lambda',
        'not',
        'or',
        'pass',
        'print',
        'raise',
        'return',
        'try',
        'while',
        'with',
        'yield',
#--end keywords--
        ]

iskeyword = frozenset(kwlist).__contains__

`,"src/lib/lib-dynload/__init__.py":`raise NotImplementedError("lib-dynload is not yet implemented in Skulpt")
`,"src/lib/lib-tk/__init__.py":`raise NotImplementedError("lib-tk is not yet implemented in Skulpt")
`,"src/lib/lib2to3/__init__.py":`raise NotImplementedError("lib2to3 is not yet implemented in Skulpt")
`,"src/lib/lib2to3/fixes/__init__.py":`raise NotImplementedError("fixes is not yet implemented in Skulpt")
`,"src/lib/lib2to3/pgen2/__init__.py":`raise NotImplementedError("pgen2 is not yet implemented in Skulpt")
`,"src/lib/lib2to3/tests/__init__.py":`raise NotImplementedError("tests is not yet implemented in Skulpt")
`,"src/lib/linecache.py":`raise NotImplementedError("linecache is not yet implemented in Skulpt")
`,"src/lib/locale.py":`raise NotImplementedError("locale is not yet implemented in Skulpt")
`,"src/lib/logging/__init__.py":`raise NotImplementedError("logging is not yet implemented in Skulpt")
`,"src/lib/macpath.py":`raise NotImplementedError("macpath is not yet implemented in Skulpt")
`,"src/lib/macurl2path.py":`raise NotImplementedError("macurl2path is not yet implemented in Skulpt")
`,"src/lib/mailbox.py":`raise NotImplementedError("mailbox is not yet implemented in Skulpt")
`,"src/lib/mailcap.py":`raise NotImplementedError("mailcap is not yet implemented in Skulpt")
`,"src/lib/markupbase.py":`raise NotImplementedError("markupbase is not yet implemented in Skulpt")
`,"src/lib/math.js":`const $builtinmodule=function(){var a=Math.PI,b=Math.sqrt,c=Number.MAX_SAFE_INTEGER,d=Math.E,e=Math.log,f=Math.exp,g=Math.pow,h=Math.log2,i=Number.isFinite,j=Math.floor,k=Math.abs;const l={pi:new Sk.builtin.float_(a),e:new Sk.builtin.float_(d),tau:new Sk.builtin.float_(2*a),nan:new Sk.builtin.float_(NaN),inf:new Sk.builtin.float_(1/0)},n=function(a){return a=a?0>a?-1:1:0>1/a?-1:1,a},o=18;return Sk.abstr.setUpModuleMethods("math",l,{acos:{$meth:function acos(a){var b=Math.acos;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the arc cosine (measured in radians) of x."},acosh:{$meth:function acosh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),a=Sk.builtin.asnum$(a);const c=a+b(a*a-1);return new Sk.builtin.float_(e(c))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the inverse hyperbolic cosine of x."},asin:{$meth:function asin(a){var b=Math.asin;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the arc sine (measured in radians) of x."},asinh:{$meth:function asinh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),a=Sk.builtin.asnum$(a);const c=a+b(a*a+1);return new Sk.builtin.float_(e(c))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the inverse hyperbolic sine of x."},atan:{$meth:function atan(a){var b=Math.atan;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the arc tangent (measured in radians) of x."},atan2:{$meth:function atan2(a,b){var c=Math.atan2;return Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(b)),new Sk.builtin.float_(c(Sk.builtin.asnum$(a),Sk.builtin.asnum$(b)))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, y, x, /)",$doc:"Return the arc tangent (measured in radians) of y/x.\\n\\nUnlike atan(y/x), the signs of both x and y are considered."},atanh:{$meth:function atanh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),a=Sk.builtin.asnum$(a);const b=(1+a)/(1-a);return new Sk.builtin.float_(e(b)/2)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the inverse hyperbolic tangent of x."},ceil:{$meth:function ceil(a){var b=Math.ceil;Sk.builtin.pyCheckType("","real number",Sk.builtin.checkNumber(a));const c=Sk.builtin.asnum$(a);return Sk.__future__.ceil_floor_int?new Sk.builtin.int_(b(c)):new Sk.builtin.float_(b(c))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the ceiling of x as an Integral.\\n\\nThis is the smallest integer >= x."},copysign:{$meth:function copysign(a,b){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(b));const c=Sk.builtin.asnum$(b),d=Sk.builtin.asnum$(a),e=n(d),f=n(c);return new Sk.builtin.float_(d*(e*f))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Return a float with the magnitude (absolute value) of x but the sign of y.\\n\\nOn platforms that support signed zeros, copysign(1.0, -0.0)\\nreturns -1.0.\\n"},cos:{$meth:function cos(a){var b=Math.cos;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the cosine of x (measured in radians)."},cosh:{$meth:function cosh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),a=Sk.builtin.asnum$(a);const b=g(d,a);return new Sk.builtin.float_((b+1/b)/2)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the hyperbolic cosine of x."},degrees:{$meth:function degrees(b){Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(b));const c=180/a*Sk.builtin.asnum$(b);return new Sk.builtin.float_(c)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Convert angle x from radians to degrees."},erf:{$meth:function erf(){throw new Sk.builtin.NotImplementedError("math.erf() is not yet implemented in Skulpt")},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Error function at x."},erfc:{$meth:function erfc(){throw new Sk.builtin.NotImplementedError("math.erfc() is not yet implemented in Skulpt")},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Complementary error function at x."},exp:{$meth:function exp(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let b=a.v;if("number"!=typeof b&&(b=a.nb$float().v),b==1/0||b==-Infinity||isNaN(b))return new Sk.builtin.float_(f(b));const c=f(b);if(!isFinite(c))throw new Sk.builtin.OverflowError("math range error");return new Sk.builtin.float_(c)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return e raised to the power of x."},expm1:{$meth:function expm1(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const b=Sk.builtin.asnum$(a);if(.7>k(b)){const a=f(b);if(1==a)return new Sk.builtin.float_(b);else{const c=(a-1)*b/e(a);return new Sk.builtin.float_(c)}}else{const a=f(b)-1;return new Sk.builtin.float_(a)}},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return exp(x)-1.\\n\\nThis function avoids the loss of precision involved in the direct evaluation of exp(x)-1 for small x."},fabs:{$meth:function fabs(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let b=a.v;return JSBI.__isBigInt(b)&&(b=a.nb$float().v),b=k(b),new Sk.builtin.float_(b)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the absolute value of the float x."},factorial:{$meth:function factorial(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let b=Sk.builtin.asnum$(a);if(a=j(b),a!=b)throw new Sk.builtin.ValueError("factorial() only accepts integral values");if(0>a)throw new Sk.builtin.ValueError("factorial() not defined for negative numbers");let c=1;for(let b=2;b<=a&&b<=o;b++)c*=b;if(a<=o)return new Sk.builtin.int_(c);c=JSBI.BigInt(c);for(let b=19;b<=a;b++)c=JSBI.multiply(c,JSBI.BigInt(b));return new Sk.builtin.int_(c)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Find x!.\\n\\nRaise a ValueError if x is negative or non-integral."},floor:{$meth:function floor(a){return Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.__future__.ceil_floor_int?new Sk.builtin.int_(j(Sk.builtin.asnum$(a))):new Sk.builtin.float_(j(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the floor of x as an Integral.\\n\\nThis is the largest integer <= x."},fmod:{$meth:function fmod(a,b){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(b));let c=a.v,d=b.v;if("number"!=typeof c&&(c=a.nb$float().v),"number"!=typeof d&&(d=b.nb$float().v),(d==1/0||d==-Infinity)&&isFinite(c))return new Sk.builtin.float_(c);const e=c%d;if(isNaN(e)&&!isNaN(c)&&!isNaN(d))throw new Sk.builtin.ValueError("math domain error");return new Sk.builtin.float_(e)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Return fmod(x, y), according to platform C.\\n\\nx % y may differ."},frexp:{$meth:function frexp(a){var b=Math.max;Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const c=Sk.builtin.asnum$(a),d=[c,0];if(0!==c&&i(c)){const a=k(c);let e=b(-1023,j(h(a))+1),f=a*g(2,-e);for(;.5>f;)f*=2,e--;for(;1<=f;)f*=.5,e++;0>c&&(f=-f),d[0]=f,d[1]=e}return d[0]=new Sk.builtin.float_(d[0]),d[1]=new Sk.builtin.int_(d[1]),new Sk.builtin.tuple(d)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the mantissa and exponent of x, as pair (m, e).\\n\\nm is a float and e is an int, such that x = m * 2.**e.\\nIf x is 0, m and e are both 0.  Else 0.5 <= abs(m) < 1.0."},fsum:{$meth:function fsum(a){if(!Sk.builtin.checkIterable(a))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(a)+"' object is not iterable");let b=[];a=Sk.abstr.iter(a);let c,d,e;for(let f=a.tp$iternext();void 0!==f;f=a.tp$iternext()){Sk.builtin.pyCheckType("","real number",Sk.builtin.checkNumber(f)),c=0;let a=f.v;"number"!=typeof a&&(a=f.nb$float().v),f=a;for(let a,g=0,h=b.length;g<h;g++){if(a=b[g],k(f)<k(a)){let b=f;f=a,a=b}d=f+a,e=a-(d-f),e&&(b[c]=e,c++),f=d}b=b.slice(0,c).concat([f])}const f=b.reduce(function(c,a){return c+a},0);return new Sk.builtin.float_(f)},$flags:{OneArg:!0},$textsig:"($module, seq, /)",$doc:"Return an accurate floating point sum of values in the iterable seq.\\n\\nAssumes IEEE-754 floating point arithmetic."},gamma:{$meth:function gamma(){throw new Sk.builtin.NotImplementedError("math.gamma() is not yet implemented in Skulpt")},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Gamma function at x."},gcd:{$meth:function gcd(c,a){function _gcd(c,a){return 0==a?c:_gcd(a,c%a)}function _biggcd(c,a){return JSBI.equal(a,JSBI.__ZERO)?c:_biggcd(a,JSBI.remainder(c,a))}Sk.builtin.pyCheckType("a","integer",Sk.builtin.checkInt(c)),Sk.builtin.pyCheckType("b","integer",Sk.builtin.checkInt(a));let b,d=Sk.builtin.asnum$(c),e=Sk.builtin.asnum$(a);return"number"==typeof d&&"number"==typeof e?(d=k(d),e=k(e),b=_gcd(d,e),b=0>b?-b:b,new Sk.builtin.int_(b)):(d=JSBI.BigInt(d),e=JSBI.BigInt(e),b=_biggcd(d,e),JSBI.lessThan(b,JSBI.__ZERO)&&(b=JSBI.multiply(b,JSBI.BigInt(-1))),new Sk.builtin.int_(b.toString()))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"greatest common divisor of x and y"},hypot:{$meth:function hypot(a,c){return Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(c)),a=Sk.builtin.asnum$(a),c=Sk.builtin.asnum$(c),new Sk.builtin.float_(b(a*a+c*c))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Return the Euclidean distance, sqrt(x*x + y*y)."},isclose:{$meth:function isclose(c,d){Sk.abstr.checkArgsLen("isclose",c,2,2),rel_abs_vals=Sk.abstr.copyKeywordsToNamedArgs("isclose",["rel_tol","abs_tol"],[],d,[new Sk.builtin.float_(1e-9),new Sk.builtin.float_(0)]);const e=c[0],a=c[1],b=rel_abs_vals[0],f=rel_abs_vals[1];Sk.builtin.pyCheckType("a","number",Sk.builtin.checkNumber(e)),Sk.builtin.pyCheckType("b","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("rel_tol","number",Sk.builtin.checkNumber(b)),Sk.builtin.pyCheckType("abs_tol","number",Sk.builtin.checkNumber(f));const g=Sk.builtin.asnum$(e),h=Sk.builtin.asnum$(a),i=Sk.builtin.asnum$(b),j=Sk.builtin.asnum$(f);if(0>i||0>j)throw new Sk.builtin.ValueError("tolerances must be non-negative");if(g==h)return Sk.builtin.bool.true$;if(g==1/0||g==-Infinity||h==1/0||h==-Infinity)return Sk.builtin.bool.false$;const l=k(h-g),m=l<=k(i*h)||l<=k(i*g)||l<=j;return new Sk.builtin.bool(m)},$flags:{FastCall:!0},$textsig:"($module, /, a, b, *, rel_tol=1e-09, abs_tol=0.0)",$doc:"Determine whether two floating point numbers are close in value.\\n\\n  rel_tol\\n    maximum difference for being considered \\"close\\", relative to the\\n    magnitude of the input values\\n  abs_tol\\n    maximum difference for being considered \\"close\\", regardless of the\\n    magnitude of the input values\\n\\nReturn True if a is close in value to b, and False otherwise.\\n\\nFor the values to be considered close, the difference between them\\nmust be smaller than at least one of the tolerances.\\n\\n-inf, inf and NaN behave similarly to the IEEE 754 Standard.  That\\nis, NaN is not close to anything, even itself.  inf and -inf are\\nonly close to themselves."},isfinite:{$meth:function isfinite(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const b=Sk.builtin.asnum$(a);return Sk.builtin.checkInt(a)?Sk.builtin.bool.true$:isFinite(b)?Sk.builtin.bool.true$:Sk.builtin.bool.false$},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return True if x is neither an infinity nor a NaN, and False otherwise."},isinf:{$meth:function isinf(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const b=Sk.builtin.asnum$(a);return Sk.builtin.checkInt(a)?Sk.builtin.bool.false$:isFinite(b)||isNaN(b)?Sk.builtin.bool.false$:Sk.builtin.bool.true$},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return True if x is a positive or negative infinity, and False otherwise."},isnan:{$meth:function isnan(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const b=Sk.builtin.asnum$(a);return isNaN(b)?Sk.builtin.bool.true$:Sk.builtin.bool.false$},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return True if x is a NaN (not a number), and False otherwise."},ldexp:{$meth:function ldexp(a,b){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("i","integer",Sk.builtin.checkInt(b));let c=a.v;"number"!=typeof c&&(c=a.nb$float().v);const d=Sk.builtin.asnum$(b);if(c==1/0||c==-Infinity||0==c||isNaN(c))return a;const e=c*g(2,d);if(!isFinite(e))throw new Sk.builtin.OverflowError("math range error");return new Sk.builtin.float_(e)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, i, /)",$doc:"Return x * (2**i).\\n\\nThis is essentially the inverse of frexp()."},lgamma:{$meth:function lgamma(){throw new Sk.builtin.NotImplementedError("math.lgamma() is not yet implemented in Skulpt")},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Natural logarithm of absolute value of Gamma function at x."},log:{$meth:function log(a,b){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let f,g,h=Sk.builtin.asnum$(a);if(0>=h)throw new Sk.builtin.ValueError("math domain error");if(void 0===b?f=d:(Sk.builtin.pyCheckType("base","number",Sk.builtin.checkNumber(b)),f=Sk.builtin.asnum$(b)),0>=f)throw new Sk.builtin.ValueError("math domain error");else if(Sk.builtin.checkFloat(a)||h<c)g=e(h)/e(f);else{h=new Sk.builtin.str(a).$jsstr();const b=h.length,c=parseFloat("0."+h);g=(b*e(10)+e(c))/e(f)}return new Sk.builtin.float_(g)},$flags:{MinArgs:1,MaxArgs:2},$textsig:null,$doc:"log(x, [base=e])\\nReturn the logarithm of x to the given base.\\n\\nIf the base not specified, returns the natural logarithm (base e) of x."},log10:{$meth:function log10(a){var b=Math.log10;Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let d,e=Sk.builtin.asnum$(a);if(0>e)throw new Sk.builtin.ValueError("math domain error");else if(Sk.builtin.checkFloat(a)||e<c)d=b(e);else{e=new Sk.builtin.str(a).$jsstr();const c=e.length,f=parseFloat("0."+e);d=c+b(f)}return new Sk.builtin.float_(d)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the base 10 logarithm of x."},log1p:{$meth:function log1p(a){var b=Number.EPSILON;Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let c=a.v;if("number"!=typeof c&&(c=a.nb$float().v),-1>=c)throw new Sk.builtin.ValueError("math domain error");else{if(0==c)return new Sk.builtin.float_(c);if(k(c)<b/2)return new Sk.builtin.float_(c);if(-.5<=c&&1>=c){const a=1+c,b=e(a)-(a-1-c)/a;return new Sk.builtin.float_(b)}else{const a=e(1+c);return new Sk.builtin.float_(a)}}},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the natural logarithm of 1+x (base e).\\n\\nThe result is computed in a way which is accurate for x near zero."},log2:{$meth:function log2(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let b,d=Sk.builtin.asnum$(a);if(0>d)throw new Sk.builtin.ValueError("math domain error");else if(Sk.builtin.checkFloat(a)||d<c)b=h(d);else{d=new Sk.builtin.str(a).$jsstr();const c=d.length,e=parseFloat("0."+d);b=c*h(10)+h(e)}return new Sk.builtin.float_(b)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the base 2 logarithm of x."},modf:{$meth:function modf(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));let b=Sk.builtin.asnum$(a);if(!isFinite(b)){if(b==1/0)return new Sk.builtin.tuple([new Sk.builtin.float_(0),new Sk.builtin.float_(b)]);if(b==-Infinity)return new Sk.builtin.tuple([new Sk.builtin.float_(-0),new Sk.builtin.float_(b)]);if(isNaN(b))return new Sk.builtin.tuple([new Sk.builtin.float_(b),new Sk.builtin.float_(b)])}const c=n(b);b=k(b);const e=c*j(b),f=c*(b-j(b));return new Sk.builtin.tuple([new Sk.builtin.float_(f),new Sk.builtin.float_(e)])},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the fractional and integer parts of x.\\n\\nBoth results carry the sign of x and are floats."},pow:{$meth:function pow(a,b){var c=Number.isInteger;Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(b));let d=a.v,e=b.v;if("number"!=typeof d&&(d=a.nb$float().v),"number"!=typeof e&&(e=b.nb$float().v),0==d&&0>e)throw new Sk.builtin.ValueError("math domain error");else{if(1==d)return new Sk.builtin.float_(1);if(i(d)&&i(e)&&0>d&&!c(e))throw new Sk.builtin.ValueError("math domain error");else if(-1==d&&(e==-Infinity||e==1/0))return new Sk.builtin.float_(1)}const f=g(d,e);if(!i(d)||!i(e))return new Sk.builtin.float_(f);if(f==1/0||f==-Infinity)throw new Sk.builtin.OverflowError("math range error");return new Sk.builtin.float_(f)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Return x**y (x to the power of y)."},radians:{$meth:function radians(b){Sk.builtin.pyCheckType("deg","number",Sk.builtin.checkNumber(b));const c=a/180*Sk.builtin.asnum$(b);return new Sk.builtin.float_(c)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Convert angle x from degrees to radians."},remainder:{$meth:function remainder(a,b){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("y","number",Sk.builtin.checkNumber(b));let d=a.v,e=b.v;if("number"!=typeof d&&(d=a.nb$float().v),"number"!=typeof e&&(e=b.nb$float().v),isFinite(d)&&isFinite(e)){let a,b,f,c,g;if(0==e)throw new Sk.builtin.ValueError("math domain error");if(a=k(d),b=k(e),c=a%b,f=b-c,c<f)g=c;else if(c>f)g=-f;else{if(c!=f)throw new Sk.builtin.AssertionError;g=c-2*(.5*(a-c)%b)}return new Sk.builtin.float_(n(d)*g)}if(isNaN(d))return a;if(isNaN(e))return b;if(d==1/0||d==-Infinity)throw new Sk.builtin.ValueError("math domain error");if(e!=1/0&&e!=-Infinity)throw new Sk.builtin.AssertionError;return new Sk.builtin.float_(d)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, x, y, /)",$doc:"Difference between x and the closest integer multiple of y.\\n\\nReturn x - n*y where n*y is the closest integer multiple of y.\\nIn the case where x is exactly halfway between two multiples of\\ny, the nearest even value of n is used. The result is always exact."},sin:{$meth:function sin(a){var b=Math.sin;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the sine of x (measured in radians)."},sinh:{$meth:function sinh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),a=Sk.builtin.asnum$(a);const b=g(d,a);return new Sk.builtin.float_((b-1/b)/2)},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the hyperbolic sine of x."},sqrt:{$meth:function sqrt(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const c=Sk.builtin.asnum$(a);if(0>c)throw new Sk.builtin.ValueError("math domain error");return new Sk.builtin.float_(b(c))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the square root of x."},tan:{$meth:function tan(a){var b=Math.tan;return Sk.builtin.pyCheckType("rad","number",Sk.builtin.checkNumber(a)),new Sk.builtin.float_(b(Sk.builtin.asnum$(a)))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the tangent of x (measured in radians)."},tanh:{$meth:function tanh(a){Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a));const b=Sk.builtin.asnum$(a);if(0===b)return new Sk.builtin.float_(b);const c=g(d,b),e=1/c;return new Sk.builtin.float_((c-e)/2/((c+e)/2))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Return the hyperbolic tangent of x."},trunc:{$meth:function trunc(a){return Sk.builtin.pyCheckType("x","number",Sk.builtin.checkNumber(a)),Sk.builtin.checkInt(a)?a:new Sk.builtin.int_(0|Sk.builtin.asnum$(a))},$flags:{OneArg:!0},$textsig:"($module, x, /)",$doc:"Truncates the Real x to the nearest Integral toward 0.\\n\\nUses the __trunc__ magic method."}}),l};`,"src/lib/md5.py":`raise NotImplementedError("md5 is not yet implemented in Skulpt")
`,"src/lib/mhlib.py":`raise NotImplementedError("mhlib is not yet implemented in Skulpt")
`,"src/lib/mimetools.py":`raise NotImplementedError("mimetools is not yet implemented in Skulpt")
`,"src/lib/mimetypes.py":`raise NotImplementedError("mimetypes is not yet implemented in Skulpt")
`,"src/lib/mimify.py":`raise NotImplementedError("mimify is not yet implemented in Skulpt")
`,"src/lib/modulefinder.py":`raise NotImplementedError("modulefinder is not yet implemented in Skulpt")
`,"src/lib/multifile.py":`raise NotImplementedError("multifile is not yet implemented in Skulpt")
`,"src/lib/multiprocessing/__init__.py":`raise NotImplementedError("multiprocessing is not yet implemented in Skulpt")
`,"src/lib/multiprocessing/dummy/__init__.py":`raise NotImplementedError("dummy is not yet implemented in Skulpt")
`,"src/lib/mutex.py":`raise NotImplementedError("mutex is not yet implemented in Skulpt")
`,"src/lib/netrc.py":`raise NotImplementedError("netrc is not yet implemented in Skulpt")
`,"src/lib/new.py":`raise NotImplementedError("new is not yet implemented in Skulpt")
`,"src/lib/nntplib.py":`raise NotImplementedError("nntplib is not yet implemented in Skulpt")
`,"src/lib/ntpath.py":`raise NotImplementedError("ntpath is not yet implemented in Skulpt")
`,"src/lib/nturl2path.py":`raise NotImplementedError("nturl2path is not yet implemented in Skulpt")
`,"src/lib/numbers.py":`Number = (int, float, complex)
Integral = int
Complex = complex
`,"src/lib/opcode.py":`raise NotImplementedError("opcode is not yet implemented in Skulpt")
`,"src/lib/operator.js":`function $builtinmodule(){return operator={__name__:new Sk.builtin.str("operator"),__doc__:new Sk.builtin.str("Operator interface.\\n\\nThis module exports a set of functions implemented in javascript corresponding\\nto the intrinsic operators of Python.  For example, operator.add(x, y)\\nis equivalent to the expression x+y.  The function names are those\\nused for special methods; variants without leading and trailing\\n'__' are also provided for convenience."),__all__:new Sk.builtin.list(["abs","add","and_","attrgetter","concat","contains","countOf","delitem","eq","floordiv","ge","getitem","gt","iadd","iand","iconcat","ifloordiv","ilshift","imatmul","imod","imul","index","indexOf","inv","invert","ior","ipow","irshift","is_","is_not","isub","itemgetter","itruediv","ixor","le","length_hint","lshift","lt","matmul","methodcaller","mod","mul","ne","neg","not_","or_","pos","pow","rshift","setitem","sub","truediv","truth","xor"].map(a=>new Sk.builtin.str(a)))},operator.itemgetter=Sk.abstr.buildNativeClass("operator.itemgetter",{constructor:function itemgetter(a){this.items=a,this.oneitem=1===a.length,this.item=a[0],this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$new(a,b){return Sk.abstr.checkNoKwargs("itemgetter",b),Sk.abstr.checkArgsLen("itemgetter",a,1),new operator.itemgetter(a)},tp$call(a,b){Sk.abstr.checkNoKwargs("itemgetter",b),Sk.abstr.checkArgsLen("itemgetter",a,1,1);const c=a[0];return this.oneitem?Sk.abstr.objectGetItem(c,this.item,!0):new Sk.builtin.tuple(this.items.map(a=>Sk.abstr.objectGetItem(c,a)))},tp$doc:"Return a callable object that fetches the given item(s) from its operand.\\n            After f = itemgetter(2), the call f(r) returns r[2].\\n            After g = itemgetter(2, 5, 3), the call g(r) returns (r[2], r[5], r[3])",$r(){if(this.in$repr)return new Sk.builtin.str(this.tp$name+"(...)");this.in$repr=!0;const a=this.tp$name+"("+this.items.map(a=>Sk.misceval.objectRepr(a)).join(", ")+")";return this.in$repr=!1,a}}}),operator.attrgetter=Sk.abstr.buildNativeClass("operator.attrgetter",{constructor:function attrgetter(a){this.attrs=a,this.oneattr=1===a.length,this.attr=a[0],this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$new(a,b){Sk.abstr.checkNoKwargs("attrgetter",b),Sk.abstr.checkArgsLen("attrgetter",a,1);const c=[];for(let d=0;d<a.length;d++){const b=a[d];if(!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("attribute name must be a string");b.v.includes(".")?c.push(b.$jsstr().split(".").map(a=>new Sk.builtin.str(a))):c.push([b])}return new operator.attrgetter(c)},tp$call(a,b){Sk.abstr.checkNoKwargs("attrgetter",b),Sk.abstr.checkArgsLen("attrgetter",a,1,1);const c=a[0];if(this.oneattr)return this.attr.reduce((a,b)=>Sk.abstr.gattr(a,b),c);const d=this.attrs.map(a=>a.reduce((a,b)=>Sk.abstr.gattr(a,b),c));return new Sk.builtin.tuple(d)},tp$doc:"attrgetter(attr, ...) --> attrgetter object\\n\\nReturn a callable object that fetches the given attribute(s) from its operand.\\nAfter f = attrgetter('name'), the call f(r) returns r.name.\\nAfter g = attrgetter('name', 'date'), the call g(r) returns (r.name, r.date).\\nAfter h = attrgetter('name.first', 'name.last'), the call h(r) returns\\n(r.name.first, r.name.last).",$r(){if(this.in$repr)return new Sk.builtin.str(this.tp$name+"(...)");this.in$repr=!0;const a=this.tp$name+"("+this.items.map(a=>Sk.misceval.objectRepr(a)).join(", ")+")";return this.in$repr=!1,a}}}),operator.methodcaller=Sk.abstr.buildNativeClass("operator.methodcaller",{constructor:function methodcaller(a,b,c){this.$name=a,this.args=b,this.kwargs=c||[],this.in$repr=!1},slots:{tp$getattr:Sk.generic.getAttr,tp$new(a,b){Sk.abstr.checkArgsLen("methodcaller",a,1);const c=a[0];if(!Sk.builtin.checkString(c))throw new Sk.builtin.TypeError("method name must be a string");return new operator.methodcaller(c,a.slice(1),b)},tp$call(a,b){Sk.abstr.checkNoKwargs("methodcaller",b),Sk.abstr.checkArgsLen("methodcaller",a,1,1);const c=a[0];return Sk.misceval.chain(Sk.abstr.gattr(c,this.$name,!0),a=>Sk.misceval.callsimOrSuspendArray(a,this.args,this.kwargs))},tp$doc:"methodcaller(name, ...) --> methodcaller object\\n\\nReturn a callable object that calls the given method on its operand.\\nAfter f = methodcaller('name'), the call f(r) returns r.name().\\nAfter g = methodcaller('name', 'date', foo=1), the call g(r) returns\\nr.name('date', foo=1).",$r(){if(this.in$repr)return new Sk.builtin.str(this.tp$name+"(...)");this.in$repr=!0;let a=[Sk.misceval.objectRepr(this.$name),...this.args.map(a=>Sk.misceval.objectRepr(a))];for(let b=0;b<this.kwargs.length;b+=2)a.push(this.kwargs[b]+"="+Sk.misceval.objectRepr(this.kwargs[b+1]));return a=this.tp$name+"("+a.join(", ")+")",this.in$repr=!1,a}}}),Sk.abstr.setUpModuleMethods("operator",operator,{lt:{$meth:function lt(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"Lt"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a < b."},le:{$meth:function le(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"LtE"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a <= b."},eq:{$meth:function eq(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"Eq"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a == b."},ne:{$meth:function ne(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"NotEq"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a != b."},ge:{$meth:function ge(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"GtE"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a >= b."},gt:{$meth:function gt(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"Gt"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a > b."},not_:{$meth:function not_(a){return Sk.abstr.numberUnaryOp(a,"Not")},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as not a."},truth:{$meth:function truth(a){return Sk.builtin.bool(a)},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Return True if a is true, False otherwise."},is_:{$meth:function is_(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"Is"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a is b."},is_not:{$meth:function is_not(c,a){return Sk.builtin.bool(Sk.misceval.richCompareBool(c,a,"IsNot"))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a is not b."},abs:{$meth:function abs(a){return Sk.builtin.abs(a)},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as abs(a)."},add:{$meth:function add(c,a){return Sk.abstr.numberBinOp(c,a,"Add")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a + b."},and_:{$meth:function and_(c,a){return Sk.abstr.numberBinOp(c,a,"BitAnd")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a & b."},floordiv:{$meth:function floordiv(c,a){return Sk.abstr.numberBinOp(c,a,"FloorDiv")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a // b."},index:{$meth:function index(b){return new Sk.builtin.int_(Sk.misceval.asIndexOrThrow(b))},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as a.__index__()"},inv:{$meth:function inv(a){return Sk.abstr.numberUnaryOp(a,"Invert")},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as ~a."},invert:{$meth:function invert(a){return Sk.abstr.numberUnaryOp(a,"Invert")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, /)",$doc:"Same as ~a."},lshift:{$meth:function lshift(c,a){return Sk.abstr.numberBinOp(c,a,"LShift")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a << b."},mod:{$meth:function mod(c,a){return Sk.abstr.numberBinOp(c,a,"Mod")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a % b."},mul:{$meth:function mul(c,a){return Sk.abstr.numberBinOp(c,a,"Mult")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a * b."},matmul:{$meth:function matmul(c,a){return Sk.abstr.numberBinOp(c,a,"MatMult")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a @ b."},neg:{$meth:function neg(a){return Sk.abstr.numberUnaryOp(a,"USub")},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as -a."},or_:{$meth:function or_(c,a){return Sk.abstr.numberBinOp(c,a,"BitOr")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a | b."},pos:{$meth:function pos(a){return Sk.abstr.numberUnaryOp(a,"UAdd")},$flags:{OneArg:!0},$textsig:"($module, a, /)",$doc:"Same as +a."},pow:{$meth:function pow(c,a){return Sk.abstr.numberBinOp(c,a,"Pow")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a ** b."},rshift:{$meth:function rshift(c,a){return Sk.abstr.numberBinOp(c,a,"RShift")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a >> b."},sub:{$meth:function sub(c,a){return Sk.abstr.numberBinOp(c,a,"Sub")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a - b."},truediv:{$meth:function div(c,a){return Sk.abstr.numberBinOp(c,a,"Div")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a / b."},xor:{$meth:function xor(c,a){return Sk.abstr.numberBinOp(c,a,"BitXor")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a ^ b."},concat:{$meth:function concat(c,a){return Sk.abstr.sequenceConcat(c,a)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a + b, for a and b sequences."},contains:{$meth:function contains(c,a){return Sk.builtin.bool(Sk.abstr.sequenceContains(c,a))},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as b in a (note reversed operands)."},countOf:{$meth:function countOf(c,a){return Sk.abstr.sequenceGetCountOf(c,a)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Return the number of times b occurs in a."},delitem:{$meth:function delitem(c,a){return Sk.misceval.chain(Sk.abstr.objectDelItem(c,a,!0),()=>Sk.builtin.none.none$)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as del a[b]."},getitem:{$meth:function getitem(c,a){return Sk.abstr.objectGetItem(c,a)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a[b]."},indexOf:{$meth:function indexOf(c,a){return Sk.abstr.sequenceGetIndexOf(c,a)},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Return the first index of b in a."},setitem:{$meth:function setitem(d,a,b){return Sk.misceval.chain(Sk.abstr.objectSetItem(d,a,b,!0),()=>Sk.builtin.none.none$)},$flags:{MinArgs:3,MaxArgs:3},$textsig:"($module, a, b, c, /)",$doc:"Same as a[b] = c."},length_hint:{$meth:function length_hint(a,b){if(void 0===b)b=new Sk.builtin.int_(0);else if(!Sk.builtin.checkInt(b))throw new Sk.builtin.TypeError("'"+Sk.abstr.typeName(b)+"' object cannot be interpreted as an integer");try{return Sk.builtin.len(a)}catch(a){if(!(a instanceof Sk.builtin.TypeError))throw a}const c=Sk.abstr.lookupSpecial(a,Sk.builtin.str.$length_hint);if(void 0!==c){const a=Sk.misceval.callsimArray(c,[]);if(a===Sk.builtin.NotImplemented.NotImplemented$)return b;if(!Sk.builtin.checkInteger(a))throw new Sk.builtin.TypeError("__length_hint__ must be an integer, not "+Sk.abstr.typeName(a));else if(a.nb$isnegative())throw new Sk.builtin.TypeError("__length_hint__() should return >= 0");return a}return b},$flags:{MinArgs:1,MaxArgs:2},$textsig:"($module, obj, default=0, /)",$doc:"Return an estimate of the number of items in obj.\\n\\nThis is useful for presizing containers when building from an iterable.\\n\\nIf the object supports len(), the result will be exact.\\nOtherwise, it may over- or under-estimate by an arbitrary amount.\\nThe result will be an integer >= 0."},iadd:{$meth:function iadd(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Add")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a += b."},iand:{$meth:function iand(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"BitAnd")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a &= b."},iconcat:{$meth:function iconcat(c,a){if(void 0!==c.sq$inplace_concat)return c.sq$inplace_concat(a);if(void 0!==c.sq$concat)return c.sq$concat(a);if(!Sk.builtin.checkSequence(c)||!Sk.builtin.checkSequence(a))throw new Sk.builtin.TypeError(Sk.abstr.typeName(c)+" object can't be concatenated");return Sk.abstr.numberInplaceBinOp(c,a,"Add")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a += b, for a and b sequences."},ifloordiv:{$meth:function ifloordiv(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"FloorDiv")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a //= b."},ilshift:{$meth:function ilshift(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"LShift")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a <<= b."},imod:{$meth:function imod(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Mod")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a %= b."},imul:{$meth:function imul(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Mult")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a *= b."},imatmul:{$meth:function imatmul(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"MatMult")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a @= b."},ior:{$meth:function ior(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"BitOr")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a |= b."},ipow:{$meth:function ipow(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Pow")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a **= b."},irshift:{$meth:function irshift(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"LRhift")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a >>= b."},isub:{$meth:function isub(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Sub")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a -= b."},itruediv:{$meth:function idiv(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"Div")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a /= b."},ixor:{$meth:function ixor(c,a){return Sk.abstr.numberInplaceBinOp(c,a,"BitXor")},$flags:{MinArgs:2,MaxArgs:2},$textsig:"($module, a, b, /)",$doc:"Same as a ^= b."}}),Object.assign(operator,{__abs__:operator.abs,__add__:operator.add,__and__:operator.and,__concat__:operator.concat,__contains__:operator.contains,__delitem__:operator.delitem,__eq__:operator.eq,__floordiv__:operator.floordiv,__ge__:operator.ge,__getitem__:operator.getitem,__gt__:operator.gt,__iadd__:operator.iadd,__iand__:operator.iand,__iconcat__:operator.iconcat,__ifloordiv__:operator.ifloordiv,__ilshift__:operator.ilshift,__imatmul__:operator.imatmul,__imod__:operator.imod,__imul__:operator.imul,__index__:operator.index,__inv__:operator.inv,__invert__:operator.invert,__ior__:operator.ior,__ipow__:operator.ipow,__irshift__:operator.irshift,__isub__:operator.isub,__itruediv__:operator.itruediv,__ixor__:operator.ixor,__le__:operator.le,__lshift__:operator.lshift,__lt__:operator.lt,__matmul__:operator.matmul,__mod__:operator.mod,__mul__:operator.mul,__ne__:operator.ne,__neg__:operator.neg,__not__:operator.not,__or__:operator.or,__pos__:operator.pos,__pow__:operator.pow,__rshift__:operator.rshift,__setitem__:operator.setitem,__sub__:operator.sub,__truediv__:operator.truediv,__xor__:operator.xor,_abs:Sk.builtins.abs,div:operator.truediv,__div__:operator.truediv}),operator}`,"src/lib/optparse.py":`raise NotImplementedError("optparse is not yet implemented in Skulpt")
`,"src/lib/os.py":`raise NotImplementedError("os is not yet implemented in Skulpt")
`,"src/lib/os2emxpath.py":`raise NotImplementedError("os2emxpath is not yet implemented in Skulpt")
`,"src/lib/pdb.py":`raise NotImplementedError("pdb is not yet implemented in Skulpt")
`,"src/lib/pickle.py":`raise NotImplementedError("pickle is not yet implemented in Skulpt")
`,"src/lib/pickletools.py":`raise NotImplementedError("pickletools is not yet implemented in Skulpt")
`,"src/lib/pipes.py":`raise NotImplementedError("pipes is not yet implemented in Skulpt")
`,"src/lib/pkgutil.py":`raise NotImplementedError("pkgutil is not yet implemented in Skulpt")
`,"src/lib/platform.js":'var $builtinmodule=function(){var a={},b="undefined"!=typeof window&&"undefined"!=typeof window.navigator;return a.python_implementation=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("python_implementation",arguments.length,0,0),new Sk.builtin.str("Skulpt")}),a.node=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("node",arguments.length,0,0),new Sk.builtin.str("")}),a.version=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("version",arguments.length,0,0),new Sk.builtin.str("")}),a.python_version=new Sk.builtin.func(function(){var a;return Sk.builtin.pyCheckArgsLen("python_version",arguments.length,0,0),a=Sk.__future__.python_version?"3.2.0":"2.7.0",new Sk.builtin.str(a)}),a.system=new Sk.builtin.func(function(){var a;return Sk.builtin.pyCheckArgsLen("system",arguments.length,0,0),a=b?window.navigator.appCodeName:"",new Sk.builtin.str(a)}),a.machine=new Sk.builtin.func(function(){var a;return Sk.builtin.pyCheckArgsLen("machine",arguments.length,0,0),a=b?window.navigator.platform:"",new Sk.builtin.str(a)}),a.release=new Sk.builtin.func(function(){var a;return Sk.builtin.pyCheckArgsLen("release",arguments.length,0,0),a=b?window.navigator.appVersion:"",new Sk.builtin.str(a)}),a.architecture=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("architecture",arguments.length,0,0),new Sk.builtin.tuple([new Sk.builtin.str("64bit"),new Sk.builtin.str("")])}),a.processor=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("processor",arguments.length,0,0),new Sk.builtin.str("")}),a};',"src/lib/platform.py":`raise NotImplementedError("platform is not yet implemented in Skulpt")
`,"src/lib/plistlib.py":`raise NotImplementedError("plistlib is not yet implemented in Skulpt")
`,"src/lib/popen2.py":`raise NotImplementedError("popen2 is not yet implemented in Skulpt")
`,"src/lib/poplib.py":`raise NotImplementedError("poplib is not yet implemented in Skulpt")
`,"src/lib/posixfile.py":`raise NotImplementedError("posixfile is not yet implemented in Skulpt")
`,"src/lib/posixpath.py":`raise NotImplementedError("posixpath is not yet implemented in Skulpt")
`,"src/lib/pprint.py":`raise NotImplementedError("pprint is not yet implemented in Skulpt")
`,"src/lib/processing.js":`var $builtinmodule=function(){var b,c,d,e,f,g,h,a=Math.PI,j={__name__:new Sk.builtin.str("processing")},k=[],l=!0,m=null;return j.processing=null,j.p=null,j.X=new Sk.builtin.int_(0),j.Y=new Sk.builtin.int_(1),j.Z=new Sk.builtin.int_(2),j.R=new Sk.builtin.int_(3),j.G=new Sk.builtin.int_(4),j.B=new Sk.builtin.int_(5),j.A=new Sk.builtin.int_(6),j.U=new Sk.builtin.int_(7),j.V=new Sk.builtin.int_(8),j.NX=new Sk.builtin.int_(9),j.NY=new Sk.builtin.int_(10),j.NZ=new Sk.builtin.int_(11),j.EDGE=new Sk.builtin.int_(12),j.SR=new Sk.builtin.int_(13),j.SG=new Sk.builtin.int_(14),j.SB=new Sk.builtin.int_(15),j.SA=new Sk.builtin.int_(16),j.SW=new Sk.builtin.int_(17),j.TX=new Sk.builtin.int_(18),j.TY=new Sk.builtin.int_(19),j.TZ=new Sk.builtin.int_(20),j.VX=new Sk.builtin.int_(21),j.VY=new Sk.builtin.int_(22),j.VZ=new Sk.builtin.int_(23),j.VW=new Sk.builtin.int_(24),j.AR=new Sk.builtin.int_(25),j.AG=new Sk.builtin.int_(26),j.AB=new Sk.builtin.int_(27),j.DR=new Sk.builtin.int_(3),j.DG=new Sk.builtin.int_(4),j.DB=new Sk.builtin.int_(5),j.DA=new Sk.builtin.int_(6),j.SPR=new Sk.builtin.int_(28),j.SPG=new Sk.builtin.int_(29),j.SPB=new Sk.builtin.int_(30),j.SHINE=new Sk.builtin.int_(31),j.ER=new Sk.builtin.int_(32),j.EG=new Sk.builtin.int_(33),j.EB=new Sk.builtin.int_(34),j.BEEN_LIT=new Sk.builtin.int_(35),j.VERTEX_FIELD_COUNT=new Sk.builtin.int_(36),j.CENTER=new Sk.builtin.int_(3),j.RADIUS=new Sk.builtin.int_(2),j.CORNERS=new Sk.builtin.int_(1),j.CORNER=new Sk.builtin.int_(0),j.DIAMETER=new Sk.builtin.int_(3),j.BASELINE=new Sk.builtin.int_(0),j.TOP=new Sk.builtin.int_(101),j.BOTTOM=new Sk.builtin.int_(102),j.NORMAL=new Sk.builtin.int_(1),j.NORMALIZED=new Sk.builtin.int_(1),j.IMAGE=new Sk.builtin.int_(2),j.MODEL=new Sk.builtin.int_(4),j.SHAPE=new Sk.builtin.int_(5),j.AMBIENT=new Sk.builtin.int_(0),j.DIRECTIONAL=new Sk.builtin.int_(1),j.SPOT=new Sk.builtin.int_(3),j.RGB=new Sk.builtin.int_(1),j.ARGB=new Sk.builtin.int_(2),j.HSB=new Sk.builtin.int_(3),j.ALPHA=new Sk.builtin.int_(4),j.CMYK=new Sk.builtin.int_(5),j.TIFF=new Sk.builtin.int_(0),j.TARGA=new Sk.builtin.int_(1),j.JPEG=new Sk.builtin.int_(2),j.GIF=new Sk.builtin.int_(3),j.MITER=new Sk.builtin.str("miter"),j.BEVEL=new Sk.builtin.str("bevel"),j.ROUND=new Sk.builtin.str("round"),j.SQUARE=new Sk.builtin.str("butt"),j.PROJECT=new Sk.builtin.str("square"),j.P2D=new Sk.builtin.int_(1),j.JAVA2D=new Sk.builtin.int_(1),j.WEBGL=new Sk.builtin.int_(2),j.P3D=new Sk.builtin.int_(2),j.OPENGL=new Sk.builtin.int_(2),j.PDF=new Sk.builtin.int_(0),j.DXF=new Sk.builtin.int_(0),j.OTHER=new Sk.builtin.int_(0),j.WINDOWS=new Sk.builtin.int_(1),j.MAXOSX=new Sk.builtin.int_(2),j.LINUX=new Sk.builtin.int_(3),j.EPSILON=new Sk.builtin.float_(1e-4),j.MAX_FLOAT=new Sk.builtin.float_(34028235e31),j.MIN_FLOAT=new Sk.builtin.float_(-34028235e31),j.MAX_INT=new Sk.builtin.int_(2147483647),j.MIN_INT=new Sk.builtin.int_(-2147483648),j.HALF_PI=new Sk.builtin.float_(a/2),j.THIRD_PI=new Sk.builtin.float_(a/3),j.PI=new Sk.builtin.float_(a),j.TWO_PI=new Sk.builtin.float_(2*a),j.TAU=new Sk.builtin.float_(2*a),j.QUARTER_PI=new Sk.builtin.float_(a/4),j.DEG_TO_RAD=new Sk.builtin.float_(a/180),j.RAD_TO_DEG=new Sk.builtin.float_(180/a),j.WHITESPACE=new Sk.builtin.str(" \\t\\n\\r\\f\\xA0"),j.POINT=new Sk.builtin.int_(2),j.POINTS=new Sk.builtin.int_(2),j.LINE=new Sk.builtin.int_(4),j.LINES=new Sk.builtin.int_(4),j.TRIANGLE=new Sk.builtin.int_(8),j.TRIANGLES=new Sk.builtin.int_(9),j.TRIANGLE_FAN=new Sk.builtin.int_(11),j.TRIANGLE_STRIP=new Sk.builtin.int_(10),j.QUAD=new Sk.builtin.int_(16),j.QUADS=new Sk.builtin.int_(16),j.QUAD_STRIP=new Sk.builtin.int_(17),j.POLYGON=new Sk.builtin.int_(20),j.PATH=new Sk.builtin.int_(21),j.RECT=new Sk.builtin.int_(30),j.ELLIPSE=new Sk.builtin.int_(31),j.ARC=new Sk.builtin.int_(32),j.SPHERE=new Sk.builtin.int_(40),j.BOX=new Sk.builtin.int_(41),j.GROUP=new Sk.builtin.int_(0),j.PRIMITIVE=new Sk.builtin.int_(1),j.GEOMETRY=new Sk.builtin.int_(3),j.VERTEX=new Sk.builtin.int_(0),j.BEZIER_VERTEX=new Sk.builtin.int_(1),j.CURVE_VERTEX=new Sk.builtin.int_(2),j.BREAK=new Sk.builtin.int_(3),j.CLOSESHAPE=new Sk.builtin.int_(4),j.REPLACE=new Sk.builtin.int_(0),j.BLEND=new Sk.builtin.int_(1),j.ADD=new Sk.builtin.int_(2),j.SUBTRACT=new Sk.builtin.int_(4),j.LIGHTEST=new Sk.builtin.int_(8),j.DARKEST=new Sk.builtin.int_(16),j.DIFFERENCE=new Sk.builtin.int_(32),j.EXCLUSION=new Sk.builtin.int_(64),j.MULTIPLY=new Sk.builtin.int_(128),j.SCREEN=new Sk.builtin.int_(256),j.OVERLAY=new Sk.builtin.int_(512),j.HARD_LIGHT=new Sk.builtin.int_(1024),j.SOFT_LIGHT=new Sk.builtin.int_(2048),j.DODGE=new Sk.builtin.int_(4096),j.BURN=new Sk.builtin.int_(8192),j.ALPHA_MASK=new Sk.builtin.int_(4278190080),j.RED_MASK=new Sk.builtin.int_(16711680),j.GREEN_MASK=new Sk.builtin.int_(65280),j.BLUE_MASK=new Sk.builtin.int_(255),j.CUSTOM=new Sk.builtin.int_(0),j.ORTHOGRAPHIC=new Sk.builtin.int_(2),j.PERSPECTIVE=new Sk.builtin.int_(3),j.ARROW=new Sk.builtin.str("default"),j.CROSS=new Sk.builtin.str("crosshair"),j.HAND=new Sk.builtin.str("pointer"),j.MOVE=new Sk.builtin.str("move"),j.TEXT=new Sk.builtin.str("text"),j.WAIT=new Sk.builtin.str("wait"),j.NOCURSOR=Sk.builtin.assk$("url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), auto"),j.DISABLE_OPENGL_2X_SMOOTH=new Sk.builtin.int_(1),j.ENABLE_OPENGL_2X_SMOOTH=new Sk.builtin.int_(-1),j.ENABLE_OPENGL_4X_SMOOTH=new Sk.builtin.int_(2),j.ENABLE_NATIVE_FONTS=new Sk.builtin.int_(3),j.DISABLE_DEPTH_TEST=new Sk.builtin.int_(4),j.ENABLE_DEPTH_TEST=new Sk.builtin.int_(-4),j.ENABLE_DEPTH_SORT=new Sk.builtin.int_(5),j.DISABLE_DEPTH_SORT=new Sk.builtin.int_(-5),j.DISABLE_OPENGL_ERROR_REPORT=new Sk.builtin.int_(6),j.ENABLE_OPENGL_ERROR_REPORT=new Sk.builtin.int_(-6),j.ENABLE_ACCURATE_TEXTURES=new Sk.builtin.int_(7),j.DISABLE_ACCURATE_TEXTURES=new Sk.builtin.int_(-7),j.HINT_COUNT=new Sk.builtin.int_(10),j.OPEN=new Sk.builtin.int_(1),j.CLOSE=new Sk.builtin.int_(2),j.BLUR=new Sk.builtin.int_(11),j.GRAY=new Sk.builtin.int_(12),j.INVERT=new Sk.builtin.int_(13),j.OPAQUE=new Sk.builtin.int_(14),j.POSTERIZE=new Sk.builtin.int_(15),j.THRESHOLD=new Sk.builtin.int_(16),j.ERODE=new Sk.builtin.int_(17),j.DILATE=new Sk.builtin.int_(18),j.BACKSPACE=new Sk.builtin.int_(8),j.TAB=new Sk.builtin.int_(9),j.ENTER=new Sk.builtin.int_(10),j.RETURN=new Sk.builtin.int_(13),j.ESC=new Sk.builtin.int_(27),j.DELETE=new Sk.builtin.int_(127),j.CODED=new Sk.builtin.int_(65535),j.SHIFT=new Sk.builtin.int_(16),j.CONTROL=new Sk.builtin.int_(17),j.ALT=new Sk.builtin.int_(18),j.CAPSLK=new Sk.builtin.int_(20),j.PGUP=new Sk.builtin.int_(33),j.PGDN=new Sk.builtin.int_(34),j.END=new Sk.builtin.int_(35),j.HOME=new Sk.builtin.int_(36),j.LEFT=new Sk.builtin.int_(37),j.UP=new Sk.builtin.int_(38),j.RIGHT=new Sk.builtin.int_(39),j.DOWN=new Sk.builtin.int_(40),j.F1=new Sk.builtin.int_(112),j.F2=new Sk.builtin.int_(113),j.F3=new Sk.builtin.int_(114),j.F4=new Sk.builtin.int_(115),j.F5=new Sk.builtin.int_(116),j.F6=new Sk.builtin.int_(117),j.F7=new Sk.builtin.int_(118),j.F8=new Sk.builtin.int_(119),j.F9=new Sk.builtin.int_(120),j.F10=new Sk.builtin.int_(121),j.F11=new Sk.builtin.int_(122),j.F12=new Sk.builtin.int_(123),j.NUMLK=new Sk.builtin.int_(144),j.META=new Sk.builtin.int_(157),j.INSERT=new Sk.builtin.int_(155),j.SINCOS_LENGTH=new Sk.builtin.int_(720),j.PRECISIONB=new Sk.builtin.int_(15),j.PRECISIONF=new Sk.builtin.int_(32768),j.PREC_MAXVAL=new Sk.builtin.int_(32767),j.PREC_ALPHA_SHIFT=new Sk.builtin.int_(9),j.PREC_RED_SHIFT=new Sk.builtin.int_(1),j.NORMAL_MODE_AUTO=new Sk.builtin.int_(0),j.NORMAL_MODE_SHAPE=new Sk.builtin.int_(1),j.NORMAL_MODE_VERTEX=new Sk.builtin.int_(2),j.MAX_LIGHTS=new Sk.builtin.int_(8),j.line=new Sk.builtin.func(function(a,b,c,d){j.processing.line(a.v,b.v,c.v,d.v)}),j.ellipse=new Sk.builtin.func(function(a,b,c,d){j.processing.ellipse(a.v,b.v,c.v,d.v)}),j.text=new Sk.builtin.func(function(a,b,c){j.processing.text(a.v,b.v,c.v)}),j.point=new Sk.builtin.func(function(a,b){j.processing.point(a.v,b.v)}),j.arc=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.arc(a.v,b.v,c.v,d.v,e.v,f.v)}),j.quad=new Sk.builtin.func(function(a,b,c,d,e,f,g,h){j.processing.quad(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v)}),j.rect=new Sk.builtin.func(function(a,b,c,d,e){"undefined"==typeof e?j.processing.rect(a.v,b.v,c.v,d.v):j.processing.rect(a.v,b.v,c.v,d.v,e.v)}),j.triangle=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.triangle(a.v,b.v,c.v,d.v,e.v,f.v)}),j.bezier=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i,k,l,m){"undefined"==typeof i?j.processing.bezier(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v):j.processing.bezier(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v,k.v,l.v,m.v)}),j.alpha=new Sk.builtin.func(function(a,c,d){return"undefined"==typeof c?new Sk.builtin.float_(j.processing.alpha(a.v)):"undefined"==typeof d?new Sk.builtin.float_(j.processing.alpha(a.v,c.v)):new Sk.builtin.float_(j.processing.alpha(a.v,c.v,d.v))}),j.ambient=new Sk.builtin.func(function(a,c,d){"undefined"==typeof c?j.processing.ambient(a.v):"undefined"==typeof d?j.processing.ambient(a.v,c.v):j.processing.ambient(a.v,c.v,d.v)}),j.ambientLight=new Sk.builtin.func(function(a,b,c,d,e,f){"undefined"==typeof d?j.processing.ambientLight(a.v,b.v,c.v):"undefined"==typeof e?j.processing.ambientLight(a.v,b.v,c.v,d.v):"undefined"==typeof f?j.processing.ambientLight(a.v,b.v,c.v,d.v,e.v):j.processing.ambientLight(a.v,b.v,c.v,d.v,e.v,f.v)}),j.beginCamera=new Sk.builtin.func(function(){j.processing.beginCamera()}),j.beginShape=new Sk.builtin.func(function(a){"undefined"==typeof a&&(a=j.POLYGON),j.processing.beginShape(a.v)}),j.bezierDetail=new Sk.builtin.func(function(a){a="undefined"==typeof a?20:a.v,j.processing.bezierDetail(a)}),j.bezierPoint=new Sk.builtin.func(function(e,a,b,c,d){j.processing.bezierPoint(e.v,a.v,b.v,c.v,d.v)}),j.bezierTangent=new Sk.builtin.func(function(e,a,b,c,d){j.processing.bezierTangent(e.v,a.v,b.v,c.v,d.v)}),j.bezierVertex=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i){"undefined"==typeof g?j.processing.bezierVertex(a.v,b.v,c.v,d.v,e.v,f.v):"undefined"==typeof h?j.processing.bezierVertex(a.v,b.v,c.v,d.v,e.v,f.v,g.v):"undefined"==typeof i?j.processing.bezierVertex(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v):j.processing.bezierVertex(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v)}),j.blend=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i,k){other instanceof Sk.builtin.int_||other instanceof Sk.builtin.float_?j.processing.blend(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v):j.processing.blend(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v,k.v)}),j.blendColor=new Sk.builtin.func(function(a,b,d){var e=Sk.misceval.callsimArray(j.color,[new Sk.builtin.int_(0),new Sk.builtin.int_(0),new Sk.builtin.int_(0)]);return e.v=j.processing.blendColor(a.v,b.v,d.v),e}),j.brightness=new Sk.builtin.func(function(a,c,d){return"undefined"==typeof c?new Sk.builtin.float_(j.processing.brightness(a.v)):"undefined"==typeof d?new Sk.builtin.float_(j.processing.brightness(a.v,c.v)):new Sk.builtin.float_(j.processing.brightness(a.v,c.v,d.v))}),j.camera=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i){"undefined"==typeof a?j.processing.camera():j.processing.camera(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v)}),j.constrain=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.constrain(a.v,b.v,c.v))}),j.copy=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i){other instanceof Sk.builtin.int_||other instanceof Sk.builtin.float_?j.processing.copy(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v):j.processing.copy(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v)}),j.createFont=new Sk.builtin.func(function(a,b,c,d){var e=Sk.misceval.callsimArray(j.PFont);return e.v="undefined"==typeof c?j.processing.createFont(a.v,b.v):"undefined"==typeof d?j.processing.createFont(a.v,b.v,c.v):j.processing.createFont(a.v,b.v,c.v,d.v),e}),j.createGraphics=new Sk.builtin.func(function(a,b,c,d){var e=Sk.misceval.callsimArray(j.PGraphics);return e.v="undefined"==typeof d?j.processing.createGraphics(a.v,b.v,c.v):j.processing.createGraphics(a.v,b.v,c.v,d.v),e}),j.createImage=new Sk.builtin.func(function(a,b,c){var d=Sk.misceval.callsimArray(j.PImage);return d.v=j.processing.createImage(a.v,b.v,c.v),d}),j.cursor=new Sk.builtin.func(function(a,b,c){"undefined"==typeof a?j.processing.cursor():"undefined"==typeof b?j.processing.cursor(a.v):"undefined"==typeof c?j.processing.cursor(a.v,b.v):j.processing.cursor(a.v,b.v,c.v)}),j.curve=new Sk.builtin.func(function(a,b,c,d,e,f,g,h,i,k,l,m){"undefined"==typeof i?j.processing.curve(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v):"undefined"==typeof k?j.processing.curve(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v):"undefined"==typeof l?j.processing.curve(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v,k.v):"undefined"==typeof m?j.processing.curve(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v,k.v,l.v):j.processing.curve(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v,i.v,k.v,l.v,m.v)}),j.curveDetail=new Sk.builtin.func(function(a){j.processing.curveDetail(a.v)}),j.curvePoint=new Sk.builtin.func(function(e,a,b,c,d){j.processing.curvePoint(e.v,a.v,b.v,c.v,d.v)}),j.curveTangent=new Sk.builtin.func(function(e,a,b,c,d){j.processing.curveTangent(e.v,a.v,b.v,c.v,d.v)}),j.curveTightness=new Sk.builtin.func(function(a){j.processing.curveTightness(a.v)}),j.curveVertex=new Sk.builtin.func(function(a,b,c){"undefined"==typeof c?j.processing.curveVertex(a.v,b.v):j.processing.curveVertex(a.v,b.v,c.v)}),j.day=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.day())}),j.degrees=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.degrees(a.v))}),j.directionalLight=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.directionalLight(a.v,b.v,c.v,d.v,e.v,f.v)}),j.dist=new Sk.builtin.func(function(a,b,c,d,e,f){return"undefined"==typeof e?new Sk.builtin.float_(j.processing.dist(a.v,b.v,c.v,d.v)):"undefined"==typeof f?new Sk.builtin.float_(j.processing.dist(a.v,b.v,c.v,d.v,e.v)):new Sk.builtin.float_(j.processing.dist(a.v,b.v,c.v,d.v,e.v,f.v))}),j.emissive=new Sk.builtin.func(function(a,b,c){"undefined"==typeof b?j.processing.emissive(a.v):"undefined"==typeof c?j.processing.emissive(a.v,b.v):j.processing.emissive(a.v,b.v,c.v)}),j.endCamera=new Sk.builtin.func(function(){j.processing.endCamera()}),j.endShape=new Sk.builtin.func(function(a){"undefined"==typeof a?j.processing.endShape():j.processing.endShape(a.v)}),j.filter=new Sk.builtin.func(function(a,b){"undefined"==typeof b?j.processing.filter(a.v):j.processing.filter(a.v,b.v)}),j.frustum=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.frustum(a,b,c,d,e,f)}),j.hint=new Sk.builtin.func(function(a){j.processing.hint(a)}),j.hour=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.hour())}),j.hue=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.hue(a.v))}),j.imageMode=new Sk.builtin.func(function(a){j.processing.imageMode(a.v)}),j.lerp=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.lerp(a.v,b.v,c.v))}),j.lerpColor=new Sk.builtin.func(function(a,b,d){var e=Sk.misceval.callsimArray(j.color,[new Sk.builtin.int_(0),new Sk.builtin.int_(0),new Sk.builtin.int_(0)]);return e.v=j.processing.lerpColor(a.v,b.v,d.v),e}),j.lightFalloff=new Sk.builtin.func(function(a,b,c){j.processing.lightFalloff(a.v,b.v,c.v)}),j.lights=new Sk.builtin.func(function(){j.processing.lights()}),j.lightSpecular=new Sk.builtin.func(function(a,b,c){j.processing.lightSpecular(a.v,b.v,c.v)}),j.loadBytes=new Sk.builtin.func(function(a){return new Sk.builtin.list(j.processing.loadBytes(a.v))}),j.loadFont=new Sk.builtin.func(function(a){var b=Sk.misceval.callsimArray(j.PFont);return b.v=j.processing.loadFont(a.v),b}),j.loadShape=new Sk.builtin.func(function(a){var b=Sk.misceval.callsimArray(j.PShapeSVG,[new Sk.builtin.str("string"),a]);return b}),j.loadStrings=new Sk.builtin.func(function(a){return new Sk.builtin.list(j.processing.loadStrings(a.v))}),j.mag=new Sk.builtin.func(function(d,a,b){return"undefined"==typeof b?new Sk.builtin.float_(j.processing.mag(d.v,a.v)):new Sk.builtin.float_(j.processing.mag(d.v,a.v,b.v))}),j.map=new Sk.builtin.func(function(a,b,c,d,e){return new Sk.builtin.float_(j.processing.map(a.v,b.v,c.v,d.v,e.v))}),j.millis=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.millis())}),j.minute=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.minute())}),j.modelX=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.modelX(a.v,b.v,c.v))}),j.modelY=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.modelY(a.v,b.v,c.v))}),j.modelZ=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.modelZ(a.v,b.v,c.v))}),j.month=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.month())}),j.noCursor=new Sk.builtin.func(function(){j.processing.noCursor()}),j.noise=new Sk.builtin.func(function(a,b,c){return"undefined"==typeof b?new Sk.builtin.float_(j.processing.noise(a.v)):"undefined"==typeof c?new Sk.builtin.float_(j.processing.noise(a.v,b.v)):new Sk.builtin.float_(j.processing.noise(a.v,b.v,c.v))}),j.noiseDetail=new Sk.builtin.func(function(a,b){j.processing.noiseDetail(a.v,b.v)}),j.noiseSeed=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.noiseSeed(a.v))}),j.noLights=new Sk.builtin.func(function(){j.processing.noLights()}),j.norm=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.norm(a.v,b.v,c.v))}),j.normal=new Sk.builtin.func(function(a,b,c){j.processing.normal(a.v,b.v,c.v)}),j.noTint=new Sk.builtin.func(function(){j.processing.noTint()}),j.ortho=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.ortho(a.v,b.v,c.v,d.v,e.v,f.v)}),j.perspective=new Sk.builtin.func(function(a,b,c,d){"undefined"==typeof a?j.processing.perspective():"undefined"==typeof b?j.processing.perspective(a.v):"undefined"==typeof c?j.processing.perspective(a.v,b.v):"undefined"==typeof d?j.processing.perspective(a.v,b.v,c.v):j.processing.perspective(a.v,b.v,c.v,d.v)}),j.pointLight=new Sk.builtin.func(function(a,b,c,d,e,f){j.processing.pointLight(a.v,b.v,c.v,d.v,e.v,f.v)}),j.printCamera=new Sk.builtin.func(function(){j.processing.printCamera()}),j.println=new Sk.builtin.func(function(a){j.processing.println(a.v)}),j.printProjection=new Sk.builtin.func(function(){j.processing.printProjection()}),j.radians=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.radians(a.v))}),j.randomSeed=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.randomSeed(a.v))}),j.random=new Sk.builtin.func(function(a,b){return"undefined"==typeof a?new Sk.builtin.float_(j.processing.random()):"undefined"==typeof b?new Sk.builtin.float_(j.processing.random(a.v)):new Sk.builtin.float_(j.processing.random(a.v,b.v))}),j.requestImage=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PImage);return c.v="undefined"==typeof b?j.processing.requestImage(a.v):j.processing.requestImage(a.v,b.v),c}),j.saturation=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.saturation(a.v))}),j.save=new Sk.builtin.func(function(a){j.processing.save(a.v)}),j.saveFrame=new Sk.builtin.func(function(a){"undefined"==typeof a?j.processing.saveFrame():j.processing.saveFrame(a.v)}),j.saveStrings=new Sk.builtin.func(function(a,b){j.processing.saveStrings(a.v,b.v)}),j.screenX=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.screenX(a.v,b.v,c.v))}),j.screenY=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.screenY(a.v,b.v,c.v))}),j.screenZ=new Sk.builtin.func(function(a,b,c){return new Sk.builtin.float_(j.processing.screenZ(a.v,b.v,c.v))}),j.second=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.second())}),j.shape=new Sk.builtin.func(function(a,b,c,d,e){"undefined"==typeof b?j.processing.shape(a.v):"undefined"==typeof c?j.processing.shape(a.v,b.v):"undefined"==typeof d?j.processing.shape(a.v,b.v,c.v):"undefined"==typeof e?j.processing.shape(a.v,b.v,c.v,d.v):j.processing.shape(a.v,b.v,c.v,d.v,e.v)}),j.shapeMode=new Sk.builtin.func(function(a){j.processing.shapeMode(a.v)}),j.shininess=new Sk.builtin.func(function(a){j.processing.shininess(a.v)}),j.specular=new Sk.builtin.func(function(a,b,c){"undefined"==typeof b?j.processing.specular(a.v):"undefined"==typeof c?j.processing.specular(a.v,b.v):j.processing.specular(a.v,b.v,c.v)}),j.spotLight=new Sk.builtin.func(function(a,b,c,d,e,f,g,h){j.processing.spotLight(a.v,b.v,c.v,d.v,e.v,f.v,g.v,h.v)}),j.sq=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.sq(a))}),j.status=new Sk.builtin.func(function(a){j.processing.status(a.v)}),j.textAlign=new Sk.builtin.func(function(a,b){"undefined"==typeof b?j.processing.textAlign(a.v):j.processing.textAlign(a.v,b.v)}),j.textAscent=new Sk.builtin.func(function(){return new Sk.builtin.float_(j.processing.textAscent())}),j.textDescent=new Sk.builtin.func(function(){return new Sk.builtin.float_(j.processing.textDescent())}),j.textFont=new Sk.builtin.func(function(a,b){"undefined"==typeof b?j.processing.textFont(a.v):j.processing.textFont(a.v,b.v)}),j.textLeading=new Sk.builtin.func(function(a){j.processing.textLeading(a.v)}),j.textMode=new Sk.builtin.func(function(a){j.processing.textMode(a.v)}),j.textSize=new Sk.builtin.func(function(a){j.processing.textSize(a.v)}),j.texture=new Sk.builtin.func(function(a){j.processing.texture(a.v)}),j.textureMode=new Sk.builtin.func(function(a){j.processing.textureMode(a.v)}),j.textWidth=new Sk.builtin.func(function(a){return new Sk.builtin.float_(j.processing.textWidth(a.v))}),j.tint=new Sk.builtin.func(function(a,b,c,d){"undefined"==typeof b?j.processing.tint(a.v):"undefined"==typeof c?j.processing.tint(a.v,b.v):"undefined"==typeof d?j.processing.tint(a.v,b.v,c.v):j.processing.tint(a.v,b.v,c.v,d.v)}),j.updatePixels=new Sk.builtin.func(function(){j.processing.updatePixels()}),j.vertex=new Sk.builtin.func(function(a,b,c,d,e){"undefined"==typeof c?j.processing.vertex(a.v,b.v):"undefined"==typeof d?j.processing.vertex(a.v,b.v,c.v):"undefined"==typeof e?j.processing.vertex(a.v,b.v,c.v,d.v):j.processing.vertex(a.v,b.v,c.v,d.v,e.v)}),j.year=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.year())}),j.box=new Sk.builtin.func(function(a){j.processing.box(a.v)}),j.sphere=new Sk.builtin.func(function(a){j.processing.sphere(a.v)}),j.sphereDetail=new Sk.builtin.func(function(a,b){"undefined"==typeof b?j.processing.sphereDetail(a.v):j.processing.sphereDetail(a.v,b.v)}),j.background=new Sk.builtin.func(function(a,c,d){"undefined"!=typeof c&&(c=c.v),"undefined"!=typeof d&&(d=d.v),j.processing.background(a.v,c,d)}),j.fill=new Sk.builtin.func(function(a,c,d,e){"undefined"!=typeof c&&(c=c.v),"undefined"!=typeof d&&(d=d.v),"undefined"!=typeof e&&(e=e.v),j.processing.fill(a.v,c,d,e)}),j.stroke=new Sk.builtin.func(function(a,c,d,e){"undefined"!=typeof c&&(c=c.v),"undefined"!=typeof d&&(d=d.v),"undefined"!=typeof e&&(e=e.v),j.processing.stroke(a.v,c,d,e)}),j.noStroke=new Sk.builtin.func(function(){j.processing.noStroke()}),j.colorMode=new Sk.builtin.func(function(a,b,c,d,e){b="undefined"==typeof b?255:b.v,"undefined"!=typeof c&&(c=c.v),"undefined"!=typeof d&&(d=d.v),"undefined"!=typeof e&&(e=e.v),j.processing.colorMode(a.v,b,c,d,e)}),j.noFill=new Sk.builtin.func(function(){j.processing.noFill()}),j.loop=new Sk.builtin.func(function(){if(null===j.processing)throw new Sk.builtin.Exception("loop() should be called after run()");l=!0,j.processing.loop()}),j.noLoop=new Sk.builtin.func(function(){if(null===j.processing)throw new Sk.builtin.Exception("noLoop() should be called after run()");l=!1,j.processing.noLoop()}),j.frameRate=new Sk.builtin.func(function(a){j.processing.frameRate(a.v)}),j.width=new Sk.builtin.int_(0),j.height=new Sk.builtin.int_(0),j.renderMode=j.P2D,j.size=new Sk.builtin.func(function(a,b,c){"undefined"==typeof c&&(c=j.P2D),j.processing.size(a.v,b.v,c.v),j.width=new Sk.builtin.int_(j.processing.width),j.height=new Sk.builtin.int_(j.processing.height),j.renderMode=c}),j.exitp=new Sk.builtin.func(function(){j.processing.exit()}),j.mouseX=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.mouseX)}),j.mouseY=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.mouseY)}),j.pmouseX=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.pmouseX)}),j.pmouseY=new Sk.builtin.func(function(){return new Sk.builtin.int_(j.processing.pmouseY)}),j.rectMode=new Sk.builtin.func(function(a){j.processing.rectMode(a.v)}),j.strokeWeight=new Sk.builtin.func(function(a){j.processing.strokeWeight(a.v)}),j.smooth=new Sk.builtin.func(function(){j.processing.smooth()}),j.noSmooth=new Sk.builtin.func(function(){j.processing.noSmooth()}),j.ellipseMode=new Sk.builtin.func(function(a){j.processing.ellipseMode(a.v)}),j.strokeCap=new Sk.builtin.func(function(a){j.processing.strokeCap(a.v)}),j.strokeJoin=new Sk.builtin.func(function(a){j.processing.strokeJoin(a.v)}),j.rotate=new Sk.builtin.func(function(a){j.processing.rotate(a.v)}),j.rotateX=new Sk.builtin.func(function(a){j.processing.rotateX(a.v)}),j.rotateY=new Sk.builtin.func(function(a){j.processing.rotateY(a.v)}),j.rotateZ=new Sk.builtin.func(function(a){j.processing.rotateZ(a.v)}),j.scale=new Sk.builtin.func(function(a,b,c){b="undefined"==typeof b?1:b.v,c="undefined"==typeof c?1:c.v,j.processing.scale(a.v,b,c)}),j.translate=new Sk.builtin.func(function(a,b,c){b="undefined"==typeof b?1:b.v,c="undefined"==typeof c?1:c.v,j.processing.translate(a.v,b,c)}),j.popMatrix=new Sk.builtin.func(function(){j.processing.popMatrix()}),j.pushMatrix=new Sk.builtin.func(function(){j.processing.pushMatrix()}),j.applyMatrix=new Sk.builtin.func(function(){var a,b=Array.prototype.slice.call(arguments,0,16);for(a=0;a<b.length;a++)b[a]="undefined"==typeof b[a]?0:b[a].v;j.processing.applyMatrix.apply(j.processing,b)}),j.resetMatrix=new Sk.builtin.func(function(){j.processing.resetMatrix()}),j.printMatrix=new Sk.builtin.func(function(){return Sk.ffi.remapToPy(j.processing.printMatrix())}),j.run=new Sk.builtin.func(function(){var a=document.getElementById(Sk.canvas);if(!a)throw new Error("Processing module: Canvas element not specified");if(window.Processing.logger={log:function(a){Sk.misceval.print_(a)}},m=window.Processing.getInstanceById(Sk.canvas),m&&m.exit(),j.p=new window.Processing(a,function sketchProc(a){j.processing=a,a.draw=function(){var b=!1;for(var c in k)0===k[c].width&&(b=!0);if(!0==b)return!0===l?void 0:void a.loop();if(!1===l&&a.noLoop(),j.frameCount=a.frameCount,Sk.globals.draw)try{Sk.misceval.callsimArray(Sk.globals.draw)}catch(a){Sk.uncaughtException(a)}};var b=["setup","mouseMoved","mouseClicked","mouseDragged","mouseMoved","mouseOut","mouseOver","mousePressed","mouseReleased","keyPressed","keyReleased","keyTyped"];for(var c in b)Sk.globals[b[c]]&&(a[b[c]]=new Function("try {Sk.misceval.callsimArray(Sk.globals['"+b[c]+"']);} catch(e) {Sk.uncaughtException(e);}"))}),0===j.width.v&&0===j.height.v){var b=a.offsetWidth,c=a.offsetHeight;Sk.misceval.callsimArray(j.size,[new Sk.builtin.int_(b),new Sk.builtin.int_(c),j.renderMode])}}),g=function(a,b){b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"x"===b)?Sk.builtin.assk$(j.processing.mouseX):"y"===b?Sk.builtin.assk$(j.processing.mouseY):"px"===b?Sk.builtin.assk$(j.processing.pmouseX):"py"===b?Sk.builtin.assk$(j.processing.pmouseY):"pressed"===b?new Sk.builtin.bool(j.processing.__mousePressed):"button"===b?Sk.builtin.assk$(j.processing.mouseButton):void 0})},j.Mouse=Sk.misceval.buildClass(j,g,"Mouse",[]),j.mouse=Sk.misceval.callsimArray(j.Mouse),f=function(a,b){b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"key"===b)?new Sk.builtin.str(j.processing.key.toString()):"keyCode"===b?Sk.builtin.assk$(j.processing.keyCode):"keyPressed"===b?new Sk.builtin.str(j.processing.keyPressed):void 0})},j.Keyboard=Sk.misceval.buildClass(j,f,"Keyboard",[]),j.keyboard=Sk.misceval.callsimArray(j.Keyboard),e=function(a,b){b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"frameCount"===b)?Sk.builtin.assk$(j.processing.frameCount):"frameRate"===b?Sk.builtin.assk$(j.processing.frameRate):"height"===b?Sk.builtin.assk$(j.processing.height):"width"===b?Sk.builtin.assk$(j.processing.width):"online"===b?new Sk.builtin.bool(j.processing.online):"focused"===b?new Sk.builtin.bool(j.processing.focused):void 0})},j.Environment=Sk.misceval.buildClass(j,e,"Environment",[]),j.environment=Sk.misceval.callsimArray(j.Environment),d=function(a,b){b.__init__=new Sk.builtin.func(function(a){a.pixels=null}),b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"height"===b)?Sk.builtin.assk$(j.processing.height):"width"===b?Sk.builtin.assk$(j.processing.width):("pixels"===b&&null==a.pixels&&(a.pixels=new Sk.builtin.list(j.processing.pixels.toArray())),a.pixels)})},j.Screen=Sk.misceval.buildClass(j,d,"Screen",[]),j.screen=Sk.misceval.callsimArray(j.Screen),j.loadPixels=new Sk.builtin.func(function(){j.processing.loadPixels()}),c=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d,e){"undefined"!=typeof c&&(c=c.v),"undefined"!=typeof d&&(d=d.v),"undefined"!=typeof e&&(e=e.v),a.v=j.processing.color(b.v,c,d,e)})},j.color=Sk.misceval.buildClass(j,c,"color",[]),j.red=new Sk.builtin.func(function(a){return new Sk.builtin.int_(j.processing.red(a.v))}),j.green=new Sk.builtin.func(function(a){return new Sk.builtin.int_(j.processing.green(a.v))}),j.blue=new Sk.builtin.func(function(a){return new Sk.builtin.int_(j.processing.blue(a.v))}),b=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d){a.v="undefined"==typeof b?new j.processing.PImage:"undefined"==typeof c?new j.processing.PImage(b.v):"undefined"==typeof d?new j.processing.PImage(b.v,c.v):new j.processing.PImage(b.v,c.v,d.v)}),b.__getattr__=new Sk.builtin.func(function(a,b){return b=Sk.ffi.remapToJs(b),"width"===b?Sk.builtin.assk$(a.v.width):"height"===b?Sk.builtin.assk$(a.v.height):void 0})},j.loadImage=new Sk.builtin.func(function(a){var b=j.processing.loadImage(a.v);k.push(b);var c=Sk.misceval.callsimArray(j.PImage);return c.v=b,c}),j.image=new Sk.builtin.func(function(a,b,c,d,e){"undefined"==typeof d?j.processing.image(a.v,b.v,c.v):j.processing.image(a.v,b.v,c.v,d.v,e.v)}),j.get=new Sk.builtin.func(function(a,b){var c=j.processing.get(a.v,b.v);return Sk.misceval.callsimArray(j.color,[new Sk.builtin.int_(j.processing.red(c)),new Sk.builtin.int_(j.processing.green(c)),new Sk.builtin.int_(j.processing.blue(c))])}),j.set=new Sk.builtin.func(function(a,b,c){j.processing.set(a.v,b.v,c.v)}),h=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d){a.v="undefined"==typeof b?new j.processing.PVector:"undefined"==typeof d?new j.processing.PVector(b.v,c.v):new j.processing.PVector(b.v,c.v,d.v)}),b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"x"===b)?Sk.builtin.assk$(a.v.x):"y"===b?Sk.builtin.assk$(a.v.y):"z"===b?Sk.builtin.assk$(a.v.z):void 0}),b.get=new Sk.builtin.func(function(a){var b=Sk.misceval.callsimArray(j.PVector);return b.v=a.v.get(),b}),b.set=new Sk.builtin.func(function(a,b,c,d){"undefined"==typeof d?a.v.set(b.v,c.v):a.v.set(b.v,c.v,d.v)}),b.mag=new Sk.builtin.func(function(a){return Sk.builtin.assk$(a.v.mag())}),b.add=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PVector);return c.v=a.v.add(b.v),c}),b.sub=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PVector);return c.v=a.v.sub(b.v),c}),b.mult=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PVector);return c.v=a.v.mult(b.v),c}),b.div=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PVector);return c.v=a.v.div(b.v),c}),b.dist=new Sk.builtin.func(function(a,b){return Sk.builtin.assk$(a.v.dist(b.v))}),b.dot=new Sk.builtin.func(function(a,b,c,d){return"undefined"==typeof c?Sk.builtin.assk$(a.v.dot(b.v)):Sk.builtin.assk$(a.v.dot(b.v,c.v,d.v))}),b.cross=new Sk.builtin.func(function(a,b){var c=Sk.misceval.callsimArray(j.PVector);return c.v=a.v.cross(b.v),c}),b.normalize=new Sk.builtin.func(function(a){a.v.normalize()}),b.limit=new Sk.builtin.func(function(a,b){a.v.limit(b.v)}),b.angleBetween=new Sk.builtin.func(function(a,b){return Sk.builtin.assk$(a.v.angleBetween(b.v))}),b.array=new Sk.builtin.func(function(a){return new Sk.builtin.list(a.v.array())})},fontClass=function(a,b){b.__init__=new Sk.builtin.func(function(a,b){a.v="undefined"==typeof b?new j.processing.PFont:new j.processing.PVector(b.v)}),b.list=new Sk.builtin.func(function(a){return new Sk.builtin.list(a.v.list())})},graphicsClass=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d){a.v="undefined"==typeof b?new j.processing.PVector:"undefined"==typeof d?new j.processing.PVector(b.v,c.v):new j.processing.PVector(b.v,c.v,d.v)}),b.beginDraw=new Sk.builtin.func(function(a){a.v.beginDraw()}),b.endDraw=new Sk.builtin.func(function(a){a.v.endDraw()})},shapeClass=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d){a.v="undefined"==typeof b?null:"undefined"==typeof c?new j.processing.PShapeSVG(b.v):"undefined"==typeof d?new j.processing.PShapeSVG(b.v,c.v):new j.processing.PShapeSVG(b.v,c.v,d.v)}),b.__getattr__=new Sk.builtin.func(function(a,b){return(b=Sk.ffi.remapToJs(b),"width"===b)?Sk.builtin.assk$(a.v.width):"height"===b?Sk.builtin.assk$(a.v.height):void 0}),b.isVisible=new Sk.builtin.func(function(a){return new Sk.builtin.bool(a.v.isVisible())}),b.setVisible=new Sk.builtin.func(function(a,b){a.v.setVisible(b.v)}),b.disableStyle=new Sk.builtin.func(function(a){a.v.disableStyle()}),b.enableStyle=new Sk.builtin.func(function(a){a.v.enableStyle()}),b.getChild=new Sk.builtin.func(function(a,b){var c=a.v.getChild(b.v);if(null!=c){var d=Sk.misceval.callsimArray(j.PShapeSVG);return d.v=c,d}return null}),b.translate=new Sk.builtin.func(function(a,b,c,d){"undefined"==typeof d?a.v.translate(b.v,c.v):a.v.translate(b.v,c.v,d.v)}),b.rotate=new Sk.builtin.func(function(a,b){a.v.rotate(b.v)}),b.rotateX=new Sk.builtin.func(function(a,b){a.v.rotateX(b.v)}),b.rotateY=new Sk.builtin.func(function(a){a.v.rotateY(angle.v)}),b.rotateZ=new Sk.builtin.func(function(a){a.v.rotateZ(angle.v)}),b.scale=new Sk.builtin.func(function(a,b,c,d){"undefined"==typeof c?a.v.scale(b.v):"undefined"==typeof d?a.v.scale(b.v,c.v):a.v.scale(b.v,c.v,d.v)})},j.PFont=Sk.misceval.buildClass(j,fontClass,"PFont",[]),j.PGraphics=Sk.misceval.buildClass(j,graphicsClass,"PGraphics",[]),j.PShapeSVG=Sk.misceval.buildClass(j,shapeClass,"PShapeSVG",[]),j.PVector=Sk.misceval.buildClass(j,h,"PVector",[]),j.PImage=Sk.misceval.buildClass(j,b,"PImage",[]),j};`,"src/lib/profile.py":`raise NotImplementedError("profile is not yet implemented in Skulpt")
`,"src/lib/pstats.py":`raise NotImplementedError("pstats is not yet implemented in Skulpt")
`,"src/lib/pty.py":`raise NotImplementedError("pty is not yet implemented in Skulpt")
`,"src/lib/py_compile.py":`raise NotImplementedError("py_compile is not yet implemented in Skulpt")
`,"src/lib/pyclbr.py":`raise NotImplementedError("pyclbr is not yet implemented in Skulpt")
`,"src/lib/pydoc.py":`raise NotImplementedError("pydoc is not yet implemented in Skulpt")
`,"src/lib/pydoc_topics.py":`raise NotImplementedError("pydoc_topics is not yet implemented in Skulpt")
`,"src/lib/pythonds/__init__.py":"","src/lib/pythonds/basic/__init__.py":`
#__all__ = ["stack"]


#from .stack import Stack
#from .queue import Queue



`,"src/lib/pythonds/basic/deque.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 
#deque.py


class Deque:
    def __init__(self):
        self.items = []

    def isEmpty(self):
        return self.items == []

    def addFront(self, item):
        self.items.append(item)

    def addRear(self, item):
        self.items.insert(0,item)

    def removeFront(self):
        return self.items.pop()

    def removeRear(self):
        return self.items.pop(0)

    def size(self):
        return len(self.items)
`,"src/lib/pythonds/basic/queue.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 
#queue.py

class Queue:
    def __init__(self):
        self.items = []

    def isEmpty(self):
        return self.items == []

    def enqueue(self, item):
        self.items.insert(0,item)

    def dequeue(self):
        return self.items.pop()

    def size(self):
        return len(self.items)
`,"src/lib/pythonds/basic/stack.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 
#stack.py

class Stack:
    def __init__(self):
        self.items = []

    def isEmpty(self):
        return self.items == []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[len(self.items)-1]

    def size(self):
        return len(self.items)

`,"src/lib/pythonds/graphs/__init__.py":`

from .adjGraph import Graph
from .adjGraph import Vertex
from .priorityQueue import PriorityQueue
`,"src/lib/pythonds/graphs/adjGraph.py":`#
#  adjGraph
#
#  Created by Brad Miller on 2005-02-24.
#  Copyright (c) 2005 Brad Miller, David Ranum, Luther College. All rights reserved.
#

import sys
import os
import unittest

class Graph:
    def __init__(self):
        self.vertices = {}
        self.numVertices = 0
        
    def addVertex(self,key):
        self.numVertices = self.numVertices + 1
        newVertex = Vertex(key)
        self.vertices[key] = newVertex
        return newVertex
    
    def getVertex(self,n):
        if n in self.vertices:
            return self.vertices[n]
        else:
            return None

    def __contains__(self,n):
        return n in self.vertices
    
    def addEdge(self,f,t,cost=0):
            if f not in self.vertices:
                nv = self.addVertex(f)
            if t not in self.vertices:
                nv = self.addVertex(t)
            self.vertices[f].addNeighbor(self.vertices[t],cost)
    
    def getVertices(self):
        return list(self.vertices.keys())
        
    def __iter__(self):
        return iter(self.vertices.values())
                
class Vertex:
    def __init__(self,num):
        self.id = num
        self.connectedTo = {}
        self.color = 'white'
        self.dist = sys.maxsize
        self.pred = None
        self.disc = 0
        self.fin = 0

    # def __lt__(self,o):
    #     return self.id < o.id
    
    def addNeighbor(self,nbr,weight=0):
        self.connectedTo[nbr] = weight
        
    def setColor(self,color):
        self.color = color
        
    def setDistance(self,d):
        self.dist = d

    def setPred(self,p):
        self.pred = p

    def setDiscovery(self,dtime):
        self.disc = dtime
        
    def setFinish(self,ftime):
        self.fin = ftime
        
    def getFinish(self):
        return self.fin
        
    def getDiscovery(self):
        return self.disc
        
    def getPred(self):
        return self.pred
        
    def getDistance(self):
        return self.dist
        
    def getColor(self):
        return self.color
    
    def getConnections(self):
        return self.connectedTo.keys()
        
    def getWeight(self,nbr):
        return self.connectedTo[nbr]
                
    def __str__(self):
        return str(self.id) + ":color " + self.color + ":disc " + str(self.disc) + ":fin " + str(self.fin) + ":dist " + str(self.dist) + ":pred \\n\\t[" + str(self.pred)+ "]\\n"
    
    def getId(self):
        return self.id

class adjGraphTests(unittest.TestCase):
    def setUp(self):
        self.tGraph = Graph()
        
    def testMakeGraph(self):
        gFile = open("test.dat")
        for line in gFile:
            fVertex, tVertex = line.split('|')
            fVertex = int(fVertex)
            tVertex = int(tVertex)
            self.tGraph.addEdge(fVertex,tVertex)
        for i in self.tGraph:
            adj = i.getAdj()
            for k in adj:
                print(i, k)

        
if __name__ == '__main__':
    unittest.main()
              
`,"src/lib/pythonds/graphs/priorityQueue.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 
import unittest

# this implementation of binary heap takes key value pairs,
# we will assume that the keys are all comparable

class PriorityQueue:
    def __init__(self):
        self.heapArray = [(0,0)]
        self.currentSize = 0

    def buildHeap(self,alist):
        self.currentSize = len(alist)
        self.heapArray = [(0,0)]
        for i in alist:
            self.heapArray.append(i)
        i = len(alist) // 2            
        while (i > 0):
            self.percDown(i)
            i = i - 1
                        
    def percDown(self,i):
        while (i * 2) <= self.currentSize:
            mc = self.minChild(i)
            if self.heapArray[i][0] > self.heapArray[mc][0]:
                tmp = self.heapArray[i]
                self.heapArray[i] = self.heapArray[mc]
                self.heapArray[mc] = tmp
            i = mc
                
    def minChild(self,i):
        if i*2 > self.currentSize:
            return -1
        else:
            if i*2 + 1 > self.currentSize:
                return i*2
            else:
                if self.heapArray[i*2][0] < self.heapArray[i*2+1][0]:
                    return i*2
                else:
                    return i*2+1

    def percUp(self,i):
        while i // 2 > 0:
            if self.heapArray[i][0] < self.heapArray[i//2][0]:
               tmp = self.heapArray[i//2]
               self.heapArray[i//2] = self.heapArray[i]
               self.heapArray[i] = tmp
            i = i//2
 
    def add(self,k):
        self.heapArray.append(k)
        self.currentSize = self.currentSize + 1
        self.percUp(self.currentSize)

    def delMin(self):
        retval = self.heapArray[1][1]
        self.heapArray[1] = self.heapArray[self.currentSize]
        self.currentSize = self.currentSize - 1
        self.heapArray.pop()
        self.percDown(1)
        return retval
        
    def isEmpty(self):
        if self.currentSize == 0:
            return True
        else:
            return False

    def decreaseKey(self,val,amt):
        # this is a little wierd, but we need to find the heap thing to decrease by
        # looking at its value
        done = False
        i = 1
        myKey = 0
        while not done and i <= self.currentSize:
            if self.heapArray[i][1] == val:
                done = True
                myKey = i
            else:
                i = i + 1
        if myKey > 0:
            self.heapArray[myKey] = (amt,self.heapArray[myKey][1])
            self.percUp(myKey)
            
    def __contains__(self,vtx):
        for pair in self.heapArray:
            if pair[1] == vtx:
                return True
        return False
        
class TestBinHeap(unittest.TestCase):
    def setUp(self):
        self.theHeap = PriorityQueue()
        self.theHeap.add((2,'x'))
        self.theHeap.add((3,'y'))
        self.theHeap.add((5,'z'))
        self.theHeap.add((6,'a'))
        self.theHeap.add((4,'d'))


    def testInsert(self):
        assert self.theHeap.currentSize == 5

    def testDelmin(self):
        assert self.theHeap.delMin() == 'x'
        assert self.theHeap.delMin() == 'y'
    
    def testDecKey(self):
        self.theHeap.decreaseKey('d',1)
        assert self.theHeap.delMin() == 'd'
        
if __name__ == '__main__':
    unittest.main()
`,"src/lib/pythonds/trees/__init__.py":`
# from .binaryTree import BinaryTree
# from .balance import AVLTree
# from .bst import BinarySearchTree
# from .binheap import BinHeap


`,"src/lib/pythonds/trees/balance.py":`#!/bin/env python3.1
# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005, 2010
# 

from .bst import BinarySearchTree, TreeNode

class AVLTree(BinarySearchTree):
    '''
    Author:  Brad Miller
    Date:  1/15/2005
    Description:  Imlement a binary search tree with the following interface
                  functions:  
                  __contains__(y) <==> y in x
                  __getitem__(y) <==> x[y]
                  __init__()
                  __len__() <==> len(x)
                  __setitem__(k,v) <==> x[k] = v
                  clear()
                  get(k)
                  has_key(k)
                  items() 
                  keys() 
                  values()
                  put(k,v)
    '''


    def _put(self,key,val,currentNode):
        if key < currentNode.key:
            if currentNode.hasLeftChild():
                self._put(key,val,currentNode.leftChild)
            else:
                currentNode.leftChild = TreeNode(key,val,parent=currentNode)
                self.updateBalance(currentNode.leftChild)
        else:
            if currentNode.hasRightChild():
                self._put(key,val,currentNode.rightChild)
            else:
                currentNode.rightChild = TreeNode(key,val,parent=currentNode)
                self.updateBalance(currentNode.rightChild)                

    def updateBalance(self,node):
        if node.balanceFactor > 1 or node.balanceFactor < -1:
            self.rebalance(node)
            return
        if node.parent != None:
            if node.isLeftChild():
                node.parent.balanceFactor += 1
            elif node.isRightChild():
                node.parent.balanceFactor -= 1

            if node.parent.balanceFactor != 0:
                self.updateBalance(node.parent)

    def rebalance(self,node):
        if node.balanceFactor < 0:
            if node.rightChild.balanceFactor > 0:
                # Do an LR Rotation
                self.rotateRight(node.rightChild)
                self.rotateLeft(node)
            else:
                # single left
                self.rotateLeft(node)
        elif node.balanceFactor > 0:
            if node.leftChild.balanceFactor < 0:
                # Do an RL Rotation
                self.rotateLeft(node.leftChild)
                self.rotateRight(node)
            else:
                # single right
                self.rotateRight(node)

    def rotateLeft(self,rotRoot):
        newRoot = rotRoot.rightChild
        rotRoot.rightChild = newRoot.leftChild
        if newRoot.leftChild != None:
            newRoot.leftChild.parent = rotRoot
        newRoot.parent = rotRoot.parent
        if rotRoot.isRoot():
            self.root = newRoot
        else:
            if rotRoot.isLeftChild():
                rotRoot.parent.leftChild = newRoot
            else:
                rotRoot.parent.rightChild = newRoot
        newRoot.leftChild = rotRoot
        rotRoot.parent = newRoot
        rotRoot.balanceFactor = rotRoot.balanceFactor + 1 - min(newRoot.balanceFactor, 0)
        newRoot.balanceFactor = newRoot.balanceFactor + 1 + max(rotRoot.balanceFactor, 0)


    def rotateRight(self,rotRoot):
        newRoot = rotRoot.leftChild
        rotRoot.leftChild = newRoot.rightChild
        if newRoot.rightChild != None:
            newRoot.rightChild.parent = rotRoot
        newRoot.parent = rotRoot.parent
        if rotRoot.isRoot():
            self.root = newRoot
        else:
            if rotRoot.isRightChild():
                rotRoot.parent.rightChild = newRoot
            else:
                rotRoot.parent.leftChild = newRoot
        newRoot.rightChild = rotRoot
        rotRoot.parent = newRoot
        rotRoot.balanceFactor = rotRoot.balanceFactor - 1 - max(newRoot.balanceFactor, 0)
        newRoot.balanceFactor = newRoot.balanceFactor - 1 + min(rotRoot.balanceFactor, 0)
        
`,"src/lib/pythonds/trees/binaryTree.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 

class BinaryTree:
    """
    A recursive implementation of Binary Tree
    Using links and Nodes approach.
    """    
    def __init__(self,rootObj):
        self.key = rootObj
        self.leftChild = None
        self.rightChild = None

    def insertLeft(self,newNode):
        if self.leftChild == None:
            self.leftChild = BinaryTree(newNode)
        else:
            t = BinaryTree(newNode)
            t.left = self.leftChild
            self.leftChild = t
    
    def insertRight(self,newNode):
        if self.rightChild == None:
            self.rightChild = BinaryTree(newNode)
        else:
            t = BinaryTree(newNode)
            t.right = self.rightChild
            self.rightChild = t

    def isLeaf(self):
        return ((not self.leftChild) and (not self.rightChild))

    def getRightChild(self):
        return self.rightChild

    def getLeftChild(self):
        return self.leftChild

    def setRootVal(self,obj):
        self.key = obj

    def getRootVal(self,):
        return self.key

    def inorder(self):
        if self.leftChild:
            self.leftChild.inorder()
        print(self.key)
        if self.rightChild:
            self.rightChild.inorder()

    def postorder(self):
        if self.leftChild:
            self.leftChild.postorder()
        if self.rightChild:
            self.rightChild.postorder()
        print(self.key)


    def preorder(self):
        print(self.key)
        if self.leftChild:
            self.leftChild.preorder()
        if self.rightChild:
            self.rightChild.preorder()

    def printexp(self):
        if self.leftChild:
            print('(')
            self.leftChild.printexp()
        print(self.key)
        if self.rightChild:
            self.rightChild.printexp()
            print(')')

    def postordereval(self):
        opers = {'+':operator.add, '-':operator.sub, '*':operator.mul, '/':operator.truediv}
        res1 = None
        res2 = None
        if self.leftChild:
            res1 = self.leftChild.postordereval()  #// \\label{peleft}
        if self.rightChild:
            res2 = self.rightChild.postordereval() #// \\label{peright}
        if res1 and res2:
            return opers[self.key](res1,res2) #// \\label{peeval}
        else:
            return self.key

def inorder(tree):
    if tree != None:
        inorder(tree.getLeftChild())
        print(tree.getRootVal())
        inorder(tree.getRightChild())

def printexp(tree):
    if tree.leftChild:
        print('(')
        printexp(tree.getLeftChild())
    print(tree.getRootVal())
    if tree.rightChild:
        printexp(tree.getRightChild())
        print(')') 

def printexp(tree):
    sVal = ""
    if tree:
        sVal = '(' + printexp(tree.getLeftChild())
        sVal = sVal + str(tree.getRootVal())
        sVal = sVal + printexp(tree.getRightChild()) + ')'
    return sVal

def postordereval(tree):
    opers = {'+':operator.add, '-':operator.sub, '*':operator.mul, '/':operator.truediv}
    res1 = None
    res2 = None
    if tree:
        res1 = postordereval(tree.getLeftChild())  #// \\label{peleft}
        res2 = postordereval(tree.getRightChild()) #// \\label{peright}
        if res1 and res2:
            return opers[tree.getRootVal()](res1,res2) #// \\label{peeval}
        else:
            return tree.getRootVal()

def height(tree):
    if tree == None:
        return -1
    else:
        return 1 + max(height(tree.leftChild),height(tree.rightChild))

# t = BinaryTree(7)
# t.insertLeft(3)
# t.insertRight(9)
# inorder(t)
# import operator
# x = BinaryTree('*')
# x.insertLeft('+')
# l = x.getLeftChild()
# l.insertLeft(4)
# l.insertRight(5)
# x.insertRight(7)
# print(printexp(x))
# print(postordereval(x))
# print(height(x))
`,"src/lib/pythonds/trees/binheap.py":`# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005
# 

# this heap takes key value pairs, we will assume that the keys are integers
class BinHeap:
    def __init__(self):
        self.heapList = [0]
        self.currentSize = 0


    def buildHeap(self,alist):
        i = len(alist) // 2
        self.currentSize = len(alist)
        self.heapList = [0] + alist[:]
        print(len(self.heapList), i)
        while (i > 0):
            print(self.heapList, i)
            self.percDown(i)
            i = i - 1
        print(self.heapList,i)
                        
    def percDown(self,i):
        while (i * 2) <= self.currentSize:
            mc = self.minChild(i)
            if self.heapList[i] > self.heapList[mc]:
                tmp = self.heapList[i]
                self.heapList[i] = self.heapList[mc]
                self.heapList[mc] = tmp
            i = mc
                
    def minChild(self,i):
        if i * 2 + 1 > self.currentSize:
            return i * 2
        else:
            if self.heapList[i * 2] < self.heapList[i * 2 + 1]:
                return i * 2
            else:
                return i * 2 + 1

    def percUp(self,i):
        while i // 2 > 0:
            if self.heapList[i] < self.heapList[i//2]:
               tmp = self.heapList[i // 2]
               self.heapList[i // 2] = self.heapList[i]
               self.heapList[i] = tmp
            i = i // 2
 
    def insert(self,k):
        self.heapList.append(k)
        self.currentSize = self.currentSize + 1
        self.percUp(self.currentSize)

    def delMin(self):
        retval = self.heapList[1]
        self.heapList[1] = self.heapList[self.currentSize]
        self.currentSize = self.currentSize - 1
        self.heapList.pop()
        self.percDown(1)
        return retval
        
    def isEmpty(self):
        if currentSize == 0:
            return True
        else:
            return False
`,"src/lib/pythonds/trees/bst.py":`#!/bin/env python3.1
# Bradley N. Miller, David L. Ranum
# Introduction to Data Structures and Algorithms in Python
# Copyright 2005, 2010
# 

class BinarySearchTree:
    '''
    Author:  Brad Miller
    Date:  1/15/2005
    Description:  Imlement a binary search tree with the following interface
                  functions:  
                  __contains__(y) <==> y in x
                  __getitem__(y) <==> x[y]
                  __init__()
                  __len__() <==> len(x)
                  __setitem__(k,v) <==> x[k] = v
                  clear()
                  get(k)
                  items() 
                  keys() 
                  values()
                  put(k,v)
                  in
                  del <==> 
    '''

    def __init__(self):
        self.root = None
        self.size = 0
    
    def put(self,key,val):
        if self.root:
            self._put(key,val,self.root)
        else:
            self.root = TreeNode(key,val)
        self.size = self.size + 1

    def _put(self,key,val,currentNode):
        if key < currentNode.key:
            if currentNode.hasLeftChild():
                self._put(key,val,currentNode.leftChild)
            else:
                currentNode.leftChild = TreeNode(key,val,parent=currentNode)
        else:
            if currentNode.hasRightChild():
                self._put(key,val,currentNode.rightChild)
            else:
                currentNode.rightChild = TreeNode(key,val,parent=currentNode)
            
    def __setitem__(self,k,v):
        self.put(k,v)

    def get(self,key):
        if self.root:
            res = self._get(key,self.root)
            if res:
                return res.payload
            else:
                return None
        else:
            return None
        
    def _get(self,key,currentNode):
        if not currentNode:
            return None
        elif currentNode.key == key:
            return currentNode
        elif key < currentNode.key:
            return self._get(key,currentNode.leftChild)
        else:
            return self._get(key,currentNode.rightChild)
            
        
    def __getitem__(self,key):
        res = self.get(key)
        if res:
            return res
        else:
            raise KeyError('Error, key not in tree')
            

    def __contains__(self,key):
        if self._get(key,self.root):
            return True
        else:
            return False
        
    def length(self):
        return self.size

    def __len__(self):
        return self.size

    def __iter__(self):
        return self.root.__iter__()
    
    def delete(self,key):
        if self.size > 1:
            nodeToRemove = self._get(key,self.root)
            if nodeToRemove:
                self.remove(nodeToRemove)
                self.size = self.size-1
            else:
                raise KeyError('Error, key not in tree')
        elif self.size == 1 and self.root.key == key:
            self.root = None
            self.size = self.size - 1
        else:
            raise KeyError('Error, key not in tree')

    def __delitem__(self,key):
        self.delete(key)
    
    def remove(self,currentNode):
        if currentNode.isLeaf(): #leaf
            if currentNode == currentNode.parent.leftChild:
                currentNode.parent.leftChild = None
            else:
                currentNode.parent.rightChild = None
        elif currentNode.hasBothChildren(): #interior
            succ = currentNode.findSuccessor()
            succ.spliceOut()
            currentNode.key = succ.key
            currentNode.payload = succ.payload
        else: # this node has one child
            if currentNode.hasLeftChild():
                if currentNode.isLeftChild():
                    currentNode.leftChild.parent = currentNode.parent
                    currentNode.parent.leftChild = currentNode.leftChild
                elif currentNode.isRightChild():
                    currentNode.leftChild.parent = currentNode.parent
                    currentNode.parent.rightChild = currentNode.leftChild
                else:
                    currentNode.replaceNodeData(currentNode.leftChild.key,
                                       currentNode.leftChild.payload,
                                       currentNode.leftChild.leftChild,
                                       currentNode.leftChild.rightChild)
            else:
                if currentNode.isLeftChild():
                    currentNode.rightChild.parent = currentNode.parent
                    currentNode.parent.leftChild = currentNode.rightChild
                elif currentNode.isRightChild():
                    currentNode.rightChild.parent = currentNode.parent
                    currentNode.parent.rightChild = currentNode.rightChild
                else:
                    currentNode.replaceNodeData(currentNode.rightChild.key,
                                       currentNode.rightChild.payload,
                                       currentNode.rightChild.leftChild,
                                       currentNode.rightChild.rightChild)

    def inorder(self):
        self._inorder(self.root)

    def _inorder(self,tree):
        if tree != None:
            self._inorder(tree.leftChild)
            print(tree.key)
            self._inorder(tree.rightChild)

    def postorder(self):
        self._postorder(self.root)

    def _postorder(self, tree):
        if tree:
            self._postorder(tree.rightChild)
            self._postorder(tree.leftChild)
            print(tree.key)            

    def preorder(self):
        self._preorder(self,self.root)

    def _preorder(self,tree):
        if tree:
            print(tree.key)            
            self._preorder(tree.leftChild)
            self._preorder(tree.rightChild)

                
class TreeNode:
    def __init__(self,key,val,left=None,right=None,parent=None):
        self.key = key
        self.payload = val
        self.leftChild = left
        self.rightChild = right
        self.parent = parent
        self.balanceFactor = 0
        
    def hasLeftChild(self):
        return self.leftChild

    def hasRightChild(self):
        return self.rightChild
    
    def isLeftChild(self):
        return self.parent and self.parent.leftChild == self

    def isRightChild(self):
        return self.parent and self.parent.rightChild == self

    def isRoot(self):
        return not self.parent

    def isLeaf(self):
        return not (self.rightChild or self.leftChild)

    def hasAnyChildren(self):
        return self.rightChild or self.leftChild

    def hasBothChildren(self):
        return self.rightChild and self.leftChild
    
    def replaceNodeData(self,key,value,lc,rc):
        self.key = key
        self.payload = value
        self.leftChild = lc
        self.rightChild = rc
        if self.hasLeftChild():
            self.leftChild.parent = self
        if self.hasRightChild():
            self.rightChild.parent = self
        
    def findSuccessor(self):
        succ = None
        if self.hasRightChild():
            succ = self.rightChild.findMin()
        else:
            if self.parent:
                if self.isLeftChild():
                    succ = self.parent
                else:
                    self.parent.rightChild = None
                    succ = self.parent.findSuccessor()
                    self.parent.rightChild = self
        return succ


    def spliceOut(self):
        if self.isLeaf():
            if self.isLeftChild():
                self.parent.leftChild = None
            else:
                self.parent.rightChild = None
        elif self.hasAnyChildren():
            if self.hasLeftChild():
                if self.isLeftChild():
                    self.parent.leftChild = self.leftChild
                else:
                    self.parent.rightChild = self.leftChild
                self.leftChild.parent = self.parent
            else:
                if self.isLeftChild():
                    self.parent.leftChild = self.rightChild
                else:
                    self.parent.rightChild = self.rightChild
                self.rightChild.parent = self.parent

    def findMin(self):
        current = self
        while current.hasLeftChild():
            current = current.leftChild
        return current

    def __iter__(self):
        """The standard inorder traversal of a binary tree."""
        if self:
            if self.hasLeftChild():
                for elem in self.leftChild:
                    yield elem
            yield self.key
            if self.hasRightChild():
                for elem in self.rightChild:
                    yield elem

            
`,"src/lib/quopri.py":`raise NotImplementedError("quopri is not yet implemented in Skulpt")
`,"src/lib/random.js":'var MersenneTwister=function(a){a==null&&(a=new Date().getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=Array(this.N),this.mti=this.N+1,this.init_genrand(a)};MersenneTwister.prototype.init_genrand=function(a){for(this.mt[0]=a>>>0,this.mti=1;this.mti<this.N;this.mti++){var a=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30;this.mt[this.mti]=(1812433253*((4294901760&a)>>>16)<<16)+1812433253*(65535&a)+this.mti,this.mt[this.mti]>>>=0}},MersenneTwister.prototype.init_by_array=function(a,b){var d,e,f;for(this.init_genrand(19650218),d=1,e=0,f=this.N>b?this.N:b;f;f--){var g=this.mt[d-1]^this.mt[d-1]>>>30;this.mt[d]=(this.mt[d]^(1664525*((4294901760&g)>>>16)<<16)+1664525*(65535&g))+a[e]+e,this.mt[d]>>>=0,d++,e++,d>=this.N&&(this.mt[0]=this.mt[this.N-1],d=1),e>=b&&(e=0)}for(f=this.N-1;f;f--){var g=this.mt[d-1]^this.mt[d-1]>>>30;this.mt[d]=(this.mt[d]^(1566083941*((4294901760&g)>>>16)<<16)+1566083941*(65535&g))-d,this.mt[d]>>>=0,d++,d>=this.N&&(this.mt[0]=this.mt[this.N-1],d=1)}this.mt[0]=2147483648},MersenneTwister.prototype.genrand_int32=function(){var a,b=[0,this.MATRIX_A];if(this.mti>=this.N){var d;for(this.mti==this.N+1&&this.init_genrand(5489),d=0;d<this.N-this.M;d++)a=this.mt[d]&this.UPPER_MASK|this.mt[d+1]&this.LOWER_MASK,this.mt[d]=this.mt[d+this.M]^a>>>1^b[1&a];for(;d<this.N-1;d++)a=this.mt[d]&this.UPPER_MASK|this.mt[d+1]&this.LOWER_MASK,this.mt[d]=this.mt[d+(this.M-this.N)]^a>>>1^b[1&a];a=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^a>>>1^b[1&a],this.mti=0}return a=this.mt[this.mti++],a^=a>>>11,a^=2636928640&a<<7,a^=4022730752&a<<15,a^=a>>>18,a>>>0},MersenneTwister.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},MersenneTwister.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},MersenneTwister.prototype.random=function(){return this.genrand_int32()*(1/4294967296)},MersenneTwister.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},MersenneTwister.prototype.genrand_res53=function(){var d=this.genrand_int32()>>>5,a=this.genrand_int32()>>>6;return(67108864*d+a)*(1/9007199254740992)};var $builtinmodule=function(){var a=Math.log,b=Math.sqrt,d={},e=new MersenneTwister,f=void 0;d.seed=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("seed",arguments.length,0,1),a=Sk.builtin.asnum$(a),e=0<arguments.length?new MersenneTwister(a):new MersenneTwister,Sk.builtin.none.none$}),d.random=new Sk.builtin.func(function(){return Sk.builtin.pyCheckArgsLen("random",arguments.length,0,0),new Sk.builtin.float_(e.genrand_res53())});var g=function(a){return 0|a},h=function(a,b,d){var f,h,i;if(!Sk.builtin.checkInt(a))throw new Sk.builtin.ValueError("non-integer first argument for randrange()");if(void 0===b)return i=g(e.genrand_res53()*a),new Sk.builtin.int_(i);if(!Sk.builtin.checkInt(b))throw new Sk.builtin.ValueError("non-integer stop for randrange()");if(void 0===d&&(d=1),f=b-a,1==d&&0<f)return i=a+g(e.genrand_res53()*f),new Sk.builtin.int_(i);if(1==d)throw new Sk.builtin.ValueError("empty range for randrange() ("+a+", "+b+", "+f+")");if(!Sk.builtin.checkInt(d))throw new Sk.builtin.ValueError("non-integer step for randrange()");if(0<d)h=g((f+d-1)/d);else if(0>d)h=g((f+d+1)/d);else throw new Sk.builtin.ValueError("zero step for randrange()");if(0>=h)throw new Sk.builtin.ValueError("empty range for randrange()");return i=a+d*g(e.genrand_res53()*h),new Sk.builtin.int_(i)};d.randint=new Sk.builtin.func(function(d,e){return Sk.builtin.pyCheckArgsLen("randint",arguments.length,2,2),d=Sk.builtin.asnum$(d),e=Sk.builtin.asnum$(e),h(d,e+1)}),d.randrange=new Sk.builtin.func(function(a,b,d){return Sk.builtin.pyCheckArgsLen("randrange",arguments.length,1,3),a=Sk.builtin.asnum$(a),b=Sk.builtin.asnum$(b),d=Sk.builtin.asnum$(d),h(a,b,d)}),d.uniform=new Sk.builtin.func(function(d,f){Sk.builtin.pyCheckArgsLen("uniform",arguments.length,2,2),d=Sk.builtin.asnum$(d),f=Sk.builtin.asnum$(f);var g=e.genrand_res53();return c=d+g*(f-d),new Sk.builtin.float_(c)}),d.triangular=new Sk.builtin.func(function(a,d,f){Sk.builtin.pyCheckArgsLen("triangular",arguments.length,2,3),Sk.builtin.pyCheckType("low","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("high","number",Sk.builtin.checkNumber(d));var g,h,i;return a=Sk.builtin.asnum$(a),d=Sk.builtin.asnum$(d),a>d&&(i=a,a=d,d=i),void 0===f||f===Sk.builtin.none.none$?f=(d-a)/2:(Sk.builtin.pyCheckType("mode","number",Sk.builtin.checkNumber(f)),f=Sk.builtin.asnum$(f)),g=e.genrand_res53(),h=g<(f-a)/(d-a)?a+b(g*(d-a)*(f-a)):d-b((1-g)*(d-a)*(d-f)),new Sk.builtin.float_(h)});var i=function(d,g){var k,l,m,n,o,h=Math.sin,i=Math.cos,j=Math.PI;return void 0===f?(k=e.genrand_res53(),l=e.genrand_res53(),m=b(-2*a(k)),n=2*j*l,o=m*i(n),f=m*h(n)):(o=f,f=void 0),d+g*o};return d.gauss=new Sk.builtin.func(function(a,b){return Sk.builtin.pyCheckArgsLen("gauss",arguments.length,2,2),Sk.builtin.pyCheckType("mu","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("sigma","number",Sk.builtin.checkNumber(b)),a=Sk.builtin.asnum$(a),b=Sk.builtin.asnum$(b),new Sk.builtin.float_(i(a,b))}),d.normalvariate=d.gauss,d.lognormvariate=new Sk.builtin.func(function(a,b){var d=Math.exp;return Sk.builtin.pyCheckArgsLen("lognormvariate",arguments.length,2,2),Sk.builtin.pyCheckType("mu","number",Sk.builtin.checkNumber(a)),Sk.builtin.pyCheckType("sigma","number",Sk.builtin.checkNumber(b)),a=Sk.builtin.asnum$(a),b=Sk.builtin.asnum$(b),new Sk.builtin.float_(d(i(a,b)))}),d.expovariate=new Sk.builtin.func(function(b){Sk.builtin.pyCheckArgsLen("expovariate",arguments.length,1,1),Sk.builtin.pyCheckType("lambd","number",Sk.builtin.checkNumber(b)),b=Sk.builtin.asnum$(b);var d=e.genrand_res53();return new Sk.builtin.float_(-a(d)/b)}),d.choice=new Sk.builtin.func(function(a){if(Sk.builtin.pyCheckArgsLen("choice",arguments.length,1,1),Sk.builtin.pyCheckType("seq","sequence",Sk.builtin.checkSequence(a)),void 0!==a.sq$length){var b=new Sk.builtin.int_(g(e.genrand_res53()*a.sq$length()));return a.mp$subscript(b)}throw new Sk.builtin.TypeError("object has no length")}),d.shuffle=new Sk.builtin.func(function(a){if(Sk.builtin.pyCheckArgsLen("shuffle",arguments.length,1,1),Sk.builtin.pyCheckType("x","sequence",Sk.builtin.checkSequence(a)),a.constructor===Sk.builtin.list){const h=a.v;for(var b=h.length-1;0<b;b-=1){var d=g(e.genrand_res53()*(b+1)),f=h[d];h[d]=h[b],h[b]=f}}else if(void 0===a.sq$length)throw new Sk.builtin.TypeError("object has no length");else if(void 0!==a.mp$ass_subscript)for(var d,b=a.sq$length()-1;0<b;b-=1){d=new Sk.builtin.int_(g(e.genrand_res53()*(b+1))),b=new Sk.builtin.int_(b);var f=a.mp$subscript(d);a.mp$ass_subscript(d,a.mp$subscript(b)),a.mp$ass_subscript(b,f)}else throw new Sk.builtin.TypeError("object is immutable");return Sk.builtin.none.none$}),d.sample=new Sk.builtin.func(function(a,b){var f,g,h,l,m,d=Math.floor;for(Sk.builtin.pyCheckArgsLen("sample",arguments.length,2,2),Sk.builtin.pyCheckType("population","iterable",Sk.builtin.checkIterable(a)),Sk.builtin.pyCheckType("k","integer",Sk.builtin.checkInt(b)),b=Sk.builtin.asnum$(b),m=[],h=Sk.abstr.iter(a),(f=0,l=h.tp$iternext());void 0!==l;f++,l=h.tp$iternext())g=d(e.genrand_res53()*(f+1)),f<b?(g<f&&(m[f]=m[g]),m[g]=l):g<b&&(m[g]=l);if(f<b)throw new Sk.builtin.ValueError("sample larger than population");return new Sk.builtin.list(m)}),d};',"src/lib/re.js":`var $builtinmodule=function(name){var validGroups,convert,getFlags,_split,_findall,matchobj,_search,_match,regexobj,mod={__name__:new Sk.builtin.str("re")};return mod.I=2,mod.IGNORECASE=2,mod.M=8,mod.MULTILINE=8,validGroups=["(?:","(?=","(?!"],convert=function(a){var b,c,d;if(c=a.match(/\\(\\?./g),c)for(d=0;d<c.length;d++)if(-1==validGroups.indexOf(c[d]))throw new Sk.builtin.ValueError("Disallowed group in pattern: '"+c[d]+"'");return b=a.replace("/\\\\/g","\\\\\\\\"),b=a.replace(/([^\\\\]){,(?![^\\[]*\\])/g,"$1{0,"),b},getFlags=function(a){var b="g";return(a&mod.IGNORECASE)==mod.IGNORECASE&&(b+="i"),(a&mod.MULTILINE)==mod.MULTILINE&&(b+="m"),b},_split=function(a,b,c,d){var e,f,g,h,i,j,k,l,m;if(Sk.builtin.pyCheckArgsLen("split",arguments.length,2,4),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("pattern must be a string");if(!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("string must be a string");if(void 0===c&&(c=0),!Sk.builtin.checkNumber(c))throw new Sk.builtin.TypeError("maxsplit must be a number");if(void 0===d&&(d=0),!Sk.builtin.checkNumber(d))throw new Sk.builtin.TypeError("flags must be a number");for(c=Sk.builtin.asnum$(c),e=Sk.ffi.unwrapo(a),f=Sk.ffi.unwrapo(b),e=convert(e),g=null!==e.match(/^\\(.*\\)$/),h=getFlags(d),i=new RegExp(e,h),j=[],k,l=0,m=0;null!=(k=i.exec(f))&&k.index!==i.lastIndex&&(j.push(new Sk.builtin.str(f.substring(l,k.index))),g&&j.push(new Sk.builtin.str(k[0])),l=i.lastIndex,m+=1,!(c&&m>=c)););return j.push(new Sk.builtin.str(f.substring(l))),new Sk.builtin.list(j)},_split.co_varnames=["pattern","string","maxsplit","flags"],_split.$defaults=[new Sk.builtin.int_(0),new Sk.builtin.int_(0)],mod.split=new Sk.builtin.func(_split),_findall=function(a,b,c){var d,e,f,g,h,j;if(Sk.builtin.pyCheckArgsLen("findall",arguments.length,2,3),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("pattern must be a string");if(!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("string must be a string");if(void 0===c&&(c=0),!Sk.builtin.checkNumber(c))throw new Sk.builtin.TypeError("flags must be a number");if(d=Sk.ffi.unwrapo(a),e=Sk.ffi.unwrapo(b),d=convert(d),f=getFlags(c),g=new RegExp(d,f),d.match(/\\$/)){var k=new RegExp(/\\n$/);e.match(k)&&(e=e.slice(0,-1))}for(h=[],j;null!=(j=g.exec(e));){if(2>j.length)h.push(new Sk.builtin.str(j[0]));else if(2==j.length)h.push(new Sk.builtin.str(j[1]));else{for(var l=[],m=1;m<j.length;m++)l.push(new Sk.builtin.str(j[m]));h.push(new Sk.builtin.tuple(l))}j.index===g.lastIndex&&(g.lastIndex+=1)}return new Sk.builtin.list(h)},_findall.co_varnames=["pattern","string","flags"],_findall.$defaults=[new Sk.builtin.int_(0)],mod.findall=new Sk.builtin.func(_findall),matchobj=function(a,b){b.__init__=new Sk.builtin.func(function(a,b,c,d){return a.thematch=b,a.re=c,a.string=d,Sk.builtin.none.none$}),b.groups=new Sk.builtin.func(function(a){var b=a.thematch.v.slice(1);return new Sk.builtin.tuple(b)}),b.group=new Sk.builtin.func(function(a,b){if(b=void 0===b?0:Sk.builtin.asnum$(b),b>=a.thematch.v.length)throw new Sk.builtin.IndexError("Index out of range: "+b);return a.thematch.v[b]})},mod.MatchObject=Sk.misceval.buildClass(mod,matchobj,"MatchObject",[]),mod._findre=function(res,string){res=res.replace(/([^\\\\]){,(?![^\\[]*\\])/g,"$1{0,");var matches,sitem,retval,re=eval(res),patt=/\\n$/,str=Sk.ffi.remapToJs(string);if(matches=str.match(patt)?str.slice(0,-1).match(re):str.match(re),retval=new Sk.builtin.list,null==matches)return retval;for(var i=0;i<matches.length;++i)sitem=new Sk.builtin.str(matches[i]),retval.v.push(sitem);return retval},_search=function(a,b,c){var d,e;if(Sk.builtin.pyCheckArgsLen("search",arguments.length,2,3),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("pattern must be a string");if(!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("string must be a string");if(void 0===c&&(c=0),!Sk.builtin.checkNumber(c))throw new Sk.builtin.TypeError("flags must be a number");return(e="/"+a.v.replace(/\\//g,"\\\\/")+"/",lst=mod._findre(e,b),1>lst.v.length)?Sk.builtin.none.none$:(d=Sk.misceval.callsimArray(mod.MatchObject,[lst,a,b]),d)},_search.co_varnames=["pattern","string","flags"],_search.$defaults=[new Sk.builtin.int_(0)],mod.search=new Sk.builtin.func(_search),_match=function(a,b,c){var d,e;if(Sk.builtin.pyCheckArgsLen("match",arguments.length,2,3),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("pattern must be a string");if(!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("string must be a string");if(void 0===c&&(c=0),!Sk.builtin.checkNumber(c))throw new Sk.builtin.TypeError("flags must be a number");return(pat=Sk.ffi.remapToJs(a),e="/^"+pat.replace(/\\//g,"\\\\/")+"/",lst=mod._findre(e,b),1>Sk.ffi.remapToJs(lst).length)?Sk.builtin.none.none$:(d=Sk.misceval.callsimArray(mod.MatchObject,[lst,a,b]),d)},_match.co_varnames=["pattern","string","flags"],_match.$defaults=[new Sk.builtin.int_(0)],mod.match=new Sk.builtin.func(_match),regexobj=function(a,b){var c,d,e,f,g,h;b.__init__=new Sk.builtin.func(function(a,b,c){return a.re=b,a.flags=void 0===c?0:c,Sk.builtin.none.none$}),h=new Sk.builtin.func(function(a){var b="re.compile('"+Sk.ffi.remapToJs(a.re)+"')";return Sk.ffi.remapToPy(b.substring(0,212))}),b.__str__=h,b.__repr__=h,c=function(a,b,c){var d=Sk.ffi.remapToJs(a),e=null==b?0:Sk.ffi.remapToJs(b),f=null==c?d.length:Sk.ffi.remapToJs(c);return"^"==e&&(e=d.indexOf("\\n")+1),null===f&&(f=d.length),Sk.ffi.remapToPy(d.substring(e,f))},d=function(a,b,d,e){Sk.builtin.pyCheckArgsLen("search",arguments.length,2,4);var f=c(b,d,e);return _search(a.re,f,a.flags)},d.co_varnames=["self","string","pos","endpos"],d.$defaults=[new Sk.builtin.int_(0),Sk.builtin.none.none$],b.search=new Sk.builtin.func(d),e=function(a,b,d,e){Sk.builtin.pyCheckArgsLen("match",arguments.length,2,4);var f=c(b,d,e);return _match(a.re,f,a.flags)},e.co_varnames=["self","string","pos","endpos"],e.$defaults=[new Sk.builtin.int_(0),Sk.builtin.none.none$],b.match=new Sk.builtin.func(e),f=function(a,b,c){if(Sk.builtin.pyCheckArgsLen("split",arguments.length,2,3),void 0===c&&(c=0),!Sk.builtin.checkInt(c))throw new Sk.builtin.TypeError("maxsplit must be an integer");return _split(a.re,b,c,a.flags)},f.co_varnames=["self","string","maxsplit"],f.$defaults=[new Sk.builtin.int_(0)],b.split=new Sk.builtin.func(f),g=function(a,b,d,e){Sk.builtin.pyCheckArgsLen("findall",arguments.length,2,4);var f=c(b,d,e);return _findall(a.re,f,a.flags)},g.co_varnames=["self","string","pos","endpos"],g.$defaults=[new Sk.builtin.int_(0),Sk.builtin.none.none$],b.findall=new Sk.builtin.func(g)},mod.RegexObject=Sk.misceval.buildClass(mod,regexobj,"RegexObject",[]),mod.compile=new Sk.builtin.func(function(a,b){var c;if(Sk.builtin.pyCheckArgsLen("compile",arguments.length,1,2),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("pattern must be a string");if(void 0===b&&(b=0),!Sk.builtin.checkNumber(b))throw new Sk.builtin.TypeError("flags must be a number");return c=Sk.misceval.callsimArray(mod.RegexObject,[a,b]),c}),mod.purge=new Sk.builtin.func(function(){}),mod};`,"src/lib/repr.py":`raise NotImplementedError("repr is not yet implemented in Skulpt")
`,"src/lib/rexec.py":`raise NotImplementedError("rexec is not yet implemented in Skulpt")
`,"src/lib/rfc822.py":`raise NotImplementedError("rfc822 is not yet implemented in Skulpt")
`,"src/lib/rlcompleter.py":`raise NotImplementedError("rlcompleter is not yet implemented in Skulpt")
`,"src/lib/robotparser.py":`raise NotImplementedError("robotparser is not yet implemented in Skulpt")
`,"src/lib/runpy.py":`raise NotImplementedError("runpy is not yet implemented in Skulpt")
`,"src/lib/sched.py":`raise NotImplementedError("sched is not yet implemented in Skulpt")
`,"src/lib/sets.py":`raise NotImplementedError("sets is not yet implemented in Skulpt")
`,"src/lib/sgmllib.py":`raise NotImplementedError("sgmllib is not yet implemented in Skulpt")
`,"src/lib/sha.py":`raise NotImplementedError("sha is not yet implemented in Skulpt")
`,"src/lib/shelve.py":`raise NotImplementedError("shelve is not yet implemented in Skulpt")
`,"src/lib/shlex.py":`raise NotImplementedError("shlex is not yet implemented in Skulpt")
`,"src/lib/shutil.py":`raise NotImplementedError("shutil is not yet implemented in Skulpt")
`,"src/lib/signal.js":'var $builtinmodule=function(){var a={SIG_DFL:new Sk.builtin.int_(0),SIG_IGN:new Sk.builtin.int_(1),CTRL_C_EVENT:new Sk.builtin.int_(0),CTRL_BREAK_EVENT:new Sk.builtin.int_(0),NSIG:new Sk.builtin.int_(23),SIGHUP:new Sk.builtin.int_(1),SIGNINT:new Sk.builtin.int_(2),SIGILL:new Sk.builtin.int_(4),SIGFPE:new Sk.builtin.int_(8),SIGKILL:new Sk.builtin.int_(9),SIGSEGV:new Sk.builtin.int_(11),SIGTERM:new Sk.builtin.int_(15),SIGBREAK:new Sk.builtin.int_(21),SIGABRT:new Sk.builtin.int_(22),pause:new Sk.builtin.func(function(){Sk.builtin.pyCheckArgsLen("pause",arguments.length,0,0);var a=new Sk.misceval.Suspension;return a.resume=function(){return Sk.builtin.none.none$},a.data={type:"Sk.promise",promise:new Promise(function(a){if(null!=Sk.signals&&Sk.signals.addEventListener){function handleSignal(){Sk.signals.removeEventListener(handleSignal),a()}Sk.signals.addEventListener(handleSignal)}else console.warn("signal.pause() not supported"),Sk.misceval.print_("signal.pause() not supported"),a()})},a}),signal:new Sk.builtin.func(function(){throw new Sk.builtin.NotImplementedError("signal.signal is not supported.")})};return a};',"src/lib/site.py":`raise NotImplementedError("site is not yet implemented in Skulpt")
`,"src/lib/smtpd.py":`raise NotImplementedError("smtpd is not yet implemented in Skulpt")
`,"src/lib/smtplib.py":`raise NotImplementedError("smtplib is not yet implemented in Skulpt")
`,"src/lib/sndhdr.py":`raise NotImplementedError("sndhdr is not yet implemented in Skulpt")
`,"src/lib/socket.py":`raise NotImplementedError("socket is not yet implemented in Skulpt")
`,"src/lib/sqlite3/__init__.py":`raise NotImplementedError("sqlite3 is not yet implemented in Skulpt")
`,"src/lib/sre.py":`raise NotImplementedError("sre is not yet implemented in Skulpt")
`,"src/lib/sre_compile.py":`raise NotImplementedError("sre_compile is not yet implemented in Skulpt")
`,"src/lib/sre_constants.py":`raise NotImplementedError("sre_constants is not yet implemented in Skulpt")
`,"src/lib/sre_parse.py":`raise NotImplementedError("sre_parse is not yet implemented in Skulpt")
`,"src/lib/ssl.py":`raise NotImplementedError("ssl is not yet implemented in Skulpt")
`,"src/lib/stat.py":`raise NotImplementedError("stat is not yet implemented in Skulpt")
`,"src/lib/statvfs.py":`raise NotImplementedError("statvfs is not yet implemented in Skulpt")
`,"src/lib/string.js":'var $builtinmodule=function(){var a={};return a.ascii_lowercase=new Sk.builtin.str("abcdefghijklmnopqrstuvwxyz"),a.ascii_uppercase=new Sk.builtin.str("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),a.ascii_letters=new Sk.builtin.str(a.ascii_lowercase.v+a.ascii_uppercase.v),a.lowercase=new Sk.builtin.str("abcdefghijklmnopqrstuvwxyz"),a.uppercase=new Sk.builtin.str("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),a.letters=new Sk.builtin.str(a.lowercase.v+a.uppercase.v),a.digits=new Sk.builtin.str("0123456789"),a.hexdigits=new Sk.builtin.str("0123456789abcdefABCDEF"),a.octdigits=new Sk.builtin.str("01234567"),a.punctuation=new Sk.builtin.str("!\\"#$%&\'()*+,-./:;<=>?@[\\\\]^_`{|}~"),a.whitespace=new Sk.builtin.str("\\t\\n\\x0B\\f\\r "),a.printable=new Sk.builtin.str(a.digits.v+a.letters.v+a.punctuation.v+" \\t\\n\\r\\x0B\\f"),a.split=new Sk.builtin.func(function(...a){return Sk.misceval.callsimArray(Sk.builtin.str.prototype.split,a)}),a.capitalize=new Sk.builtin.func(function(a){return Sk.misceval.callsimArray(Sk.builtin.str.prototype.capitalize,[a])}),a.join=new Sk.builtin.func(function(a,b){return void 0===b&&(b=new Sk.builtin.str(" ")),Sk.misceval.callsimArray(Sk.builtin.str.prototype.join,[b,a])}),a.capwords=new Sk.builtin.func(function(b,c){if(Sk.builtin.pyCheckArgsLen("capwords",arguments.length,1,2),!Sk.builtin.checkString(b))throw new Sk.builtin.TypeError("s must be a string");if(void 0===c&&(c=new Sk.builtin.str(" ")),!Sk.builtin.checkString(c))throw new Sk.builtin.TypeError("sep must be a string");for(var d=Sk.misceval.callsimArray(a.split,[b,c]).v,e=[],f=0;f<d.length;f++){var g=d[f],h=Sk.misceval.callsimArray(a.capitalize,[g]);e.push(h)}return Sk.misceval.callsimArray(a.join,[new Sk.builtin.list(e),c])}),a};',"src/lib/string.py":`raise NotImplementedError("string is not yet implemented in Skulpt")
`,"src/lib/stringold.py":`raise NotImplementedError("stringold is not yet implemented in Skulpt")
`,"src/lib/stringprep.py":`raise NotImplementedError("stringprep is not yet implemented in Skulpt")
`,"src/lib/struct.py":`raise NotImplementedError("struct is not yet implemented in Skulpt")
`,"src/lib/subprocess.py":`raise NotImplementedError("subprocess is not yet implemented in Skulpt")
`,"src/lib/sunau.py":`raise NotImplementedError("sunau is not yet implemented in Skulpt")
`,"src/lib/sunaudio.py":`raise NotImplementedError("sunaudio is not yet implemented in Skulpt")
`,"src/lib/symbol.py":`raise NotImplementedError("symbol is not yet implemented in Skulpt")
`,"src/lib/symtable.py":`raise NotImplementedError("symtable is not yet implemented in Skulpt")
`,"src/lib/tabnanny.py":`raise NotImplementedError("tabnanny is not yet implemented in Skulpt")
`,"src/lib/tarfile.py":`raise NotImplementedError("tarfile is not yet implemented in Skulpt")
`,"src/lib/telnetlib.py":`raise NotImplementedError("telnetlib is not yet implemented in Skulpt")
`,"src/lib/tempfile.py":`raise NotImplementedError("tempfile is not yet implemented in Skulpt")
`,"src/lib/test/__init__.py":`__author__ = 'bmiller'

def testEqual(actual, expected):
    if type(expected) == type(1):
        if actual == expected:
            print('Pass')
            return True
    elif type(expected) == type(1.11):
        if abs(actual-expected) < 0.00001:
            print('Pass')
            return True
    else:
        if actual == expected:
            print('Pass')
            return True
    print('Test Failed: expected ' + str(expected) + ' but got ' + str(actual))
    return False

def testNotEqual(actual, expected):
    pass

`,"src/lib/test/bad_getattr.py":`x = 1

__getattr__ = "Surprise!"
__dir__ = "Surprise again!"
`,"src/lib/test/bad_getattr2.py":`def __getattr__():
    "Bad one"

x = 1

def __dir__(bad_sig):
    return []
`,"src/lib/test/bad_getattr3.py":`def __getattr__(name):
    global __getattr__
    if name != 'delgetattr':
        raise AttributeError
    del __getattr__
    raise AttributeError
`,"src/lib/test/decimaltestdata/__init__.py":`raise NotImplementedError("decimaltestdata is not yet implemented in Skulpt")
`,"src/lib/test/good_getattr.py":`x = 1

def __dir__():
    return ['a', 'b', 'c']

def __getattr__(name):
    if name == "yolo":
        raise AttributeError("Deprecated, use whatever instead")
    return f"There is {name}"

y = 2
`,"src/lib/test/test_support.py":`"""Supporting definitions for the Python regression tests."""

if __name__ != 'test.test_support':
    raise ImportError('test_support must be imported from the test package')

import unittest


# def run_unittest(*classes):
#     """Run tests from unittest.TestCase-derived classes."""
#     valid_types = (unittest.TestSuite, unittest.TestCase)
#     suite = unittest.TestSuite()
#     for cls in classes:
#         if isinstance(cls, str):
#             if cls in sys.modules:
#                 suite.addTest(unittest.findTestCases(sys.modules[cls]))
#             else:
#                 raise ValueError("str arguments must be keys in sys.modules")
#         elif isinstance(cls, valid_types):
#             suite.addTest(cls)
#         else:
#             suite.addTest(unittest.makeSuite(cls))
#     _run_suite(suite)

def run_unittest(*classes):
    """Run tests from unittest.TestCase-derived classes."""
    for cls in classes:
        print cls
        if issubclass(cls, unittest.TestCase):
            cls().main()
        else:
            print "Don't know what to do with ", cls
`,"src/lib/textwrap.py":`"""Text wrapping and filling.
"""

# Copyright (C) 1999-2001 Gregory P. Ward.
# Copyright (C) 2002, 2003 Python Software Foundation.
# Written by Greg Ward <gward@python.net>

import re, string

__all__ = ['TextWrapper', 'wrap', 'fill', 'dedent', 'indent', 'shorten']

# Hardcode the recognized whitespace characters to the US-ASCII
# whitespace characters.  The main reason for doing this is that
# some Unicode spaces (like \\u00a0) are non-breaking whitespaces.
_whitespace = '\\t\\n\\x0b\\x0c\\r '

class TextWrapper:
    """
    Object for wrapping/filling text.  The public interface consists of
    the wrap() and fill() methods; the other methods are just there for
    subclasses to override in order to tweak the default behaviour.
    If you want to completely replace the main wrapping algorithm,
    you'll probably have to override _wrap_chunks().
    Several instance attributes control various aspects of wrapping:
      width (default: 70)
        the maximum width of wrapped lines (unless break_long_words
        is false)
      initial_indent (default: "")
        string that will be prepended to the first line of wrapped
        output.  Counts towards the line's width.
      subsequent_indent (default: "")
        string that will be prepended to all lines save the first
        of wrapped output; also counts towards each line's width.
      expand_tabs (default: true)
        Expand tabs in input text to spaces before further processing.
        Each tab will become 0 .. 'tabsize' spaces, depending on its position
        in its line.  If false, each tab is treated as a single character.
      tabsize (default: 8)
        Expand tabs in input text to 0 .. 'tabsize' spaces, unless
        'expand_tabs' is false.
      replace_whitespace (default: true)
        Replace all whitespace characters in the input text by spaces
        after tab expansion.  Note that if expand_tabs is false and
        replace_whitespace is true, every tab will be converted to a
        single space!
      fix_sentence_endings (default: false)
        Ensure that sentence-ending punctuation is always followed
        by two spaces.  Off by default because the algorithm is
        (unavoidably) imperfect.
      break_long_words (default: true)
        Break words longer than 'width'.  If false, those words will not
        be broken, and some lines might be longer than 'width'.
      break_on_hyphens (default: true)
        Allow breaking hyphenated words. If true, wrapping will occur
        preferably on whitespaces and right after hyphens part of
        compound words.
      drop_whitespace (default: true)
        Drop leading and trailing whitespace from lines.
      max_lines (default: None)
        Truncate wrapped lines.
      placeholder (default: ' [...]')
        Append to the last line of truncated text.
    """

    unicode_whitespace_trans = {}
    # uspace = ord(' ')
    uspace = ' '
    for x in _whitespace:
        # unicode_whitespace_trans[ord(x)] = uspace
        unicode_whitespace_trans[x] = uspace

    # This funky little regex is just the trick for splitting
    # text up into word-wrappable chunks.  E.g.
    #   "Hello there -- you goof-ball, use the -b option!"
    # splits into
    #   Hello/ /there/ /--/ /you/ /goof-/ball,/ /use/ /the/ /-b/ /option!
    # (after stripping out empty strings).
    wordsep_re = re.compile(
        r'(\\s+|'                                  # any whitespace
        r'[^\\s\\w]*\\w+[^0-9\\W]-(?=\\w+[^0-9\\W]))')  # hyphenated words
    em_dash = re.compile(r'(\\s+|'                                  # any whitespace
                         r'[^\\s\\w]*\\w+[^0-9\\W]-(?=\\w+[^0-9\\W])|'   # hyphenated words
                         r'(?!^)-{2,}(?=\\w))')                     # em-dash

                         
    # This less funky little regex just split on recognized spaces. E.g.
    #   "Hello there -- you goof-ball, use the -b option!"
    # splits into
    #   Hello/ /there/ /--/ /you/ /goof-ball,/ /use/ /the/ /-b/ /option!/
    wordsep_simple_re = re.compile(r'(\\s+)')


    # XXX this is not locale- or charset-aware -- string.lowercase
    # is US-ASCII only (and therefore English-only)
    sentence_end_re = re.compile(r'[a-z]'             # lowercase letter
                                 r'[\\.\\!\\?]'          # sentence-ending punct.
                                 r'[\\"\\']?'           # optional end-of-quote
                                 r'\\Z')               # end of chunk
    sentence_end_re = r'[a-z][\\.\\!\\?][\\"\\']?'

    def __init__(self,
                 width=70,
                 initial_indent="",
                 subsequent_indent="",
                 expand_tabs=True,
                 replace_whitespace=True,
                 fix_sentence_endings=False,
                 break_long_words=True,
                 drop_whitespace=True,
                 break_on_hyphens=True,
                 tabsize=8,
                 max_lines=None,
                 placeholder=' [...]'):
        self.width = width
        self.initial_indent = initial_indent
        self.subsequent_indent = subsequent_indent
        self.expand_tabs = expand_tabs
        self.replace_whitespace = replace_whitespace
        self.fix_sentence_endings = fix_sentence_endings
        self.break_long_words = break_long_words
        self.drop_whitespace = drop_whitespace
        self.break_on_hyphens = break_on_hyphens
        self.tabsize = tabsize
        self.max_lines = max_lines
        self.placeholder = placeholder


    # -- Private methods -----------------------------------------------
    # (possibly useful for subclasses to override)

    def _munge_whitespace(self, text):
        """_munge_whitespace(text : string) -> string
        Munge whitespace in text: expand tabs and convert all other
        whitespace characters to spaces.  Eg. " foo\\\\tbar\\\\n\\\\nbaz"
        becomes " foo    bar  baz".
        """
        if self.expand_tabs:
            text = text.expandtabs(self.tabsize)
        if self.replace_whitespace:
            for key, val in self.unicode_whitespace_trans.items():
                text = text.replace(key, val)
        return text


    def _split(self, text):
        """_split(text : string) -> [string]
        Split the text to wrap into indivisible chunks.  Chunks are
        not quite the same as words; see _wrap_chunks() for full
        details.  As an example, the text
          Look, goof-ball -- use the -b option!
        breaks into the following chunks:
          'Look,', ' ', 'goof-', 'ball', ' ', '--', ' ',
          'use', ' ', 'the', ' ', '-b', ' ', 'option!'
        if break_on_hyphens is True, or in:
          'Look,', ' ', 'goof-ball', ' ', '--', ' ',
          'use', ' ', 'the', ' ', '-b', ' ', option!'
        otherwise.
        """
        if self.break_on_hyphens is True:
            chunks = self.wordsep_re.split(text)
            if "--" in text:
                chunks = [item 
                            for sublist in [self.em_dash.split(chunk) for chunk in chunks] 
                                for item in sublist]
        else:
            chunks = self.wordsep_simple_re.split(text)
        chunks = [c for c in chunks if c]
        return chunks

    def _fix_sentence_endings(self, chunks):
        """_fix_sentence_endings(chunks : [string])
        Correct for sentence endings buried in 'chunks'.  Eg. when the
        original text contains "... foo.\\\\nBar ...", munge_whitespace()
        and split() will convert that to [..., "foo.", " ", "Bar", ...]
        which has one too few spaces; this method simply changes the one
        space to two.
        """
        i = 0
        # patsearch = self.sentence_end_re.search
        while i < len(chunks)-1:
            if chunks[i+1] == " " and re.search(self.sentence_end_re, chunks[i]) and chunks[i][-1] in ".!?\\"\\'":
                chunks[i+1] = "  "
                i += 2
            else:
                i += 1

    def _handle_long_word(self, reversed_chunks, cur_line, cur_len, width):
        """_handle_long_word(chunks : [string],
                             cur_line : [string],
                             cur_len : int, width : int)
        Handle a chunk of text (most likely a word, not whitespace) that
        is too long to fit in any line.
        """
        # Figure out when indent is larger than the specified width, and make
        # sure at least one character is stripped off on every pass
        if width < 1:
            space_left = 1
        else:
            space_left = width - cur_len

        # If we're allowed to break long words, then do so: put as much
        # of the next chunk onto the current line as will fit.
        if self.break_long_words:
            cur_line.append(reversed_chunks[-1][:space_left])
            reversed_chunks[-1] = reversed_chunks[-1][space_left:]

        # Otherwise, we have to preserve the long word intact.  Only add
        # it to the current line if there's nothing already there --
        # that minimizes how much we violate the width constraint.
        elif not cur_line:
            cur_line.append(reversed_chunks.pop())

        # If we're not allowed to break long words, and there's already
        # text on the current line, do nothing.  Next time through the
        # main loop of _wrap_chunks(), we'll wind up here again, but
        # cur_len will be zero, so the next line will be entirely
        # devoted to the long word that we can't handle right now.

    def _wrap_chunks(self, chunks):
        """_wrap_chunks(chunks : [string]) -> [string]
        Wrap a sequence of text chunks and return a list of lines of
        length 'self.width' or less.  (If 'break_long_words' is false,
        some lines may be longer than this.)  Chunks correspond roughly
        to words and the whitespace between them: each chunk is
        indivisible (modulo 'break_long_words'), but a line break can
        come between any two chunks.  Chunks should not have internal
        whitespace; ie. a chunk is either all whitespace or a "word".
        Whitespace chunks will be removed from the beginning and end of
        lines, but apart from that whitespace is preserved.
        """
        lines = []
        if self.width <= 0:
            raise ValueError("invalid width %r (must be > 0)" % self.width)
        if self.max_lines is not None:
            if self.max_lines > 1:
                indent = self.subsequent_indent
            else:
                indent = self.initial_indent
            if len(indent) + len(self.placeholder.lstrip()) > self.width:
                raise ValueError("placeholder too large for max width")

        # Arrange in reverse order so items can be efficiently popped
        # from a stack of chucks.
        chunks.reverse()

        while chunks:

            # Start the list of chunks that will make up the current line.
            # cur_len is just the length of all the chunks in cur_line.
            cur_line = []
            cur_len = 0

            # Figure out which static string will prefix this line.
            if lines:
                indent = self.subsequent_indent
            else:
                indent = self.initial_indent

            # Maximum width for this line.
            width = self.width - len(indent)

            # First chunk on line is whitespace -- drop it, unless this
            # is the very beginning of the text (ie. no lines started yet).
            if self.drop_whitespace and chunks[-1].strip() == '' and lines:
                del chunks[-1]

            while chunks:
                l = len(chunks[-1])

                # Can at least squeeze this chunk onto the current line.
                if cur_len + l <= width:
                    cur_line.append(chunks.pop())
                    cur_len += l

                # Nope, this line is full.
                else:
                    break

            # The current line is full, and the next chunk is too big to
            # fit on *any* line (not just this one).
            if chunks and len(chunks[-1]) > width:
                self._handle_long_word(chunks, cur_line, cur_len, width)
                cur_len = sum(map(len, cur_line))

            # If the last chunk on this line is all whitespace, drop it.
            if self.drop_whitespace and cur_line and cur_line[-1].strip() == '':
                cur_len -= len(cur_line[-1])
                del cur_line[-1]

            if cur_line:
                if (self.max_lines is None or
                    len(lines) + 1 < self.max_lines or
                    (not chunks or
                     self.drop_whitespace and
                     len(chunks) == 1 and
                     not chunks[0].strip()) and cur_len <= width):
                    # Convert current line back to a string and store it in
                    # list of all lines (return value).
                    lines.append(indent + ''.join(cur_line))
                else:
                    while cur_line:
                        if (cur_line[-1].strip() and
                            cur_len + len(self.placeholder) <= width):
                            cur_line.append(self.placeholder)
                            lines.append(indent + ''.join(cur_line))
                            break
                        cur_len -= len(cur_line[-1])
                        del cur_line[-1]
                    else:
                        if lines:
                            prev_line = lines[-1].rstrip()
                            if (len(prev_line) + len(self.placeholder) <=
                                    self.width):
                                lines[-1] = prev_line + self.placeholder
                                break
                        lines.append(indent + self.placeholder.lstrip())
                    break

        return lines

    def _split_chunks(self, text):
        text = self._munge_whitespace(text)
        return self._split(text)

    # -- Public interface ----------------------------------------------

    def wrap(self, text):
        """wrap(text : string) -> [string]
        Reformat the single paragraph in 'text' so it fits in lines of
        no more than 'self.width' columns, and return a list of wrapped
        lines.  Tabs in 'text' are expanded with string.expandtabs(),
        and all other whitespace characters (including newline) are
        converted to space.
        """
        chunks = self._split_chunks(text)
        if self.fix_sentence_endings:
            self._fix_sentence_endings(chunks)
        return self._wrap_chunks(chunks)

    def fill(self, text):
        """fill(text : string) -> string
        Reformat the single paragraph in 'text' to fit in lines of no
        more than 'self.width' columns, and return a new string
        containing the entire wrapped paragraph.
        """
        return "\\n".join(self.wrap(text))


# -- Convenience interface ---------------------------------------------

def wrap(text, width=70, **kwargs):
    """Wrap a single paragraph of text, returning a list of wrapped lines.
    Reformat the single paragraph in 'text' so it fits in lines of no
    more than 'width' columns, and return a list of wrapped lines.  By
    default, tabs in 'text' are expanded with string.expandtabs(), and
    all other whitespace characters (including newline) are converted to
    space.  See TextWrapper class for available keyword args to customize
    wrapping behaviour.
    """
    w = TextWrapper(width=width, **kwargs)
    return w.wrap(text)

def fill(text, width=70, **kwargs):
    """Fill a single paragraph of text, returning a new string.
    Reformat the single paragraph in 'text' to fit in lines of no more
    than 'width' columns, and return a new string containing the entire
    wrapped paragraph.  As with wrap(), tabs are expanded and other
    whitespace characters converted to space.  See TextWrapper class for
    available keyword args to customize wrapping behaviour.
    """
    w = TextWrapper(width=width, **kwargs)
    return w.fill(text)

def shorten(text, width, **kwargs):
    """Collapse and truncate the given text to fit in the given width.
    The text first has its whitespace collapsed.  If it then fits in
    the *width*, it is returned as is.  Otherwise, as many words
    as possible are joined and then the placeholder is appended::
        >>> textwrap.shorten("Hello  world!", width=12)
        'Hello world!'
        >>> textwrap.shorten("Hello  world!", width=11)
        'Hello [...]'
    """
    w = TextWrapper(width=width, max_lines=1, **kwargs)
    return w.fill(' '.join(text.strip().split()))


# -- Loosely related functionality -------------------------------------

# _whitespace_only_re = re.compile('^[ \\t]+$', re.MULTILINE)
# _leading_whitespace_re = re.compile('(^[ \\t]*)(?:[^ \\t\\n])', re.MULTILINE)

def dedent(text):
    """Remove any common leading whitespace from every line in \`text\`.
    This can be used to make triple-quoted strings line up with the left
    edge of the display, while still presenting them in the source code
    in indented form.
    Note that tabs and spaces are both treated as whitespace, but they
    are not equal: the lines "  hello" and "\\\\thello" are
    considered to have no common leading whitespace.
    Entirely blank lines are normalized to a newline character.
    """
    # Look for the longest leading string of spaces and tabs common to
    # all lines.
    margin = None

    indents = re.findall(r'(^[ \\t]*)(?:[^ \\t\\n])',text, re.MULTILINE)
    for indent in indents:
        if margin is None:
            margin = indent

        # Current line more deeply indented than previous winner:
        # no change (previous winner is still on top).
        elif indent.startswith(margin):
            pass

        # Current line consistent with and no deeper than previous winner:
        # it's the new winner.
        elif margin.startswith(indent):
            margin = indent

        # Find the largest common whitespace between current line and previous
        # winner.
        else:
            for i, (x, y) in enumerate(zip(margin, indent)):
                if x != y:
                    margin = margin[:i]
                    break
    # sanity check (testing/debugging only)
    if 0 and margin:
        for line in text.split("\\n"):
            assert not line or line.startswith(margin), \\
                   "line = %r, margin = %r" % (line, margin)

    if margin:
        lines = [line[len(margin):] 
                    if line.strip()
                        else line.strip() 
                            for line in text.split("\\n")]
        text = "\\n".join(lines)
    return text


def indent(text, prefix, predicate=None):
    """Adds 'prefix' to the beginning of selected lines in 'text'.
    If 'predicate' is provided, 'prefix' will only be added to the lines
    where 'predicate(line)' is True. If 'predicate' is not provided,
    it will default to adding 'prefix' to all non-empty lines that do not
    consist solely of whitespace characters.
    """
    if predicate is None:
        def predicate(line):
            return line.strip()

    def prefixed_lines():
        for line in text.splitlines(True):
            yield (prefix + line if predicate(line) else line)
    return ''.join(prefixed_lines())


if __name__ == "__main__":
    #print dedent("\\tfoo\\n\\tbar")
    #print dedent("  \\thello there\\n  \\t  how are you?")
    print(dedent("Hello there.\\n  This is indented."))`,"src/lib/this.py":`raise NotImplementedError("this is not yet implemented in Skulpt")
`,"src/lib/threading.py":`raise NotImplementedError("threading is not yet implemented in Skulpt")
`,"src/lib/time.js":`var $builtinmodule=function(){function check_struct_time(a){if(!(a instanceof b))throw new Sk.builtin.TypeError("Required argument 'struct_time' must be of type: 'struct_time'");var c,d=a.v.length,e=a.v;for(c=0;c<d;++c)if(!Sk.builtin.checkInt(e[c]))throw new Sk.builtin.TypeError("struct_time may only contain integers");return!0}function padLeft(a,b,d){var c=a.toString();return Array(b-c.length+1).join(d||" ")+c}function isLeapYear(a){return 0==(3&a)&&(0!=a%100||0==a%400)}function getDayOfYear(a,b){b=b||!1;var c=b?a.getUTCMonth():a.getMonth(),d=b?a.getUTCDate():a.getDate(),e=[0,31,59,90,120,151,181,212,243,273,304,334][c]+d;return 1<c&&isLeapYear(b?a.getUTCFullYear():a.getFullYear())&&e++,e}function stdTimezoneOffset(){var a=Math.max,b=new Date(2002,0,1),c=new Date(2002,6,1);return a(b.getTimezoneOffset(),c.getTimezoneOffset())}function dst(a){return a.getTimezoneOffset()<stdTimezoneOffset()}function timeZoneName(a){var b,c=/\\((.*)\\)/.exec(a.toString());if(null!=this.navigator&&(b=this.navigator.userLanguage||this.navigator.language),c&&1<c.length)return c[1];if(void 0===b)return null;try{var d=a.toLocaleString(b,{timeZoneName:"short"});return c=d.split(" "),c[c.length-1]}catch(a){return null}}function date_to_struct_time(a,c){return c=c||!1,new b([Sk.builtin.assk$(c?a.getUTCFullYear():a.getFullYear()),Sk.builtin.assk$((c?a.getUTCMonth():a.getMonth())+1),Sk.builtin.assk$(c?a.getUTCDate():a.getDate()),Sk.builtin.assk$(c?a.getUTCHours():a.getHours()),Sk.builtin.assk$(c?a.getUTCMinutes():a.getMinutes()),Sk.builtin.assk$(c?a.getUTCSeconds():a.getSeconds()),Sk.builtin.assk$(((c?a.getUTCDay():a.getDay())+6)%7),Sk.builtin.assk$(getDayOfYear(a,c)),Sk.builtin.assk$(c?0:dst(a)?1:0)])}function from_seconds(a,b){var c=new Date;if(a){Sk.builtin.pyCheckType("secs","number",Sk.builtin.checkNumber(a));var d=Sk.builtin.asnum$(a);c.setTime(1e3*d)}return date_to_struct_time(c,b)}function asctime_f(a){if(Sk.builtin.pyCheckArgsLen("asctime",arguments.length,0,1),!a||Sk.builtin.checkNone(a)?a=from_seconds():!(a instanceof b)&&(a=new b(a)),a instanceof Sk.builtin.tuple&&9==a.v.length){var e=[d[Sk.builtin.asnum$(a.v[6])],c[Sk.builtin.asnum$(a.v[1])-1],padLeft(Sk.builtin.asnum$(a.v[2]).toString(),2,"0"),padLeft(Sk.builtin.asnum$(a.v[3]).toString(),2,"0")+":"+padLeft(Sk.builtin.asnum$(a.v[4]).toString(),2,"0")+":"+padLeft(Sk.builtin.asnum$(a.v[5]).toString(),2,"0"),padLeft(Sk.builtin.asnum$(a.v[0]).toString(),4,"0")];return new Sk.builtin.str(e.join(" "))}}function mktime_f(a){if(Sk.builtin.pyCheckArgsLen("mktime",arguments.length,1,1),a instanceof Sk.builtin.tuple&&9==a.v.length){var b=new Date(Sk.builtin.asnum$(a.v[0]),Sk.builtin.asnum$(a.v[1])-1,Sk.builtin.asnum$(a.v[2]),Sk.builtin.asnum$(a.v[3]),Sk.builtin.asnum$(a.v[4]),Sk.builtin.asnum$(a.v[5]));return Sk.builtin.assk$(b.getTime()/1e3,void 0)}throw new Sk.builtin.TypeError("mktime() requires a struct_time or 9-tuple")}var a={__package__:new Sk.builtin.str("")},b=Sk.builtin.make_structseq("time","struct_time",{tm_year:"year, for example, 1993",tm_mon:"month of year, range [1, 12]",tm_mday:"day of month, range [1, 31]",tm_hour:"hours, range [0, 23]",tm_min:"minutes, range [0, 59]",tm_sec:"seconds, range [0, 61]",tm_wday:"day of week, range [0, 6], Monday is 0",tm_yday:"day of year, range [1, 366]",tm_isdst:"1 if summer time is in effect, 0 if not, and -1 if unknown"});a.struct_time=b,a.time=new Sk.builtin.func(function(){Sk.builtin.pyCheckArgsLen("time",arguments.length,0,0);var a=Date.now();return this.performance&&this.performance.now&&(a+=performance.now()%1),Sk.builtin.assk$(a/1e3,void 0)}),a.sleep=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("sleep",arguments.length,1,1),Sk.builtin.pyCheckType("delay","float",Sk.builtin.checkNumber(a)),new Sk.misceval.promiseToSuspension(new Promise(function(b){Sk.setTimeout(function(){b(Sk.builtin.none.none$)},1e3*Sk.ffi.remapToJs(a))}))}),a.localtime=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("localtime",arguments.length,0,1),from_seconds(a,!1)}),a.gmtime=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("gmtime",arguments.length,0,1),from_seconds(a,!0)});var c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],d=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];return a.asctime=new Sk.builtin.func(asctime_f),a.ctime=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("ctime",arguments.length,0,1),asctime_f(from_seconds(a))}),a.mktime=new Sk.builtin.func(mktime_f),a.timezone=new Sk.builtin.int_(60*stdTimezoneOffset()),a.altzone=new Sk.builtin.int_(60*function altTimezoneOffset(){var a=Math.min,b=new Date(2002,0,1),c=new Date(2002,6,1);return a(b.getTimezoneOffset(),c.getTimezoneOffset())}()),a.daylight=new Sk.builtin.int_(dst(new Date)?1:0),a.tzname=new Sk.builtin.tuple(function timeZoneNames(){var a=new Date(2002,0,1),b=new Date(2002,6,1);return dst(a)?[new Sk.builtin.str(timeZoneName(b)),new Sk.builtin.str(timeZoneName(a))]:[new Sk.builtin.str(timeZoneName(a)),new Sk.builtin.str(timeZoneName(b))]}()),a.accept2dyear=Sk.builtin.assk$(1),a.clock=new Sk.builtin.func(function(){var a=0;return a=this.performance&&this.performance.now?performance.now()/1e3:new Date().getTime()/1e3,new Sk.builtin.float_(a)}),a.strftime=new Sk.builtin.func(function strftime_f(a,c){var d;if(Sk.builtin.pyCheckArgsLen("strftime",arguments.length,1,2),!Sk.builtin.checkString(a))throw new Sk.builtin.TypeError("format must be a string");return c?!(c instanceof b)&&(c=new b(c)):c=from_seconds(),check_struct_time(c),d=Sk.ffi.remapToJs(a),Sk.ffi.remapToPy(strftime(d,new Date(1e3*mktime_f(c).v)))}),a.tzset=new Sk.builtin.func(function tzset_f(){throw new Sk.builtin.NotImplementedError("time.tzset() is not yet implemented")}),a.strptime=new Sk.builtin.func(function strptime_f(a,b){Sk.builtin.pyCheckArgsLen("strptime",arguments.length,1,2),Sk.builtin.pyCheckType("string","string",Sk.builtin.checkString(a)),void 0===b?b=new Sk.builtin.str("%a %b %d %H:%M:%S %Y"):Sk.builtin.pyCheckType("format","string",Sk.builtin.checkString(b));let c=date_to_struct_time(strptime(Sk.ffi.remapToJs(a),Sk.ffi.remapToJs(b),!0));return c.v[8]=new Sk.builtin.int_(-1),c}),a};`,"src/lib/timeit.py":`raise NotImplementedError("timeit is not yet implemented in Skulpt")
`,"src/lib/toaiff.py":`raise NotImplementedError("toaiff is not yet implemented in Skulpt")
`,"src/lib/token.js":'var $builtinmodule=function(){var a={__file__:"/src/lib/token.py"};const b=[];for(token in Sk.token.tok_name){const c=Sk.token.tok_name[token].slice(2),d=parseInt(token,10);b.push(Sk.ffi.remapToPy(d)),b.push(Sk.ffi.remapToPy(c)),a[c]=Sk.ffi.remapToPy(d)}return a.tok_name=new Sk.builtin.dict(b),a.ISTERMINAL=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("ISTERMINAL",arguments.length,1,1),Sk.token.ISTERMINAL(Sk.ffi.remapToJs(a))}),a.ISNONTERMINAL=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("ISNONTERMINAL",arguments.length,1,1),Sk.token.ISNONTERMINAL(Sk.ffi.remapToJs(a))}),a.ISEOF=new Sk.builtin.func(function(a){return Sk.builtin.pyCheckArgsLen("ISEOF",arguments.length,1,1),Sk.token.ISEOF(Sk.ffi.remapToJs(a))}),a};',"src/lib/tokenize.js":'var $builtinmodule=function(){var a={tokenize:new Sk.builtin.func(function(a){Sk.builtin.pyCheckArgsLen("tokenize",1,1),Sk.builtin.checkFunction(a);const b=[];return Sk._tokenize("<stdin>",function jsReadline(){const b=Sk.misceval.callsimArray(a);return Sk.ffi.remapToJs(b)},"UTF-8",function receiveToken(a){b.push(new Sk.builtin.tuple([Sk.ffi.remapToPy(a.type),Sk.ffi.remapToPy(a.string),new Sk.builtin.tuple([Sk.ffi.remapToPy(a.start[0]),Sk.ffi.remapToPy(a.start[1])]),new Sk.builtin.tuple([Sk.ffi.remapToPy(a.end[0]),Sk.ffi.remapToPy(a.end[1])]),Sk.ffi.remapToPy(a.line)]))}),new Sk.builtin.list(b)})};return a};',"src/lib/trace.py":`raise NotImplementedError("trace is not yet implemented in Skulpt")
`,"src/lib/traceback.py":`raise NotImplementedError("traceback is not yet implemented in Skulpt")
`,"src/lib/tty.py":`raise NotImplementedError("tty is not yet implemented in Skulpt")
`,"src/lib/turtle.js":`var $builtinmodule=function(){"use strict";var e=function getConfiguredTarget(){var e,t;for(e=Sk.TurtleGraphics&&Sk.TurtleGraphics.target||"turtle",t="string"==typeof e?document.getElementById(e):e;t.firstChild;)t.removeChild(t.firstChild);return t}();return e.turtleInstance?e.turtleInstance.reset():e.turtleInstance=function generateTurtleModule(e){var t=Math.round,r=Math.max,n=Math.sqrt,a=Math.min,s=Math.abs,o=Math.PI,d=Math.atan2,_=Math.sin,c=Math.cos;function getAsset(e){var t=g.assets,r="function"==typeof t?t(e):t[e];return"string"==typeof r?new Promise(function(t,n){var a=new Image;a.onload=function(){g.assets[e]=this,t(a)},a.onerror=function(){n(new Error("Missing asset: "+r))},a.src=r}):new InstantPromise(void 0,r)}function InstantPromise(e,t){this.lastResult=t,this.lastError=e}function FrameManager(){this.reset()}function getFrameManager(){return A||(A=new FrameManager),A}function MouseHandler(){var t=this;for(var r in this._target=getTarget(),this._managers={},this._handlers={mousedown:function(r){t.onEvent("mousedown",r)},mouseup:function(r){t.onEvent("mouseup",r)},mousemove:function(r){t.onEvent("mousemove",r)}},this._handlers)this._target.addEventListener(r,this._handlers[r])}function EventManager(e,t){this._type=e,this._target=t,this._handlers=void 0,getMouseHandler().addManager(e,this)}function Turtle(e){if(getFrameManager().addTurtle(this),this._screen=getScreen(),this._managers={},this._shape=e.v,!v.hasOwnProperty(this._shape))throw new Sk.builtin.ValueError("Shape:'"+this._shape+"' not in default shape, please check shape again!");this.reset()}function Screen(){var e,t;this._frames=1,this._delay=void 0,this._bgcolor="none",this._mode="standard",this._managers={},this._keyLogger={},e=(g.worldWidth||g.width||getWidth())/2,t=(g.worldHeight||g.height||getHeight())/2,this.setUpWorld(-e,-t,e,t)}function ensureAnonymous(){return f||(f=Sk.misceval.callsimArray(y.Turtle)),f.instance}function getTarget(){return e}function getScreen(){return p||(p=new Screen),p}function getMouseHandler(){return h||(h=new MouseHandler),h}function getWidth(){return 0|(p&&p._width||g.width||getTarget().clientWidth||T.width)}function getHeight(){return 0|(p&&p._height||g.height||getTarget().clientHeight||T.height)}function createLayer(e,t){var r,n=document.createElement("canvas"),a=getWidth(),s=getHeight(),l=getTarget().firstChild?-s+"px":"0";return n.width=a,n.height=s,n.style.position="relative",n.style.display="block",n.style.setProperty("margin-top",l),n.style.setProperty("z-index",e),t&&(n.style.display="none"),getTarget().appendChild(n),r=n.getContext("2d"),r.lineCap="round",r.lineJoin="round",applyWorld(getScreen(),r),r}function cancelAnimationFrame(){u&&((window.cancelAnimationFrame||window.mozCancelAnimationFrame)(u),u=void 0),m&&(window.clearTimeout(m),m=void 0)}function applyWorld(e,t){var r=e.llx,n=e.lly,a=e.urx,s=e.ury,l=e.xScale,i=e.yScale;t&&(clearLayer(t),t.restore(),t.save(),t.scale(1/l,1/i),t.translate(-r,-s))}function pushUndo(e){var t,r,n;if(g.allowUndo&&e._bufferSize){for(e._undoBuffer||(e._undoBuffer=[]);e._undoBuffer.length>e._bufferSize;)e._undoBuffer.shift();for(r={},t=["x","y","angle","radians","color","fill","down","filling","shown","shape","size"],n=0;n<t.length;n++)r[t[n]]=e["_"+t[n]];return e._undoBuffer.push(r),e.addUpdate(function(){r.fillBuffer=this.fillBuffer?this.fillBuffer.slice():void 0,e._paper&&e._paper.canvas&&(r.image=e._paper.canvas.toDataURL())},!1)}}function popUndo(e){var t;if(e._bufferSize&&e._undoBuffer&&(t=e._undoBuffer.pop(),!!t)){for(var r in t)"image"!=r&&"fillBuffer"!==r&&(e["_"+r]=t[r]);return e.addUpdate(function(){var e;t.image&&(L.src=t.image,e=L),clearLayer(this.context(),!1,L),delete t.image},!0,t)}}function removeLayer(e){e&&e.canvas&&e.canvas.parentNode&&e.canvas.parentNode.removeChild(e.canvas)}function clearLayer(e,t,r){e&&(e.save(),e.setTransform(1,0,0,1,0,0),t?(e.fillStyle=t,e.fillRect(0,0,e.canvas.width,e.canvas.height)):e.clearRect(0,0,e.canvas.width,e.canvas.height),r&&e.drawImage(r,0,0),e.restore())}function drawTurtle(e,t){var r,n,a,s=v[e.shape],l=getScreen(),u=getWidth(),m=getHeight(),p=l.xScale,g=l.yScale;if(t){if(r=c(e.radians)/p,n=_(e.radians)/g,a=d(n,r)-o/2,t.save(),t.translate(e.x,e.y),t.scale(p,g),s.nodeName){var f=s.naturalWidth,h=s.naturalHeight;t.drawImage(s,0,0,f,h,-f/2,-h/2,f,h)}else{t.rotate(a),t.beginPath(),t.lineWidth=1,t.strokeStyle=e.color,t.fillStyle=e.fill,t.moveTo(-s[0][0],s[0][1]);for(var $=1;$<s.length;$++)t.lineTo(-s[$][0],s[$][1]);t.closePath(),t.fill(),t.stroke()}t.restore()}}function drawDot(e,t){var r=this.context(),n=getScreen(),l=n.xScale,i=n.yScale;r&&(r.beginPath(),r.moveTo(this.x,this.y),e*=a(s(l),s(i)),r.arc(this.x,this.y,e/2,0,Turtle.RADIANS),r.closePath(),r.fillStyle=t||this.color,r.fill())}function measureText(e,t){return t&&(S.font=t),S.measureText(e).width}function drawText(e,t,r){var n=this.context();n&&(n.save(),r&&(n.font=r),t&&t.match(/^(left|right|center)$/)&&(n.textAlign=t),n.scale(1,-1),n.fillStyle=this.fill,n.fillText(e,this.x,-this.y),n.restore())}function drawLine(e,t){var r=this.context();r&&(t&&(r.beginPath(),r.moveTo(this.x,this.y)),r.lineWidth=this.size*getScreen().lineScale,r.strokeStyle=this.color,r.lineTo(e.x,e.y),r.stroke())}function drawFill(){var e,t=this.context(),r=this.fillBuffer;if(t&&r&&r.length){for(t.save(),t.beginPath(),t.moveTo(r[0].x,r[0].y),e=1;e<r.length;e++)t.lineTo(r[e].x,r[e].y);for(t.closePath(),t.fillStyle=this.fill,t.fill(),e=1;e<r.length;e++)r[e].stroke&&(t.beginPath(),t.moveTo(r[e-1].x,r[e-1].y),t.lineWidth=r[e].size*getScreen().lineScale,t.strokeStyle=r[e].color,t.lineTo(r[e].x,r[e].y),t.stroke());t.restore()}}function partialTranslate(e,t,r,n,a){return function(){return e.addUpdate(function(e){this.down&&drawLine.call(this,e,n)},a,{x:t,y:r},n)}}function translate(e,a,l,o,d,_,c){var u,m=e._computed_speed,p=getScreen(),g=s(p.xScale),f=s(p.yScale),h=a,$=l,w=n(o*o*g+d*d*f),b=m?t(r(1,w/m)):1,v=getFrameManager().willRenderNext()?Promise.resolve():new InstantPromise;for(e.addUpdate(function(){this.filling&&this.fillBuffer.push({x:this.x,y:this.y,stroke:this.down,color:this.color,size:this.size})},!1),u=0;u<b;u++)h=a+o/b*(u+1),$=l+d/b*(u+1),v=v.then(partialTranslate(e,h,$,_,m||!c)),_=!1;return v.then(function(){return[a+o,l+d]})}function partialRotate(e,t,r,n){return function(){return e.addUpdate(void 0,n,{angle:t,radians:r})}}function rotate(e,n,a,l){var o,d=e._computed_speed,_=360*(a/e._fullCircle),c=d?t(r(1,s(_)/d)):1,u={},m=getFrameManager().willRenderNext()?Promise.resolve():new InstantPromise;for(o=0;o<c;o++)calculateHeading(e,n+a/c*(o+1),u),m=m.then(partialRotate(e,u.angle,u.radians,d||!l));return m.then(function(){return calculateHeading(e,n+a)})}function getCoordinates(e,t){return void 0===t&&(t=e&&(e.y||e._y||e[1])||0,e=e&&(e.x||e._x||e[0])||0),{x:e,y:t}}function hexToRGB(e){var t,r,n;return(t=/^rgba?\\((\\d+),(\\d+),(\\d+)(?:,([.\\d]+))?\\)$/.exec(e))?(n=[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])],t[4]&&n.push(parseFloat(t[4]))):/^#?[a-f\\d]{3}|[a-f\\d]{6}$/i.exec(e)?(4===e.length&&(e=e.replace(/^#?([a-f\\d])([a-f\\d])([a-f\\d])$/i,function(e,t,r,n){return t+t+r+r+n+n})),r=/^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(e),n=[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]):n=e,n}function createColor(e,t,n,s,l){var o;if(void 0!==n&&(t=[t,n,s,l]),t.constructor===Array&&t.length){if(255===e){for(o=0;3>o;o++)if("number"==typeof t[o])t[o]=r(0,a(255,parseInt(t[o])));else throw new Sk.builtin.ValueError("bad color sequence");}else for(o=0;3>o;o++)if("number"!=typeof t[o])throw new Sk.builtin.ValueError("bad color sequence");else if(1>=t[o])t[o]=r(0,a(255,parseInt(255*t[o])));else throw new Sk.builtin.ValueError("bad color sequence");"number"==typeof t[o]?(t[3]=r(0,a(1,t[o])),t="rgba("+t.join(",")+")"):t="rgb("+t.slice(0,3).join(",")+")"}else if("string"==typeof t&&!t.match(/\\s*url\\s*\\(/i))t=t.replace(/\\s+/g,"");else return"black";return t}function calculateHeading(e,t,r){var n=e._angle||0,a=e._radians||0;return r||(r={}),"number"==typeof t&&(e._isRadians?n=a=t%Turtle.RADIANS:e._fullCircle?(n=t%e._fullCircle,a=n/e._fullCircle*Turtle.RADIANS):n=a=0,0>n&&(n+=e._fullCircle,a+=Turtle.RADIANS)),r.angle=n,r.radians=a,r}function pythonToJavascriptFunction(e,t){return function(){var r=Array.prototype.slice.call(arguments),n=r.map(function(e){return Sk.ffi.remapToPy(e)});return"undefined"!=typeof t&&n.unshift(t),Sk.misceval.applyAsync(void 0,e,void 0,void 0,void 0,n).catch(Sk.uncaughtException)}}function addModuleMethod(e,t,r,n){var a,s=r.replace(/^\\$/,""),l=s.replace(/_\\$[a-z]+\\$$/i,""),o=e.prototype[r].length,d=e.prototype[r].minArgs,_=e.prototype[r].co_varnames||[],c=e.prototype[r].returnType,u=e.prototype[r].isSk;void 0===d&&(d=o),a=function(){var e,t,a,s,_,m=Array.prototype.slice.call(arguments,0),p=n?n():m.shift().instance;if(m.length<d||m.length>o)throw _=d===o?"exactly "+o:"between "+d+" and "+o,new Sk.builtin.TypeError(l+"() takes "+_+" positional argument(s) ("+m.length+" given)");for(e=m.length;0<=--e;)void 0!==m[e]&&(m[e]=m[e]instanceof Sk.builtin.func?pythonToJavascriptFunction(m[e]):m[e]instanceof Sk.builtin.method?pythonToJavascriptFunction(m[e].im_func,m[e].im_self):m[e]&&m[e].$d instanceof Sk.builtin.dict&&m[e].instance?m[e].instance:Sk.ffi.remapToJs(m[e]));var g=m.slice(0);for(m=[],e=g.length;0<=e;--e)null!==g[e]&&(m[e]=g[e]);try{t=p[r].apply(p,m)}catch(t){throw window&&window.console&&(window.console.log("wrapped method failed"),window.console.log(t.stack)),t}return t instanceof InstantPromise&&(t=t.lastResult),t instanceof Promise?(t=t.catch(function(t){throw window&&window.console&&(window.console.log("promise failed"),window.console.log(t.stack)),t}),a=new Sk.misceval.Suspension,a.resume=function(){return void 0===s?Sk.builtin.none.none$:Sk.ffi.remapToPy(s)},a.data={type:"Sk.promise",promise:t.then(function(e){return s=e,e})},a):void 0===t?Sk.builtin.none.none$:u?t:"function"==typeof c?c(t):Sk.ffi.remapToPy(t)},a.co_name=new Sk.builtin.str(l),a.co_varnames=_.slice(),a.$defaults=[];for(var m=d;m<_.length;m++)a.$defaults.push(Sk.builtin.none.none$);n||a.co_varnames.unshift("self"),t[s]=new Sk.builtin.func(a)}function initTurtle(e,t){Sk.builtin.pyCheckArgs("__init__",arguments,2,3,!1,!1),e.instance=new Turtle(t),e.instance.skInstance=e}function focusTurtle(e){return void 0!==e&&(w=!!e,w?getTarget().focus():getTarget().blur()),w}function resetTurtle(){for(cancelAnimationFrame(),getScreen().reset(),getFrameManager().reset();e.firstChild;)e.removeChild(e.firstChild);h&&h.reset(),$=0,p=void 0,f=void 0,h=void 0,k=0}function stopTurtle(){cancelAnimationFrame(),h&&h.reset(),$=0,p=void 0,f=void 0,h=void 0,k=0}var u,m,p,g,f,h,y={__name__:new Sk.builtin.str("turtle")},$=0,w=!0,b=1e3/30,v={},k=0,x={},T={target:"turtle",width:400,height:400,worldWidth:0,worldHeight:0,animate:!0,bufferSize:0,allowUndo:!0,assets:{}};e.hasAttribute("tabindex")||e.setAttribute("tabindex",0),x.FLOAT=function(e){return new Sk.builtin.float_(e)},x.COLOR=function(e){if("string"==typeof e)return new Sk.builtin.str(e);for(var t=0;3>t;t++)e[t]=Sk.builtin.assk$(e[t]);return 4===e.length&&(e[3]=new Sk.builtin.float_(e[3])),new Sk.builtin.tuple(e)},x.TURTLE_LIST=function(e){for(var t=[],r=0;r<e.length;r++)t.push(e[r].skInstance);return new Sk.builtin.tuple(t)},v.arrow=[[-10,0],[10,0],[0,10]],v.square=[[10,-10],[10,10],[-10,10],[-10,-10]],v.triangle=[[10,-5.77],[0,11.55],[-10,-5.77]],v.classic=[[0,0],[-5,-9],[0,-7],[5,-9]],v.turtle=[[0,16],[-2,14],[-1,10],[-4,7],[-7,9],[-9,8],[-6,5],[-7,1],[-5,-3],[-8,-6],[-6,-8],[-4,-5],[0,-7],[4,-5],[6,-8],[8,-6],[5,-3],[7,1],[6,5],[9,8],[7,9],[4,7],[1,10],[2,14]],v.circle=[[10,0],[9.51,3.09],[8.09,5.88],[5.88,8.09],[3.09,9.51],[0,10],[-3.09,9.51],[-5.88,8.09],[-8.09,5.88],[-9.51,3.09],[-10,0],[-9.51,-3.09],[-8.09,-5.88],[-5.88,-8.09],[-3.09,-9.51],[-0,-10],[3.09,-9.51],[5.88,-8.09],[8.09,-5.88],[9.51,-3.09]],g=function(){for(var e in Sk.TurtleGraphics||(Sk.TurtleGraphics={}),T)Sk.TurtleGraphics.hasOwnProperty(e)||(Sk.TurtleGraphics[e]=T[e]);return Sk.TurtleGraphics}(),InstantPromise.prototype.then=function(e){if(this.lastError)return this;try{this.lastResult=e(this.lastResult)}catch(t){this.lastResult=void 0,this.lastError=t}return this.lastResult instanceof Promise?this.lastResult:this},InstantPromise.prototype.catch=function(e){if(this.lastError)try{this.lastResult=e(this.lastError),this.lastError=void 0}catch(t){this.lastResult=void 0,this.lastError=t}return this.lastResult instanceof Promise?this.lastResult:this};var A;(function(e){function animationFrame(e){return g.animate?!e&&t?t:function(t){return m=window.setTimeout(t,e||b),m}:function(e){e()}}var t;(function(e){e&&(t=function(t){return u=e(t)})})(window.requestAnimationFrame||window.mozRequestAnimationFrame),e.willRenderNext=function(){return!!(this._buffer&&this._frameCount+1===this.frameBuffer())},e.turtles=function(){return this._turtles},e.addTurtle=function(e){this._turtles.push(e)},e.reset=function(){if(this._turtles)for(var e=this._turtles.length;0<=--e;)this._turtles[e].reset();this._turtles=[],this._frames=[],this._frameCount=0,this._buffer=1,this._rate=0,this._animationFrame=animationFrame()},e.addFrame=function(e,t){var r=!1;return t&&(this._frameCount+=1),this.frames().push(e),r=!g.animate||this._buffer&&this._frameCount===this.frameBuffer(),r?this.update():new InstantPromise},e.frames=function(){return this._frames},e.frameBuffer=function(e){return"number"==typeof e&&(this._buffer=0|e,e&&e<=this._frameCount)?this.update():this._buffer},e.refreshInterval=function(e){return"number"==typeof e&&(this._rate=0|e,this._animationFrame=animationFrame(e)),this._rate},e.update=function(){return this._frames&&this._frames.length?this.requestAnimationFrame():new InstantPromise},e.requestAnimationFrame=function(){var e,t,r=this._frames,n=this._animationFrame,a=this._turtles,s=getScreen().spriteLayer();return this._frames=[],this._frameCount=0,new Promise(function(l){n(function paint(){for(t=0;t<r.length;t++)r[t]&&r[t]();for(clearLayer(s),t=0;t<a.length;t++)e=a[t],e.getState().shown&&drawTurtle(e.getState(),s);l()})})}})(FrameManager.prototype),function(e){e.onEvent=function(t,r){function computeCoordinates(){if(!_){var t=getScreen(),l=t.spriteLayer().canvas.getBoundingClientRect();e=0|r.clientX-l.left,n=0|r.clientY-l.top,a=e*t.xScale+t.llx,s=n*t.yScale+t.ury,_=!0}}var e,n,a,s,l,o=this._managers[t],d=this._managers.mousemove,_=!1;if(("mousedown"===t||"mouseup"===t)&&d&&d.length)for(computeCoordinates(),l=d.length;0<=--l;)d[l].test(e,n,a,s)&&d[l].canMove("mousedown"===t);if(o&&o.length)for(computeCoordinates(),l=o.length;0<=--l;)"mousemove"===t&&o[l].canMove()&&o[l].test(e,n,a,s)?o[l].trigger([a,s]):"mousedown"===t&&o[l].test(e,n,a,s)&&o[l].trigger([a,s])},e.reset=function(){this._managers={}},e.addManager=function(e,t){this._managers[e]||(this._managers[e]=[]),this._managers[e].push(t)}}(MouseHandler.prototype),function(e){e.reset=function(){this._handlers=void 0},e.canMove=function(e){return!!(this._target&&this._target.hitTest)&&(void 0!==e&&(this._target.hitTest.hit=e),this._target.hitTest.hit)},e.test=function(e,t,r,n){return this._target&&this._target.hitTest?this._target.hitTest(e,t,r,n):!!this._target},e.trigger=function(e){var t,r=this._handlers;if(r&&r.length)for(t=0;t<r.length;t++)r[t].apply({},e)},e.addHandler=function(e,t){var r=this._handlers;if(!t&&r&&r.length)for(;r.shift(););return"function"==typeof e?void(!r&&(r=this._handlers=[]),r.push(e)):void(r&&!r.length&&this.reset())}}(EventManager.prototype),Turtle.RADIANS=2*o,function(e){function circleRotate(e,t,r){return function(){return e.addUpdate(void 0,!1,{angle:t,radians:r})}}function circleSegment(e,t,r,n,a,s){return function(){return e.translate(t,r,n,a,s,!0)}}e.hitTest=function(e,t){var r=getScreen().hitTestLayer();clearLayer(r),drawTurtle(this.getState(),r);var n=r.getImageData(e,t,1,1).data;return n[3]||n[0]||n[1]||n[2]},e.addUpdate=function(e,t,r){var n=this,a=this.getState(),s=Array.prototype.slice.call(arguments,r?2:3);return getFrameManager().addFrame(function(){if(e&&e.apply(a,s),r)for(var t in r)a[t]=r[t]},t)},e.getState=function(){var e=this;return this._state||(this._state={x:this._x,y:this._y,angle:this._angle,radians:this._radians,shape:this._shape,color:this._color,fill:this._fill,filling:this._filling,size:this._size,speed:this._computed_speed,down:this._down,shown:this._shown,colorMode:this._colorMode,context:function(){return e.getPaper()}}),this._state},e.translate=function(e,t,r,n,a,s){var l=this;return translate(this,e,t,r,n,a,s).then(function(e){l._x=e[0],l._y=e[1]})},e.rotate=function(e,t,r){var n=this;return rotate(this,e,t,r).then(function(e){n._angle=e.angle,n._radians=e.radians})},e.queueMoveBy=function(e,t,r,n){var a=c(r)*n,s=_(r)*n;return this.translate(e,t,a,s,!0)},e.queueTurnTo=function(e,t){return t%=this._fullCircle,0>t&&(t+=this._fullCircle),this.rotate(e,t-e)},e.getManager=function(e){return this._managers[e]||(this._managers[e]=new EventManager(e,this)),this._managers[e]},e.getPaper=function(){return this._paper||(this._paper=createLayer(2))},e.reset=function(){for(var e in this._x=0,this._y=0,this._radians=0,this._angle=0,this._shown=!0,this._down=!0,this._color="black",this._fill="black",this._size=1,this._filling=!1,this._undoBuffer=[],this._speed=3,this._computed_speed=5,this._colorMode=1,this._state=void 0,this._managers)this._managers[e].reset();this._isRadians=!1,this._fullCircle=360,this._bufferSize="number"==typeof g.bufferSize?g.bufferSize:0,removeLayer(this._paper),this._paper=void 0},e.$degrees=function(e){return e="number"==typeof e?s(e):360,this._isRadians=!1,this._angle=e&&this._fullCircle?this._angle/this._fullCircle*e:this._radians=0,this._fullCircle=e,this.addUpdate(void 0,!1,{angle:this._angle,radians:this._radians})},e.$degrees.minArgs=0,e.$degrees.co_varnames=["fullcircle"],e.$degrees.returnType=x.FLOAT,e.$radians=function(){return this._isRadians||(this._isRadians=!0,this._angle=this._radians,this._fullCircle=Turtle.RADIANS),this._angle},e.$radians.returnType=x.FLOAT,e.$position=e.$pos=function(){return[this.$xcor(),this.$ycor()]},e.$position.returnType=function(e){return new Sk.builtin.tuple([new Sk.builtin.float_(e[0]),new Sk.builtin.float_(e[1])])},e.$towards=function(e,t){var r=getCoordinates(e,t),n=o+d(this._y-r.y,this._x-r.x),a=n*(this._fullCircle/Turtle.RADIANS);return a},e.$towards.co_varnames=["x","y"],e.$towards.minArgs=1,e.$towards.returnType=x.FLOAT,e.$distance=function(e,t){var r=getCoordinates(e,t),a=r.x-this._x,s=r.y-this._y;return n(a*a+s*s)},e.$distance.co_varnames=["x","y"],e.$distance.minArgs=1,e.$distance.returnType=x.FLOAT,e.$heading=function(){return 1e-13>s(this._angle)?0:this._angle},e.$heading.returnType=x.FLOAT,e.$xcor=function(){return 1e-13>s(this._x)?0:this._x},e.$xcor.returnType=x.FLOAT,e.$ycor=function(){return 1e-13>s(this._y)?0:this._y},e.$ycor.returnType=x.FLOAT,e.$forward=e.$fd=function(e){return pushUndo(this),this.queueMoveBy(this._x,this._y,this._radians,e)},e.$forward.co_varnames=e.$fd.co_varnames=["distance"],e.$undo=function(){popUndo(this)},e.$undobufferentries=function(){return this._undoBuffer.length},e.$setundobuffer=function(e){this._bufferSize="number"==typeof e?a(s(e),1e3):0},e.$setundobuffer.co_varnames=["size"],e.$backward=e.$back=e.$bk=function(e){return pushUndo(this),this.queueMoveBy(this._x,this._y,this._radians,-e)},e.$backward.co_varnames=e.$back.co_varnames=e.$bk.co_varnames=["distance"],e.$goto_$rw$=e.$setpos=e.$setposition=function(e,t){var r=getCoordinates(e,t);return pushUndo(this),this.translate(this._x,this._y,r.x-this._x,r.y-this._y,!0)},e.$goto_$rw$.co_varnames=e.$setpos.co_varnames=e.$setposition.co_varnames=["x","y"],e.$goto_$rw$.minArgs=e.$setpos.minArgs=e.$setposition.minArgs=1,e.$setx=function(e){return this.translate(this._x,this._y,e-this._x,0,!0)},e.$setx.co_varnames=["x"],e.$sety=function(e){return this.translate(this._x,this._y,0,e-this._y,!0)},e.$sety.co_varnames=["y"],e.$home=function(){var e=this,t=this._angle;return pushUndo(this),e.translate(this._x,this._y,-this._x,-this._y,!0).then(function(){return e.queueTurnTo(t,0)}).then(function(){})},e.$right=e.$rt=function(e){return pushUndo(this),this.rotate(this._angle,-e)},e.$right.co_varnames=e.$rt.co_varnames=["angle"],e.$left=e.$lt=function(e){return pushUndo(this),this.rotate(this._angle,e)},e.$left.co_varnames=e.$lt.co_varnames=["angle"],e.$setheading=e.$seth=function(e){return pushUndo(this),this.queueTurnTo(this._angle,e)},e.$setheading.co_varnames=e.$seth.co_varnames=["angle"],e.$circle=function(e,t,r){var n,d,u,m,p,g,f,h,$,b=this,v=this._x,k=this._y,T=this._angle,A={},L=1/getScreen().lineScale,S=!0;for(pushUndo(this),void 0===t&&(t=b._fullCircle),void 0===r&&(d=s(t)/b._fullCircle,r=1+(0|a(11+s(e*L)/6,59)*d)),u=t/r,m=.5*u,p=2*e*_(u*o/b._fullCircle),0>e?(p=-p,u=-u,m=-m,n=T-t):n=T+t,$=getFrameManager().willRenderNext()?Promise.resolve():new InstantPromise,T+=m,g=0;g<r;g++)calculateHeading(b,T+u*g,A),f=c(A.radians)*p,h=_(A.radians)*p,$=$.then(circleRotate(b,A.angle,A.radians)).then(circleSegment(b,v,k,f,h,S)),v+=f,k+=h,S=!1;return $=$.then(function(){return calculateHeading(b,n,A),b._angle=A.angle,b._radians=A.radians,b.addUpdate(void 0,!0,A)}),$},e.$circle.co_varnames=["radius","extent","steps"],e.$circle.minArgs=1,e.$penup=e.$up=e.$pu=function(){return this._down=!1,this.addUpdate(void 0,!1,{down:!1})},e.$pendown=e.$down=e.$pd=function(){return this._down=!0,this.addUpdate(void 0,!1,{down:!0})},e.$isdown=function(){return this._down},e.$speed=function(e){return void 0===e?this._speed:(this._speed=r(0,a(1e3,e)),this._computed_speed=r(0,2*e-1),this.addUpdate(void 0,!1,{speed:this._computed_speed}))},e.$speed.minArgs=0,e.$speed.co_varnames=["speed"],e.$pencolor=function(e,t,r,n){return void 0===e?hexToRGB(this._color):(this._color=createColor(this._colorMode,e,t,r,n),this.addUpdate(void 0,this._shown,{color:this._color}))},e.$pencolor.co_varnames=["r","g","b","a"],e.$pencolor.minArgs=0,e.$pencolor.returnType=x.COLOR,e.$fillcolor=function(e,t,r,n){return void 0===e?hexToRGB(this._fill):(this._fill=createColor(this._colorMode,e,t,r,n),this.addUpdate(void 0,this._shown,{fill:this._fill}))},e.$fillcolor.co_varnames=["r","g","b","a"],e.$fillcolor.minArgs=0,e.$fillcolor.returnType=x.COLOR,e.$color=function(e,t,r,n){return void 0===e?[this.$pencolor(),this.$fillcolor()]:(void 0===t||void 0!==r?(this._color=createColor(this._colorMode,e,t,r,n),this._fill=this._color):(this._color=createColor(this._colorMode,e),this._fill=createColor(this._colorMode,t)),this.addUpdate(void 0,this._shown,{color:this._color,fill:this._fill}))},e.$color.minArgs=0,e.$color.co_varnames=["color","fill","b","a"],e.$color.returnType=function(e){return new Sk.builtin.tuple([x.COLOR(e[0]),x.COLOR(e[1])])},e.$fill=function(e){this;return void 0===e?this._filling:(e=!!e,e===this._filling)?void 0:(this._filling=e,e?(pushUndo(this),this.addUpdate(void 0,!1,{filling:!0,fillBuffer:[{x:this._x,y:this._y}]})):(pushUndo(this),this.addUpdate(function(){this.fillBuffer.push(this),drawFill.call(this)},!0,{filling:!1,fillBuffer:void 0})))},e.$fill.co_varnames=["flag"],e.$fill.minArgs=0,e.$begin_fill=function(){return this.$fill(!0)},e.$end_fill=function(){return this.$fill(!1)},e.$stamp=function(){return pushUndo(this),this.addUpdate(function(){drawTurtle(this,this.context())},!0)},e.$dot=function(e,t,n,l,i){return pushUndo(this),e=Sk.builtin.asnum$(e),e="number"==typeof e?r(1,0|s(e)):r(this._size+4,2*this._size),t=void 0===t?this._color:createColor(this._colorMode,t,n,l,i),this.addUpdate(drawDot,!0,void 0,e,t)},e.$dot.co_varnames=["size","color","g","b","a"],e.$write=function(e,t,r,n){var a,s,l,i,o,d=this;return pushUndo(this),e+="",n&&n.constructor===Array&&(s="string"==typeof n[0]?n[0]:"Arial",l=(n[1]||"12pt")+"",i="string"==typeof n[2]?n[2]:"normal",/^\\d+$/.test(l)&&(l+="pt"),n=[i,l,s].join(" ")),r||(r="left"),a=this.addUpdate(drawText,!0,void 0,e,r,n),t&&("left"===r||"center"===r)&&(o=measureText(e,n),"center"===r&&(o/=2),a=a.then(function(){var e=d.getState();return d.translate(e.x,e.y,o,0,!0)})),a},e.$write.co_varnames=["message","move","align","font"],e.$write.minArgs=1,e.$pensize=e.$width=function(e){return void 0===e?this._size:(this._size=e,this.addUpdate(void 0,this._shown,{size:e}))},e.$pensize.minArgs=e.$width.minArgs=0,e.$pensize.co_varnames=e.$width.co_varnames=["width"],e.$showturtle=e.$st=function(){return this._shown=!0,this.addUpdate(void 0,!0,{shown:!0})},e.$hideturtle=e.$ht=function(){return this._shown=!1,this.addUpdate(void 0,!0,{shown:!1})},e.$isvisible=function(){return this._shown},e.$shape=function(e){return e&&v[e]?(this._shape=e,this.addUpdate(void 0,this._shown,{shape:e})):this._shape},e.$shape.minArgs=0,e.$shape.co_varnames=["name"],e.$colormode=function(e){return void 0===e?this._colorMode:(this._colorMode=255===e?255:1,this.addUpdate(void 0,this._shown,{colorMode:this._colorMode}))},e.$colormode.minArgs=0,e.$colormode.co_varnames=["cmode"],e.$colormode.returnType=function(e){return 255===e?new Sk.builtin.int_(255):new Sk.builtin.float_(1)},e.$window_width=function(){return this._screen.$window_width()},e.$window_height=function(){return this._screen.$window_height()},e.$tracer=function(e,t){return this._screen.$tracer(e,t)},e.$tracer.minArgs=0,e.$tracer.co_varnames=["n","delay"],e.$update=function(){return this._screen.$update()},e.$delay=function(e){return this._screen.$delay(e)},e.$delay.minArgs=0,e.$delay.co_varnames=["delay"],e.$reset=function(){return this.reset(),this.$clear()},e.$mainloop=e.$done=function(){return this._screen.$mainloop()},e.$clear=function(){return this.addUpdate(function(){clearLayer(this.context())},!0)},e.$dot.minArgs=0,e.$onclick=function(e,t,r){this.getManager("mousedown").addHandler(e,r)},e.$onclick.minArgs=1,e.$onclick.co_varnames=["method","btn","add"],e.$onrelease=function(e,t,r){this.getManager("mouseup").addHandler(e,r)},e.$onrelease.minArgs=1,e.$onrelease.co_varnames=["method","btn","add"],e.$ondrag=function(e,t,r){this.getManager("mousemove").addHandler(e,r)},e.$ondrag.minArgs=1,e.$ondrag.co_varnames=["method","btn","add"],e.$getscreen=function(){return Sk.misceval.callsimArray(y.Screen)},e.$getscreen.isSk=!0,e.$clone=function(){var e=Sk.misceval.callsimOrSuspendArray(y.Turtle);return e.instance._x=this._x,e.instance._y=this._y,e.instance._angle=this._angle,e.instance._radians=this._radians,e.instance._shape=this._shape,e.instance._color=this._color,e.instance._fill=this._fill,e.instance._filling=this._filling,e.instance._size=this._size,e.instance._computed_speed=this._computed_speed,e.instance._down=this._down,e.instance._shown=this._shown,e.instance._colorMode=this._colorMode,e.instance._isRadians=this._isRadians,e.instance._fullCircle=this._fullCircle,e.instance._bufferSize=this._bufferSize,e.instance._undoBuffer=this._undoBuffer,e._clonedFrom=this,e},e.$clone.returnType=function(e){return e},e.$getturtle=e.$getpen=function(){return this.skInstance},e.$getturtle.isSk=!0}(Turtle.prototype),function(e){e.spriteLayer=function(){return this._sprites||(this._sprites=createLayer(3))},e.bgLayer=function(){return this._background||(this._background=createLayer(1))},e.hitTestLayer=function(){return this._hitTest||(this._hitTest=createLayer(0,!0))},e.getManager=function(e){return this._managers[e]||(this._managers[e]=new EventManager(e,this)),this._managers[e]},e.reset=function(){for(var e in this._keyListeners=void 0,this._keyLogger)window.clearInterval(this._keyLogger[e]),window.clearTimeout(this._keyLogger[e]),delete this._keyLogger[e];for(e in this._keyDownListener&&(getTarget().removeEventListener("keydown",this._keyDownListener),this._keyDownListener=void 0),this._keyUpListener&&(getTarget().removeEventListener("keyup",this._keyUpListener),this._keyUpListener=void 0),this._timer&&(window.clearTimeout(this._timer),this._timer=void 0),this._managers)this._managers[e].reset();this._mode="standard",removeLayer(this._sprites),this._sprites=void 0,removeLayer(this._background),this._background=void 0},e.setUpWorld=function(e,t,r,n){var l=this;l.llx=e,l.lly=t,l.urx=r,l.ury=n,l.xScale=(r-e)/getWidth(),l.yScale=-1*(n-t)/getHeight(),l.lineScale=a(s(l.xScale),s(l.yScale))},e.$setup=function(e,t,r,n){return isNaN(parseFloat(e))&&(e=getWidth()),isNaN(parseFloat(t))&&(t=getHeight()),1>=e&&(e=getWidth()*e),1>=t&&(t=getHeight()*t),this._width=e,this._height=t,this._xOffset=void 0===r||isNaN(parseInt(r))?0:parseInt(r),this._yOffset=void 0===n||isNaN(parseInt(n))?0:parseInt(n),"world"===this._mode?this._setworldcoordinates(this.llx,this.lly,this.urx,this.ury):this._setworldcoordinates(-e/2,-t/2,e/2,t/2)},e.$setup.minArgs=0,e.$setup.co_varnames=["width","height","startx","starty"],e.$register_shape=e.$addshape=function(e,t){return t?void(v[e]=t):getAsset(e).then(function(t){v[e]=t})},e.$register_shape.minArgs=1,e.$getshapes=function(){return Object.keys(v)},e.$tracer=function(e,t){return void 0!==e||void 0!==t?("number"==typeof t&&(this._delay=t,getFrameManager().refreshInterval(t)),"number"==typeof e?(this._frames=e,getFrameManager().frameBuffer(e)):void 0):this._frames},e.$tracer.co_varnames=["frames","delay"],e.$tracer.minArgs=0,e.$delay=function(e){return void 0===e?void 0===this._delay?b:this._delay:this.$tracer(void 0,e)},e.$delay.co_varnames=["delay"],e._setworldcoordinates=function(e,t,r,n){var a=this,s=getFrameManager().turtles();return this.setUpWorld(e,t,r,n),this._sprites&&applyWorld(this,this._sprites),this._background&&applyWorld(this,this._background),this.$clear()},e.$setworldcoordinates=function(e,t,r,n){return this._mode="world",this._setworldcoordinates(e,t,r,n)},e.$setworldcoordinates.co_varnames=["llx","lly","urx","ury"],e.minArgs=4,e.$clear=e.$clearscreen=function(){return this.reset(),this.$reset()},e.$update=function(){return getFrameManager().update()},e.$reset=e.$resetscreen=function(){var e=this,t=getFrameManager().turtles();return getFrameManager().addFrame(function(){applyWorld(e,e._sprites),applyWorld(e,e._background);for(var r=0;r<t.length;r++)t[r].reset(),applyWorld(e,t[r]._paper)},!0)},e.$window_width=function(){return getWidth()},e.$window_height=function(){return getHeight()},e.$delay.minArgs=0,e.$turtles=function(){return getFrameManager().turtles()},e.$turtles.returnType=x.TURTLE_LIST,e.$bgpic=function(e){var t;return e?(t=this,getAsset(e).then(function(e){clearLayer(t.bgLayer(),void 0,e)})):this._bgpic},e.$bgpic.minArgs=0,e.$bgpic.co_varnames=["name"],e.$bgcolor=function(e,t,r,n){return void 0===e?hexToRGB(this._bgcolor):(this._bgcolor=createColor(this._colorMode,e,t,r,n),void clearLayer(this.bgLayer(),this._bgcolor))},e.$bgcolor.minArgs=0,e.$bgcolor.co_varnames=["color","g","b","a"],e.$bgcolor.returnType=x.COLOR,e.$mainloop=e.$done=function(){},e.$bye=function(){return Sk.TurtleGraphics.reset()},e.$exitonclick=function(){return this._exitOnClick=!0,this.getManager("mousedown").addHandler(function(){resetTurtle()},!1)},e.$onclick=function(e,t,r){this._exitOnClick||this.getManager("mousedown").addHandler(e,r)},e.$onclick.minArgs=1,e.$onclick.co_varnames=["method","btn","add"];var t={8:/^back(space)?$/i,9:/^tab$/i,13:/^(enter|return)$/i,16:/^shift$/i,17:/^(ctrl|control)$/i,18:/^alt$/i,27:/^esc(ape)?$/i,32:/^space$/i,33:/^page[\\s\\-]?up$/i,34:/^page[\\s\\-]?down$/i,35:/^end$/i,36:/^home$/i,37:/^left([\\s\\-]?arrow)?$/i,38:/^up([\\s\\-]?arrow)?$/i,39:/^right([\\s\\-]?arrow)?$/i,40:/^down([\\s\\-]?arrow)?$/i,45:/^insert$/i,46:/^del(ete)?$/i};e._createKeyRepeater=function(e,t){var r=this;r._keyLogger[t]=window.setTimeout(function(){r._keyListeners[e](),r._keyLogger[t]=window.setInterval(function(){r._keyListeners[e]()},50)},333)},e._createKeyDownListener=function(){var r=this;this._keyDownListener||(this._keyDownListener=function(n){var e=String.fromCharCode;if(focusTurtle()){var a,s,l=n.charCode||n.keyCode,i=e(l).toLowerCase();if(!r._keyLogger[l])for(a in r._keyListeners)if(s=1<a.length&&t[l]&&t[l].test(a),a===i||s){r._keyListeners[a](),r._createKeyRepeater(a,l),n.preventDefault();break}}},getTarget().addEventListener("keydown",this._keyDownListener))},e._createKeyUpListener=function(){var t=this;this._keyUpListener||(this._keyUpListener=function(r){var e=t._keyLogger[r.charCode||r.keyCode];void 0!==e&&(r.preventDefault(),window.clearInterval(e),window.clearTimeout(e),delete t._keyLogger[r.charCode||r.keyCode])},getTarget().addEventListener("keyup",this._keyUpListener))},e.$title=function(e){document.title=e},e.$title.minArgs=1,e.$title.co_varnames=["title"],e.$listen=function(){this._createKeyUpListener(),this._createKeyDownListener()},e.$onkey=function(e,t){if("function"==typeof t){var r=e;e=t,t=r}t=(t+"").toLowerCase(),e&&"function"==typeof e?(!this._keyListeners&&(this._keyListeners={}),this._keyListeners[t]=e):delete this._keyListeners[t]},e.$onkey.minArgs=2,e.$onkey.co_varnames=["method","keyValue"],e.$onscreenclick=function(e,t,r){this.getManager("mousedown").addHandler(e,r)},e.$onscreenclick.minArgs=1,e.$onscreenclick.co_varnames=["method","btn","add"],e.$ontimer=function(e,t){this._timer&&(window.clearTimeout(this._timer),this._timer=void 0),e&&"number"==typeof t&&(this._timer=window.setTimeout(e,r(0,0|t)))},e.$ontimer.minArgs=0,e.$ontimer.co_varnames=["method","interval"]}(Screen.prototype);var L=new Image,S=document.createElement("canvas").getContext("2d");for(var C in initTurtle.co_varnames=["self","shape"],initTurtle.co_name=new Sk.builtin.str("Turtle"),initTurtle.co_argcount=2,initTurtle.$defaults=[Sk.builtin.none.none$,new Sk.builtin.str("classic")],Turtle.prototype)/^\\$[a-z_]+/.test(C)&&addModuleMethod(Turtle,y,C,ensureAnonymous);return addModuleMethod(Screen,y,"$mainloop",getScreen),addModuleMethod(Screen,y,"$done",getScreen),addModuleMethod(Screen,y,"$bye",getScreen),addModuleMethod(Screen,y,"$tracer",getScreen),addModuleMethod(Screen,y,"$update",getScreen),addModuleMethod(Screen,y,"$delay",getScreen),addModuleMethod(Screen,y,"$window_width",getScreen),addModuleMethod(Screen,y,"$window_height",getScreen),addModuleMethod(Screen,y,"$title",getScreen),y.Turtle=Sk.misceval.buildClass(y,function TurtleWrapper(e,t){for(var r in t.__init__=new Sk.builtin.func(initTurtle),Turtle.prototype)/^\\$[a-z_]+/.test(r)&&addModuleMethod(Turtle,t,r)},"Turtle",[]),y.Screen=Sk.misceval.buildClass(y,function ScreenWrapper(e,t){for(var r in t.__init__=new Sk.builtin.func(function(e){e.instance=getScreen()}),Screen.prototype)/^\\$[a-z_]+/.test(r)&&addModuleMethod(Screen,t,r)},"Screen",[]),{skModule:y,reset:resetTurtle,stop:stopTurtle,focus:focusTurtle,Turtle:Turtle,Screen:Screen}}(e),Sk.TurtleGraphics.module=e.turtleInstance.skModule,Sk.TurtleGraphics.reset=e.turtleInstance.reset,Sk.TurtleGraphics.stop=e.turtleInstance.stop,Sk.TurtleGraphics.focus=e.turtleInstance.focus,Sk.TurtleGraphics.raw={Turtle:e.turtleInstance.Turtle,Screen:e.turtleInstance.Screen},e.turtleInstance.skModule};`,"src/lib/types.py":`"""
This file was modified from CPython.
Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
2011, 2012, 2013, 2014, 2015 Python Software Foundation; All Rights Reserved
"""
"""Define names for all type symbols known in the standard interpreter.
Types that are part of optional modules (e.g. array) are not listed.
"""
import sys

# Iterators in Python aren't a matter of type but of protocol.  A large
# and changing number of builtin types implement *some* flavor of
# iterator.  Don't check the type!  Use hasattr to check for both
# "__iter__" and "next" attributes instead.
MappingProxyType = type(type.__dict__)
WrapperDescriptorType = type(object.__init__)
MethodWrapperType = type(object().__str__)
MethodDescriptorType = type(str.join)
ClassMethodDescriptorType = type(dict.__dict__['fromkeys'])

NoneType = type(None)
TypeType = type
ObjectType = object
IntType = int
try:
    LongType = long
except: pass
FloatType = float
BooleanType = bool
try:
    ComplexType = complex
except NameError:
    pass
StringType = str

# StringTypes is already outdated.  Instead of writing "type(x) in
# types.StringTypes", you should use "isinstance(x, basestring)".  But
# we keep around for compatibility with Python 2.2.
try:
    UnicodeType = unicode
    StringTypes = (StringType, UnicodeType)
except NameError:
    StringTypes = (StringType,)

BufferType = buffer

TupleType = tuple
ListType = list
DictType = DictionaryType = dict

def _f(): pass
FunctionType = type(_f)
LambdaType = type(lambda: None)         # Same as FunctionType
#CodeType = type(_f.func_code)

def _g():
    yield 1
GeneratorType = type(_g())

class _C:
    def _m(self): pass
ClassType = type(_C)
UnboundMethodType = type(_C._m)         # Same as MethodType
_x = _C()
InstanceType = type(_x)
MethodType = type(_x._m)
BuiltinFunctionType = type(len)
BuiltinMethodType = type([].append)     # Same as BuiltinFunctionType

ModuleType = type(sys)
FileType = file
try:
    XRangeType = xrange
except NameError:
    pass

# try:
#     raise TypeError
# except TypeError:
#     tb = sys.exc_info()[2]
#     TracebackType = type(tb)
#     FrameType = type(tb.tb_frame)
#     del tb

SliceType = slice
# EllipsisType = type(Ellipsis)

# DictProxyType = type(TypeType.__dict__)
NotImplementedType = type(NotImplemented)

# For Jython, the following two types are identical
# GetSetDescriptorType = type(FunctionType.func_code)
# MemberDescriptorType = type(FunctionType.func_globals)

del sys, _f, _g, _C, _x                           # Not for export
__all__ = list(n for n in globals() if n[:1] != '_')
`,"src/lib/unittest/__init__.py":`__author__ = 'bmiller'
'''
This is the start of something that behaves like
the unittest module from cpython.

'''
import re

class _AssertRaisesContext(object):
    """A context manager used to implement TestCase.assertRaises* methods."""
    def __init__(self, expected, test_case):
        self.test_case = test_case
        self.expected = expected
        self.exception = None

    def _is_subtype(self, expected, basetype):
        if isinstance(expected, tuple):
            return all(self._is_subtype(e, basetype) for e in expected)
        return isinstance(expected, type) and issubclass(expected, basetype)

    def handle(self, args, kwargs):
        """
        If args is empty, assertRaises is being used as a
        context manager, so return self.
        If args is not empty, call a callable passing positional and keyword
        arguments.
        """
        try:
            if not self._is_subtype(self.expected, BaseException):
                raise TypeError('assertRaises() arg 1 must be an exception type or tuple of exception types')
            if not args:
                return self

            callable_obj = args[0]
            args = args[1:]
            with self:
                callable_obj(*args, **kwargs) 

        finally:
            # bpo-23890: manually break a reference cycle
            self = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, tb):
        res = True
        feedback = ""
        self.exception = exc_value
        try:
            act_exc = exc_type.__name__
        except AttributeError:
            act_exc = str(exc_type)
        try:
            exp_exc = self.expected.__name__
        except AttributeError:
            exp_exc = str(self.expected)

        if exc_type is None:
            res = False
            feedback = "{} not raised".format(exp_exc)
        elif not issubclass(exc_type, self.expected):
            res = False
            feedback = "Expected {} but got {}".format(exp_exc, act_exc)

        self.test_case.appendResult(res, act_exc, exp_exc, feedback)
        return True


class TestCase(object):
    def __init__(self):
        self.numPassed = 0
        self.numFailed = 0
        self.assertPassed = 0
        self.assertFailed = 0
        self.verbosity = 1
        self.tlist = []
        testNames = {}
        for name in dir(self):
            if name[:4] == 'test' and name not in testNames:
                self.tlist.append(getattr(self,name))
                testNames[name]=True

    def setUp(self):
        pass

    def tearDown(self):
        pass
    
    def cleanName(self,funcName):
        return funcName.__func__.__name__

    def main(self):

        for func in self.tlist:
            if self.verbosity > 1:
                print('Running %s' % self.cleanName(func))
            try:
                self.setUp()
                self.assertPassed = 0
                self.assertFailed = 0
                func()
                self.tearDown()
                if self.assertFailed == 0:
                    self.numPassed += 1
                else:
                    self.numFailed += 1
                    print('Tests failed in %s ' % self.cleanName(func))
            except Exception as e:
                self.assertFailed += 1
                self.numFailed += 1
                print('Test threw exception in %s (%s)' % (self.cleanName(func), e))
        self.showSummary()

    def assertEqual(self, actual, expected, feedback=""):
        res = actual==expected
        if not res and feedback == "":
            feedback = "Expected %s to equal %s" % (str(actual),str(expected))
        self.appendResult(res, actual ,expected, feedback)

    def assertNotEqual(self, actual, expected, feedback=""):
        res = actual != expected
        if not res and feedback == "":
            feedback = "Expected %s to not equal %s" % (str(actual),str(expected))
        self.appendResult(res, actual, expected, feedback)

    def assertTrue(self,x, feedback=""):
        res = bool(x) is True
        if not res and feedback == "":
            feedback = "Expected %s to be True" % (str(x))
        self.appendResult(res, x, True, feedback)

    def assertFalse(self,x, feedback=""):
        res = not bool(x)
        if not res and feedback == "":
            feedback = "Expected %s to be False" % (str(x))
        self.appendResult(res, x, False, feedback)

    def assertIs(self,a,b, feedback=""):
        res = a is b
        if not res and feedback == "":
            feedback = "Expected %s to be the same object as %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertIsNot(self,a,b, feedback=""):
        res = a is not b
        if not res and feedback == "":
            feedback = "Expected %s to not be the same object as %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertIsNone(self,x, feedback=""):
        res = x is None
        if not res and feedback == "":
            feedback = "Expected %s to be None" % (str(x))
        self.appendResult(res, x, None, feedback)

    def assertIsNotNone(self,x, feedback=""):
        res = x is not None
        if not res and feedback == "":
            feedback = "Expected %s to not be None" % (str(x))
        self.appendResult(res, x, None, feedback)

    def assertIn(self, a, b, feedback=""):
        res = a in b
        if not res and feedback == "":
            feedback = "Expected %s to be in %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertNotIn(self, a, b, feedback=""):
        res = a not in b
        if not res and feedback == "":
            feedback = "Expected %s to not be in %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertIsInstance(self,a,b, feedback=""):
        res = isinstance(a,b)
        if not res and feedback == "":
            feedback = "Expected %s to be an instance of %s" % (str(a), str(b))
        self.appendResult(res, a, b, feedback)

    def assertNotIsInstance(self,a,b, feedback=""):
        res = not isinstance(a,b)
        if not res and feedback == "":
            feedback = "Expected %s to not be an instance of %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertRegex(self, text, expected_regex, feedback=""):
        """Fail the test unless the text matches the regular expression."""
        if isinstance(expected_regex, (str, )): #bytes
            assert expected_regex, "expected_regex must not be empty."
            expected_regex = re.compile(expected_regex)
        if not expected_regex.search(text):
            res = False
            feedback = "Regex didn't match: %r not found in %r" % (
                repr(expected_regex), text)
        else:
            res = True
        self.appendResult(res, text, expected_regex, feedback)

    def assertNotRegex(self, text, unexpected_regex, feedback=""):
        """Fail the test if the text matches the regular expression."""
        if isinstance(unexpected_regex, (str, )): # bytes
            unexpected_regex = re.compile(unexpected_regex)
        match = unexpected_regex.search(text)
        if match:
            feedback = 'Regex matched: %r matches %r in %r' % (
                text[match.start() : match.end()],
                repr(unexpected_regex),
                text)
            # _formatMessage ensures the longMessage option is respected
        self.appendResult(not bool(match), text, unexpected_regex, feedback)

    def assertAlmostEqual(self, a, b, places=7, feedback="", delta=None):

        if delta is not None:
            res = abs(a-b) <= delta
        else:
            if places is None:
                places = 7
            res = round(a-b, places) == 0
        
        if not res and feedback == "":
            feedback = "Expected %s to equal %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertNotAlmostEqual(self, a, b, places=7, feedback="", delta=None):

        if delta is not None:
            res = not (a == b) and abs(a - b) > delta
        else:
            if places is None:
                places = 7

            res = round(a-b, places) != 0

        if not res and feedback == "":
            feedback = "Expected %s to not equal %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertGreater(self,a,b, feedback=""):
        res = a > b
        if not res and feedback == "":
            feedback = "Expected %s to be greater than %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertGreaterEqual(self,a,b, feedback=""):
        res = a >= b
        if not res and feedback == "":
            feedback = "Expected %s to be >= %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertLess(self, a, b, feedback=""):
        res = a < b
        if not res and feedback == "":
            feedback = "Expected %s to be less than %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def assertLessEqual(self,a,b, feedback=""):
        res = a <= b
        if not res and feedback == "":
            feedback = "Expected %s to be <= %s" % (str(a),str(b))
        self.appendResult(res, a, b, feedback)

    def appendResult(self,res,actual,expected,feedback):
        if res:
            msg = 'Pass'
            self.assertPassed += 1
        else:
            msg = 'Fail: ' +  feedback
            print(msg)
            self.assertFailed += 1

    def assertRaises(self, expected_exception, *args, **kwargs):
        context = _AssertRaisesContext(expected_exception, self)
        try:
            return context.handle(args, kwargs)
        finally:
            # bpo-23890: manually break a reference cycle
            context = None

    def fail(self, msg=None):
        if msg is None:
            msg = 'Fail'
        else:
            msg = 'Fail: ' + msg
        print(msg)
        self.assertFailed += 1

    def showSummary(self):
        pct = self.numPassed / (self.numPassed+self.numFailed) * 100
        print("Ran %d tests, passed: %d failed: %d\\n" % (self.numPassed+self.numFailed,
                                               self.numPassed, self.numFailed))



def main(verbosity=1):
    glob = globals() # globals() still needs work
    for name in glob:
        if type(glob[name]) == type and issubclass(glob[name], TestCase):
            try:
                tc = glob[name]()
                tc.verbosity = verbosity
                tc.main()
            except:
                print("Uncaught Error in: ", name)
`,"src/lib/unittest/gui.py":`import document
from unittest import TestCase

class TestCaseGui(TestCase):
     def __init__(self):
          TestCase.__init__(self)
          self.divid = document.currentDiv()
          self.mydiv = document.getElementById(self.divid)
          res = document.getElementById(self.divid+'_unit_results')
          if res:
              self.resdiv = res
              res.innerHTML = ''
          else:
              self.resdiv = document.createElement('div')
              self.resdiv.setAttribute('id',self.divid+'_unit_results')
              self.resdiv.setAttribute('class','unittest-results')
              self.mydiv.appendChild(self.resdiv)


     def main(self):
         t = document.createElement('table')
         self.resTable = t
         self.resdiv.appendChild(self.resTable)

         headers = ['Result','Actual Value','Expected Value','Notes']
         row = document.createElement('tr')
         for item in headers:
             head = document.createElement('th')
             head.setAttribute('class','ac-feedback')
             head.innerHTML = item
             head.setCSS('text-align','center')
             row.appendChild(head)
         self.resTable.appendChild(row)

         for func in self.tlist:
             try:
                 self.setUp()
                 func()
                 self.tearDown()
             except Exception as e:
                 self.appendResult('Error', None, None, e)
                 self.numFailed += 1
                 self.showSummary()

     def appendResult(self,res,actual,expected,param):
         trimActual = False
         if len(str(actual)) > 15:
             trimActual = True
             actualType = type(actual)
         trimExpected = False
         if len(str(expected)) > 15:
             trimExpected = True
             expectedType = type(expected)
         row = document.createElement('tr')
         err = False
         if res == 'Error':
             err = True
             msg = 'Error: %s' % param
             errorData = document.createElement('td')
             errorData.setAttribute('class','ac-feedback')
             errorData.innerHTML = 'ERROR'
             errorData.setCSS('background-color','#de8e96')
             errorData.setCSS('text-align','center')
             row.appendChild(errorData)
         elif res:
             passed = document.createElement('td')
             passed.setAttribute('class','ac-feedback')
             passed.innerHTML = 'Pass'
             passed.setCSS('background-color','#83d382')
             passed.setCSS('text-align','center')
             row.appendChild(passed)
             self.numPassed += 1
         else:
             fail = document.createElement('td')
             fail.setAttribute('class','ac-feedback')
             fail.innerHTML = 'Fail'
             fail.setCSS('background-color','#de8e96')
             fail.setCSS('text-align','center')
             row.appendChild(fail)
             self.numFailed += 1


         act = document.createElement('td')
         act.setAttribute('class','ac-feedback')
         if trimActual:
             actHTML = str(actual)[:5] + "..." + str(actual)[-5:]
             if actualType == str:
                 actHTML = repr(actHTML)
             act.innerHTML = actHTML
         else:
             act.innerHTML = repr(actual)
         act.setCSS('text-align','center')
         row.appendChild(act)

         expect = document.createElement('td')
         expect.setAttribute('class','ac-feedback')

         if trimExpected:
             expectedHTML = str(expected)[:5] + "..." + str(expected)[-5:]
             if expectedType == str:
                 expectedHTML = repr(expectedHTML)
             expect.innerHTML = expectedHTML
         else:
             expect.innerHTML = repr(expected)
         expect.setCSS('text-align','center')
         row.appendChild(expect)
         inp = document.createElement('td')
         inp.setAttribute('class','ac-feedback')

         if err:
             inp.innerHTML = msg
         else:
             inp.innerHTML = param
         inp.setCSS('text-align','center')
         row.appendChild(inp)
         self.resTable.appendChild(row)


     def showSummary(self):
         pct = self.numPassed / (self.numPassed+self.numFailed) * 100
         pTag = document.createElement('p')
         pTag.innerHTML = "You passed: " + str(pct) + "% of the tests"
         self.resdiv.appendChild(pTag)
`,"src/lib/urllib/__init__.js":"var $builtinmodule=function(){return{}};","src/lib/urllib/request/__init__.js":'var $builtinmodule=function(){var a={};return a.Response=Sk.misceval.buildClass(a,function(a,b){b.__init__=new Sk.builtin.func(function(a,b){a.data$=b.responseText,a.lineList=a.data$.split("\\n"),a.lineList=a.lineList.slice(0,-1);for(var c=0;c<a.lineList.length;c++)a.lineList[c]+="\\n";a.currentLine=0,a.pos$=0}),b.__str__=new Sk.builtin.func(function(){return Sk.ffi.remapToPy("<Response>")}),b.__iter__=new Sk.builtin.func(function(a){var b=a.lineList;return Sk.builtin.makeGenerator(function(){return this.$index>=this.$lines.length?void 0:new Sk.builtin.str(this.$lines[this.$index++])},{$obj:a,$index:0,$lines:b})}),b.read=new Sk.builtin.func(function(a,b){if(a.closed)throw new Sk.builtin.ValueError("I/O operation on closed file");var c=a.data$.length;void 0===b&&(b=c);var d=new Sk.builtin.str(a.data$.substr(a.pos$,b));return a.pos$+=b,a.pos$>=c&&(a.pos$=c),d}),b.readline=new Sk.builtin.func(function(a){var b="";return a.currentLine<a.lineList.length&&(b=a.lineList[a.currentLine],a.currentLine++),new Sk.builtin.str(b)}),b.readlines=new Sk.builtin.func(function(a){for(var b=[],c=a.currentLine;c<a.lineList.length;c++)b.push(new Sk.builtin.str(a.lineList[c]));return new Sk.builtin.list(b)})},"Response",[]),a.urlopen=new Sk.builtin.func(function(b,c){var d=new Promise(function(d){var e=new XMLHttpRequest;e.addEventListener("loadend",function(){d(Sk.misceval.callsimArray(a.Response,[e]))}),c?(e.open("POST",b.v),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.setRequestHeader("Content-length",c.v.length),e.send(c.v)):(e.open("GET",b.v),e.send(null))}),e=new Sk.misceval.Suspension;return e.resume=function(){return resolution},e.data={type:"Sk.promise",promise:d.then(function(a){return resolution=a,a},function(a){return resolution="",a})},e}),a};',"src/lib/urllib2.py":`raise NotImplementedError("urllib2 is not yet implemented in Skulpt")
`,"src/lib/urlparse.py":`raise NotImplementedError("urlparse is not yet implemented in Skulpt")
`,"src/lib/user.py":`raise NotImplementedError("user is not yet implemented in Skulpt")
`,"src/lib/uu.py":`raise NotImplementedError("uu is not yet implemented in Skulpt")
`,"src/lib/uuid.py":`raise NotImplementedError("uuid is not yet implemented in Skulpt")
`,"src/lib/warnings.py":`raise NotImplementedError("warnings is not yet implemented in Skulpt")
`,"src/lib/wave.py":`raise NotImplementedError("wave is not yet implemented in Skulpt")
`,"src/lib/weakref.py":`raise NotImplementedError("weakref is not yet implemented in Skulpt")
`,"src/lib/webbrowser.js":'var $builtinmodule=function(){function open_tab(a){return(Sk.builtin.pyCheckType("url","string",Sk.builtin.checkString(a)),!b)?Sk.builtin.bool.false$:(a=a.$jsstr(),window.open(a,"_blank"),Sk.builtin.bool.true$)}var a={},b="undefined"!=typeof window&&"undefined"!=typeof window.navigator;return a.__name__=new Sk.builtin.str("webbrowser"),a.open=new Sk.builtin.func(function open(a){return Sk.builtin.pyCheckArgsLen("open",arguments.length+1,1,3),open_tab(a)}),a.open_new=new Sk.builtin.func(function open_new(a){return Sk.builtin.pyCheckArgsLen("open_new",arguments.length,1,1),open_tab(a)}),a.open_new_tab=new Sk.builtin.func(function open_new_tab(a){return Sk.builtin.pyCheckArgsLen("open_new_tab",arguments.length,1,1),open_tab(a)}),a.DefaultBrowser=Sk.misceval.buildClass(a,function dflbrowser(a,b){b.__init__=new Sk.builtin.func(function __init__(){return Sk.builtin.none.none$}),b.open=new Sk.builtin.func(function open(a,b){return Sk.builtin.pyCheckArgsLen("open",arguments.length,2,4),open_tab(b)}),b.open_new=new Sk.builtin.func(function open_new(a,b){return Sk.builtin.pyCheckArgsLen("open_new",arguments.length,2,2),open_tab(b)}),b.open_new_tab=new Sk.builtin.func(function open_new_tab(a,b){return Sk.builtin.pyCheckArgsLen("open_new_tab",arguments.length,2,2),open_tab(b)})},"DefaultBrowser",[]),a.get=new Sk.builtin.func(function get(){return Sk.builtin.pyCheckArgsLen("get",arguments.length,0,1),Sk.misceval.callsimArray(a.DefaultBrowser,[])}),a};',"src/lib/webbrowser.py":`raise NotImplementedError("webbrowser is not yet implemented in Skulpt")
`,"src/lib/webgl/__init__.js":`var $builtinmodule=function(){var a={__name__:new Sk.builtin.str("webgl")},c=function(a){return"<table style=\\"background-color: #8CE; width: 100%; height: 100%;\\"><tr><td align=\\"center\\"><div style=\\"display: table-cell; vertical-align: middle;\\"><div style=\\"\\">"+a+"</div></div></td></tr></table>"},d="This page requires a browser that supports WebGL.<br/><a href=\\"http://get.webgl.org\\">Click here to upgrade your browser.</a>",e=function(a){for(var b=["webgl","experimental-webgl","webkit-3d","moz-webgl"],c=null,d=0;d<b.length;++d){try{c=a.getContext(b[d])}catch(a){}if(c)break}if(c){function returnFalse(){return!1}a.onselectstart=returnFalse,a.onmousedown=returnFalse}return c},f=function(a,f){var g=document.getElementById(a);if(f||(f=g.getElementsByTagName("canvas")[0]),!f)return void(g.innerHTML=c(d));var h=e(f);if(!h){var i=navigator.userAgent.match(/(\\w+\\/.*? )/g),j={};try{for(var k=0;k<i.length;++k){for(var l=i[k].match(/(\\w+)/g),m=[],n=1;n<l.length;++n)m.push(parseInt(l[n]));j[l[0]]=m}}catch(a){}g.innerHTML=j.Chrome&&(7<j.Chrome[0]||7==j.Chrome[0]&&0<j.Chrome[1]||7==j.Chrome[0]&&0==j.Chrome[1]&&521<=j.Chrome[2])?c("It doesn't appear your computer can support WebGL.<br/><a href=\\"http://get.webgl.org\\">Click here for more information.</a>"):c(d)}return h};return a.Context=Sk.misceval.buildClass(a,function(a,b){b.__init__=new Sk.builtin.func(function(a,b){var c=document.getElementById(b.v),d=f(b.v,c);if(!d)throw new Error("Your browser does not appear to support WebGL.");for(var e in a.gl=d,d.__proto__)if("number"==typeof d.__proto__[e])Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str(e),d.__proto__[e]);else if("function"==typeof d.__proto__[e])switch(e){case"bufferData":break;case"clearColor":break;case"drawArrays":break;case"getAttribLocation":break;case"getUniformLocation":break;case"shaderSource":break;case"uniformMatrix4fv":break;case"vertexAttribPointer":break;case"viewport":break;default:(function(b){Sk.abstr.objectSetItem(a.$d,new Sk.builtin.str(e),new Sk.builtin.func(function(){var a=d.__proto__[b];return a.apply(d,arguments)}))})(e);}d.clearColor(100/255,149/255,237/255,1),d.clear(d.COLOR_BUFFER_BIT)}),b.tp$getattr=Sk.generic.getAttr,b.bufferData=new Sk.builtin.func(function(a,b,c,d){a.gl.bufferData(b,c.v,d)}),b.clearColor=new Sk.builtin.func(function(a,b,c,d,e){a.gl.clearColor(Sk.builtin.asnum$(b),Sk.builtin.asnum$(c),Sk.builtin.asnum$(d),Sk.builtin.asnum$(e))}),b.getAttribLocation=new Sk.builtin.func(function(a,b,c){return a.gl.getAttribLocation(b,c.v)}),b.getUniformLocation=new Sk.builtin.func(function(a,b,c){return a.gl.getUniformLocation(b,c.v)}),b.shaderSource=new Sk.builtin.func(function(a,b,c){a.gl.shaderSource(b,c.v)}),b.drawArrays=new Sk.builtin.func(function(a,b,c,d){a.gl.drawArrays(Sk.builtin.asnum$(b),Sk.builtin.asnum$(c),Sk.builtin.asnum$(d))}),b.vertexAttribPointer=new Sk.builtin.func(function(a,b,c,d,e,f,g){a.gl.vertexAttribPointer(b,Sk.builtin.asnum$(c),Sk.builtin.asnum$(d),e,Sk.builtin.asnum$(f),Sk.builtin.asnum$(g))}),b.viewport=new Sk.builtin.func(function(a,b,c,d,e){a.gl.viewport(Sk.builtin.asnum$(b),Sk.builtin.asnum$(c),Sk.builtin.asnum$(d),Sk.builtin.asnum$(e))}),b.uniformMatrix4fv=new Sk.builtin.func(function(a,b,c,d){a.gl.uniformMatrix4fv(Sk.builtin.asnum$(b),c,d.v)}),b.setDrawFunc=new Sk.builtin.func(function(a,b){var c=new Date().getTime(),d=setInterval(function(){Sk.misceval.callsimArray(b,[a,new Date().getTime()-c])},1e3/60)})},"Context",[]),a.Float32Array=Sk.misceval.buildClass(a,function(a,b){b.__init__=new Sk.builtin.func(function(a,b){a.v="number"==typeof b?new Float32Array(b):new Float32Array(Sk.ffi.remapToJs(b))}),b.__repr__=new Sk.builtin.func(function(a){for(var b=[],c=0;c<a.v.length;++c)b.push(a.v[c]);return new Sk.builtin.str("["+b.join(", ")+"]")})},"Float32Array",[]),a.Matrix4x4=Sk.misceval.buildClass(a,function(a,b){b.__init__=new Sk.builtin.func(function(a,b){a.v=new Float32Array(Sk.ffi.remapToJs(b))}),b.identity=new Sk.builtin.func(function(a){var b=a.v;b[0]=1,b[1]=0,b[2]=0,b[3]=0,b[4]=0,b[5]=1,b[6]=0,b[7]=0,b[8]=0,b[9]=0,b[10]=1,b[11]=0,b[12]=0,b[13]=0,b[14]=0,b[15]=1}),b.perspective=new Sk.builtin.func(function(b,c,d,e,g){var h=Math.tan,i=Math.PI,j=h(.5*i-.5*(Sk.builtin.asnum$(c)*i/180)),l=Sk.builtin.asnum$(d),a=Sk.builtin.asnum$(e),n=Sk.builtin.asnum$(g),f=1/(a-n),k=b.v;k[0]=j/l,k[1]=0,k[2]=0,k[3]=0,k[4]=0,k[5]=j,k[6]=0,k[7]=0,k[8]=0,k[9]=0,k[10]=(a+n)*f,k[11]=-1,k[12]=0,k[13]=0,k[14]=2*(a*n*f),k[15]=0}),b.translate=new Sk.builtin.func(function(a,b){var c=a.v,d=Sk.ffi.remapToJs(b);c[0]=1,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=1,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[10]=1,c[11]=0,c[12]=d[0],c[13]=d[1],c[14]=d[2],c[15]=1}),b.__repr__=new Sk.builtin.func(function(a){for(var b=[],c=0;c<a.v.length;++c)b.push(a.v[c]);return new Sk.builtin.str("["+b.join(", ")+"]")})},"Matrix4x4",[]),a};`,"src/lib/webgl/math.js":'var $builtinmodule=function(){var a={};return a.Mat44=Sk.misceval.buildClass(a,function(b,c){var d=Math.sqrt;c.__init__=new Sk.builtin.func(function(a){Sk.misceval.callsimArray(c.loadIdentity,[a]),a.stack=[]}),c.push=new Sk.builtin.func(function(a){a.stack.push(a.elements.slice(0))}),c.pop=new Sk.builtin.func(function(a){a.elements=a.stack.pop()}),c.loadIdentity=new Sk.builtin.func(function(a){a.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}),c.transform3=new Sk.builtin.func(function(b,c){var d=b.elements;return Sk.misceval.callsimArray(a.Vec3,[d[0]*c.x+d[4]*c.y+d[8]*c.z,d[1]*c.x+d[5]*c.y+d[9]*c.z,d[2]*c.x+d[6]*c.y+d[10]*c.z])}),c.scale=new Sk.builtin.func(function(a,b,c,d){return a.elements[0]*=b,a.elements[1]*=b,a.elements[2]*=b,a.elements[3]*=b,a.elements[4]*=c,a.elements[5]*=c,a.elements[6]*=c,a.elements[7]*=c,a.elements[8]*=d,a.elements[9]*=d,a.elements[10]*=d,a.elements[11]*=d,a}),c.translate=new Sk.builtin.func(function(a,b,c,d){return a.elements[12]+=a.elements[0]*b+a.elements[4]*c+a.elements[8]*d,a.elements[13]+=a.elements[1]*b+a.elements[5]*c+a.elements[9]*d,a.elements[14]+=a.elements[2]*b+a.elements[6]*c+a.elements[10]*d,a.elements[15]+=a.elements[3]*b+a.elements[7]*c+a.elements[11]*d,a}),c.rotate=new Sk.builtin.func(function(b,c,e,f,g){var h=Math.cos,i=Math.sin,j=Math.PI,k=d(e*e+f*f+g*g),l=i(c*j/180),m=h(c*j/180);if(0<k){var n,o,p,q,r,s,t,u,v,w,A;e/=k,f/=k,g/=k,n=e*e,o=f*f,p=g*g,q=e*f,r=f*g,s=g*e,t=e*l,u=f*l,v=g*l,w=1-m,A=Sk.misceval.callsimArray(a.Mat44),A.elements[0]=w*n+m,A.elements[1]=w*q-v,A.elements[2]=w*s+u,A.elements[3]=0,A.elements[4]=w*q+v,A.elements[5]=w*o+m,A.elements[6]=w*r-t,A.elements[7]=0,A.elements[8]=w*s-u,A.elements[9]=w*r+t,A.elements[10]=w*p+m,A.elements[11]=0,A.elements[12]=0,A.elements[13]=0,A.elements[14]=0,A.elements[15]=1,A=A.multiply(b),b.elements=A.elements}return b}),c.multiply=new Sk.builtin.func(function(b,c){for(var d=Sk.misceval.callsimArray(a.Mat44),e=0;4>e;e++)d.elements[4*e+0]=b.elements[4*e+0]*c.elements[0]+b.elements[4*e+1]*c.elements[4]+b.elements[4*e+2]*c.elements[8]+b.elements[4*e+3]*c.elements[12],d.elements[4*e+1]=b.elements[4*e+0]*c.elements[1]+b.elements[4*e+1]*c.elements[5]+b.elements[4*e+2]*c.elements[9]+b.elements[4*e+3]*c.elements[13],d.elements[4*e+2]=b.elements[4*e+0]*c.elements[2]+b.elements[4*e+1]*c.elements[6]+b.elements[4*e+2]*c.elements[10]+b.elements[4*e+3]*c.elements[14],d.elements[4*e+3]=b.elements[4*e+0]*c.elements[3]+b.elements[4*e+1]*c.elements[7]+b.elements[4*e+2]*c.elements[11]+b.elements[4*e+3]*c.elements[15];return b.elements=d.elements,b}),c.lookAt=new Sk.builtin.func(function(b,c,e,f,g,h,i,j,k,l){var m=[c-g,e-h,f-i],n=d(m[0]*m[0]+m[1]*m[1]+m[2]*m[2]);n&&(m[0]/=n,m[1]/=n,m[2]/=n);var o=[j,k,l],p=[];p[0]=o[1]*m[2]-o[2]*m[1],p[1]=-o[0]*m[2]+o[2]*m[0],p[2]=o[0]*m[1]-o[1]*m[0],o[0]=m[1]*p[2]-m[2]*p[1],o[1]=-m[0]*p[2]+m[2]*p[0],o[2]=m[0]*p[1]-m[1]*p[0],n=d(p[0]*p[0]+p[1]*p[1]+p[2]*p[2]),n&&(p[0]/=n,p[1]/=n,p[2]/=n),n=d(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]),n&&(o[0]/=n,o[1]/=n,o[2]/=n);var q=Sk.misceval.callsimArray(a.Mat44);return q.elements[0]=p[0],q.elements[4]=p[1],q.elements[8]=p[2],q.elements[12]=0,q.elements[1]=o[0],q.elements[5]=o[1],q.elements[9]=o[2],q.elements[13]=0,q.elements[2]=m[0],q.elements[6]=m[1],q.elements[10]=m[2],q.elements[14]=0,q.elements[3]=0,q.elements[7]=0,q.elements[11]=0,q.elements[15]=1,q=q.multiply(b),b.elements=q.elements,b.translate(-c,-e,-f),b})},"Mat44",[]),a.Mat33=Sk.misceval.buildClass(a,function(a,b){b.__init__=new Sk.builtin.func(function(a){Sk.misceval.callsimArray(b.loadIdentity,[a])}),b.loadIdentity=new Sk.builtin.func(function(a){a.elements=[1,0,0,0,1,0,0,0,1]})},"Mat33",[]),a.Vec3=Sk.misceval.buildClass(a,function(b,c){c.__init__=new Sk.builtin.func(function(a,b,c,d){a.x=b,a.y=c,a.z=d}),c.__sub__=new Sk.builtin.func(function(b,c){return Sk.misceval.callsimArray(a.Vec3,[b.x-c.x,b.y-c.y,b.z-c.z])})},"Vec3",[]),a.cross=new Sk.builtin.func(function(b,c){return Sk.asserts.assert(b instanceof a.Vec3&&c instanceof a.Vec3),Sk.misceval.callsimArray(a.Vec3,[b.y*c.z-b.z*c.y,b.z*c.x-b.x*c.z,b.x*c.y-b.y*c.x])}),a};',"src/lib/webgl/matrix4.js":"var $builtinmodule=function(){var a=Math.PI,b={},c=new Float32Array(3),d=new Float32Array(3),e=new Float32Array(3),f=new Float32Array(4),g=new Float32Array(4),h=new Float32Array(4),i=new Float32Array(16),j=new Float32Array(16),k=new Float32Array(16),l=function(b,c){for(var a=Math.sqrt,d=0,e=c.length,f=0;f<e;++f)d+=c[f]*c[f];if(d=a(d),1e-5<d)for(var f=0;f<e;++f)b[f]=c[f]/d;else for(var f=0;f<e;++f)b[f]=0;return b},m=function(c,d,a){return c[0]=d[1]*a[2]-d[2]*a[1],c[1]=d[2]*a[0]-d[0]*a[2],c[2]=d[0]*a[1]-d[1]*a[0],c},n=function(c,d,a){for(var b=d.length,e=0;e<b;++e)c[e]=d[e]-a[e];return c},o=function(c,a){return c[0]*a[0]+c[1]*a[1]+c[2]*a[2]};return b.lookAt=new Sk.builtin.func(function(a,b,f,g){var h=c,i=d,j=l(h,n(h,b.v,f.v)),k=l(i,m(i,g.v,j)),p=m(e,j,k),q=a.v;return q[0]=k[0],q[1]=p[0],q[2]=j[0],q[3]=0,q[4]=k[1],q[5]=p[1],q[6]=j[1],q[7]=0,q[8]=k[2],q[9]=p[2],q[10]=j[2],q[11]=0,q[12]=-o(k,b.v),q[13]=-o(p,b.v),q[14]=-o(j,b.v),q[15]=1,a}),b.perspective=new Sk.builtin.func(function(b,c,d,e,g){var h=Math.tan,i=h(.5*a-.5*(c*a/180)),f=1/(e-g),j=b.v;return j[0]=i/d,j[1]=0,j[2]=0,j[3]=0,j[4]=0,j[5]=i,j[6]=0,j[7]=0,j[8]=0,j[9]=0,j[10]=(e+g)*f,j[11]=-1,j[12]=0,j[13]=0,j[14]=2*(e*g*f),j[15]=0,b}),b.rotationY=new Sk.builtin.func(function(b,d){var e=Math.sin,f=Math.cos,g=b.v,h=f(d*a/180),c=e(d*a/180);return g[0]=h,g[1]=0,g[2]=-c,g[3]=0,g[4]=0,g[5]=1,g[6]=0,g[7]=0,g[8]=c,g[9]=0,g[10]=h,g[11]=0,g[12]=0,g[13]=0,g[14]=0,g[15]=1,b}),b.identity=new Sk.builtin.func(function(a){var b=a.v;return b[0]=1,b[1]=0,b[2]=0,b[3]=0,b[4]=0,b[5]=1,b[6]=0,b[7]=0,b[8]=0,b[9]=0,b[10]=1,b[11]=0,b[12]=0,b[13]=0,b[14]=0,b[15]=1,a}),b.mul=new Sk.builtin.func(function(c,d,e){var f=c.v,g=d.v,a=e.v,b=g[0],h=g[1],i=g[2],j=g[3],k=g[4],l=g[5],m=g[6],n=g[7],o=g[8],p=g[9],q=g[10],r=g[11],s=g[12],t=g[13],u=g[14],v=g[15],w=a[0],x=a[1],y=a[2],z=a[3],A=a[4],B=a[5],C=a[6],D=a[7],E=a[8],F=a[9],G=a[10],H=a[11],I=a[12],J=a[13],K=a[14],L=a[15];return f[0]=b*w+h*A+i*E+j*I,f[1]=b*x+h*B+i*F+j*J,f[2]=b*y+h*C+i*G+j*K,f[3]=b*z+h*D+i*H+j*L,f[4]=k*w+l*A+m*E+n*I,f[5]=k*x+l*B+m*F+n*J,f[6]=k*y+l*C+m*G+n*K,f[7]=k*z+l*D+m*H+n*L,f[8]=o*w+p*A+q*E+r*I,f[9]=o*x+p*B+q*F+r*J,f[10]=o*y+p*C+q*G+r*K,f[11]=o*z+p*D+q*H+r*L,f[12]=s*w+t*A+u*E+v*I,f[13]=s*x+t*B+u*F+v*J,f[14]=s*y+t*C+u*G+v*K,f[15]=s*z+t*D+u*H+v*L,c}),b.invert=new Sk.builtin.func(function(a,b){var c=a.v,e=b.v,f=e[0],g=e[1],h=e[2],i=e[3],j=e[4],k=e[5],l=e[6],m=e[7],n=e[8],o=e[9],p=e[10],q=e[11],r=e[12],s=e[13],t=e[14],u=e[15],v=p*u,w=t*q,x=l*u,y=t*m,z=l*q,A=p*m,B=h*u,C=t*i,D=h*q,E=p*i,F=h*m,G=l*i,H=n*s,I=r*o,J=j*s,K=r*k,L=j*o,M=n*k,N=f*s,O=r*g,P=f*o,Q=n*g,R=f*k,S=j*g,T=v*k+y*o+z*s-(w*k+x*o+A*s),U=w*g+B*o+E*s-(v*g+C*o+D*s),V=x*g+C*k+F*s-(y*g+B*k+G*s),W=A*g+D*k+G*o-(z*g+E*k+F*o),X=1/(f*T+j*U+n*V+r*W);return c[0]=X*T,c[1]=X*U,c[2]=X*V,c[3]=X*W,c[4]=X*(w*j+x*n+A*r-(v*j+y*n+z*r)),c[5]=X*(v*f+C*n+D*r-(w*f+B*n+E*r)),c[6]=X*(y*f+B*j+G*r-(x*f+C*j+F*r)),c[7]=X*(z*f+E*j+F*n-(A*f+D*j+G*n)),c[8]=X*(H*m+K*q+L*u-(I*m+J*q+M*u)),c[9]=X*(I*i+N*q+Q*u-(H*i+O*q+P*u)),c[10]=X*(J*i+O*m+R*u-(K*i+N*m+S*u)),c[11]=X*(M*i+P*m+S*q-(L*i+Q*m+R*q)),c[12]=X*(J*p+M*t+I*l-(L*t+H*l+K*p)),c[13]=X*(P*t+H*h+O*p-(N*p+Q*t+I*h)),c[14]=X*(N*l+S*t+K*h-(R*t+J*h+O*l)),c[15]=X*(R*p+L*h+Q*l-(P*l+S*p+M*h)),a}),b.transpose=new Sk.builtin.func(function(a,b){for(var c=a.v,d=b.v,e=0;4>e;++e)for(var f=0;4>f;++f)c[4*e+f]=d[4*f+e];return c}),b};","src/lib/webgl/models.js":'var $builtinmodule=function(a){var c={},d=function(a,c){var d=c||gl.ARRAY_BUFFER,e=gl.createBuffer();if(this.target=d,this.buf=e,this.set(a),this.numComponents_=a.numComponents,this.numElements_=a.numElements,this.totalComponents_=this.numComponents_*this.numElements_,a.buffer instanceof Float32Array)this.type_=gl.FLOAT;else if(a.buffer instanceof Uint8Array)this.type_=gl.UNSIGNED_BYTE;else if(a.buffer instanceof Int8Array)this.type_=gl._BYTE;else if(a.buffer instanceof Uint16Array)this.type_=gl.UNSIGNED_SHORT;else if(a.buffer instanceof Int16Array)this.type_=gl.SHORT;else throw"unhandled type:"+typeof a.buffer};return d.prototype.set=function(a){gl.bindBuffer(this.target,this.buf),gl.bufferData(this.target,a.buffer,gl.STATIC_DRAW)},d.prototype.type=function(){return this.type_},d.prototype.numComponents=function(){return this.numComponents_},d.prototype.numElements=function(){return this.numElements_},d.prototype.totalComponents=function(){return this.totalComponents_},d.prototype.buffer=function(){return this.buf},d.prototype.stride=function(){return 0},d.prototype.offset=function(){return 0},c.Model=Sk.misceval.buildClass(c,function(c,e){e.__init__=new Sk.builtin.func(function(c,e,f,g){c.buffers={};var h=function(a,e){var f="indices"==a?gl.ELEMENT_ARRAY_BUFFER:gl.ARRAY_BUFFER;b=c.buffers[a],b?b.set(e):b=new d(e,f),c.buffers[a]=b};for(a in f)h(a,f[a]);var i={},j=0;for(var k in g)i[k]=j++;c.mode=gl.TRIANGLES,c.textures=g.v,c.textureUnits=i,c.shader=e}),e.drawPrep=new Sk.builtin.func(function(a,c){var d=a.shader,e=a.buffers,f=a.textures;for(var g in c=Sk.ffi.remapToJs(c),Sk.misceval.callsimArray(d.use,[d]),e){var h=e[g];if("indices"==g)gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,h.buffer());else{var i=d.attrib[g];i&&i(h)}}for(var j in f){var k=a.textureUnits[j];d.setUniform$impl(d,textuer,k),f[j].bindToUnit(k)}for(var l in c)d.setUniform$impl(d,l,c[l])}),e.draw=new Sk.builtin.func(function(a,c,d){var e=a.shader;for(uniform in c=Sk.ffi.remapToJs(c),c)e.setUniform$impl(e,uniform,c[uniform]);if(d)for(var f in d){var g=a.textureUnits[f];e.setUniform$impl(e,f,g),d[f].bindToUnit(g)}var h=a.buffers;gl.drawElements(a.mode,h.indices.totalComponents(),gl.UNSIGNED_SHORT,0)})},"Model",[]),c};',"src/lib/webgl/primitives.js":'var $builtinmodule=function(){var a={},b=function(a,b,c){c=c||"Float32Array";var d=window[c];b.length?(this.buffer=new d(b),b=this.buffer.length/a,this.cursor=b):(this.buffer=new d(a*b),this.cursor=0),this.numComponents=a,this.numElements=b,this.type=c};return b.prototype.stride=function(){return 0},b.prototype.offset=function(){return 0},b.prototype.getElement=function(a){for(var b=a*this.numComponents,c=[],d=0;d<this.numComponents;++d)c.push(this.buffer[b+d]);return c},b.prototype.setElement=function(a,b){for(var c=a*this.numComponents,d=0;d<this.numComponents;++d)this.buffer[c+d]=b[d]},b.prototype.clone=function(){var a=new b(this.numComponents,this.numElements,this.type);return a.pushArray(this),a},b.prototype.push=function(a){this.setElement(this.cursor++,a)},b.prototype.pushArray=function(a){for(var b=0;b<a.numElements;++b)this.push(a.getElement(b))},b.prototype.pushArrayWithOffset=function(a,b){for(var c,d=0;d<a.numElements;++d){c=a.getElement(d);for(var e=0;e<b.length;++e)c[e]+=b[e];this.push(c)}},b.prototype.computeExtents=function(){for(var a=Math.max,b=Math.min,c,d=this.numElements,e=this.numComponents,f=this.getElement(0),g=this.getElement(0),h=1;h<d;++h){c=this.getElement(h);for(var i=0;i<e;++i)f[i]=b(f[i],c[i]),g[i]=a(g[i],c[i])}return{min:f,max:g}},a.createCube=new Sk.builtin.func(function(a){for(var c,d=[[3,7,5,1],[0,4,6,2],[6,7,3,2],[0,1,5,4],[5,7,6,4],[2,3,1,0]],e=a/2,g=[[-e,-e,-e],[+e,-e,-e],[-e,+e,-e],[+e,+e,-e],[-e,-e,+e],[+e,-e,+e],[-e,+e,+e],[+e,+e,+e]],h=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],i=[[0,0],[1,0],[1,1],[0,1]],j=24,k=new b(3,j),l=new b(3,j),m=new b(2,j),n=new b(3,12,"Uint16Array"),o=0;6>o;++o){c=d[o];for(var p=0;4>p;++p){var q=g[c[p]],r=h[o],s=i[p];k.push(q),l.push(r),m.push(s)}var t=4*o;n.push([t+0,t+1,t+2]),n.push([t+0,t+2,t+3])}return{position:k,normal:l,texCoord:m,indices:n}}),a};',"src/lib/whichdb.py":`raise NotImplementedError("whichdb is not yet implemented in Skulpt")
`,"src/lib/wsgiref/__init__.py":`raise NotImplementedError("wsgiref is not yet implemented in Skulpt")
`,"src/lib/xdrlib.py":`raise NotImplementedError("xdrlib is not yet implemented in Skulpt")
`,"src/lib/xml/__init__.py":`raise NotImplementedError("xml is not yet implemented in Skulpt")
`,"src/lib/xml/dom/__init__.py":`raise NotImplementedError("dom is not yet implemented in Skulpt")
`,"src/lib/xml/etree/__init__.py":`raise NotImplementedError("etree is not yet implemented in Skulpt")
`,"src/lib/xml/parsers/__init__.py":`raise NotImplementedError("parsers is not yet implemented in Skulpt")
`,"src/lib/xml/sax/__init__.py":`raise NotImplementedError("sax is not yet implemented in Skulpt")
`,"src/lib/xmllib.py":`raise NotImplementedError("xmllib is not yet implemented in Skulpt")
`,"src/lib/xmlrpclib.py":`raise NotImplementedError("xmlrpclib is not yet implemented in Skulpt")
`,"src/lib/zipfile.py":`raise NotImplementedError("zipfile is not yet implemented in Skulpt")
`}};var Ot=`
class TextIOBase:
    pass

class StringIO(TextIOBase):
    def __init__(self, initial_value=""):
        if initial_value is None:
            initial_value = ""
        if not isinstance(initial_value, str):
            raise TypeError("initial_value must be str")

        self._parts = []
        if initial_value:
            self._parts.append(initial_value)

        self._closed = False

    def write(self, data):
        if self._closed:
            raise ValueError("I/O operation on closed file")

        if not isinstance(data, str):
            raise TypeError("write() argument must be str")

        self._parts.append(data)
        return len(data)

    def getvalue(self):
        return "".join(self._parts)

    def flush(self):
        pass

    def close(self):
        self._closed = True

    def writable(self):
        return True

    def readable(self):
        return False

    def seekable(self):
        return False

    @property
    def closed(self):
        return self._closed

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()
`;var Jt=`
import math
import random
import io
from time import time

_degrees_to_radians_ = math.pi / 180
_radians_to_degrees_ = 180 / math.pi
pi = math.pi
e = math.e
log = math.log
exp = math.exp
sqrt = math.sqrt
def sin(x): return math.sin(x * _degrees_to_radians_)
def cos(x): return math.cos(x * _degrees_to_radians_)
def tan(x): return math.tan(x * _degrees_to_radians_)
def asin(x): return math.asin(x) * _radians_to_degrees_
def acos(x): return math.acos(x) * _radians_to_degrees_
def atan(x): return math.atan(x) * _radians_to_degrees_

randint = random.randint

class Graph:
    def __init__(self):
        self.info = rpc("getGraphInfo")

    @property
    def minX(self): return self.info["minX"]

    @property
    def maxX(self): return self.info["maxX"]

    @property
    def minY(self): return self.info["minY"]

    @property
    def maxY(self): return self.info["maxY"]

class Pt:
    @classmethod
    def of(self, x, y = None):
        if isinstance(x, Pt): return x
        if y is not None: return Pt(x, y)
        return Pt(x[0], x[1])

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, pt):
        return Pt(self.x + pt.x, self.y + pt.y)

    def __sub__(self, pt):
        return Pt(self.x - pt.x, self.y - pt.y)

    def __mul__(self, s):
        return Pt(self.x * s, self.y * s)

    def __repr__(self):
        return f"({self.x}, {self.y})"

Pt.zero = Pt(0, 0)

class Pen:
    def __init__(self, style = "#fff"):
        self.obj_id = rpc("newPen", style)

    def plot(self, x, y):
        rpc("callm", self.obj_id, "plot", x, y)

    def line(self, pt1, pt2):
        pt1 = Pt.of(pt1)
        pt2 = Pt.of(pt2)
        rpc("callm", self.obj_id, "line", pt1.x, pt1.y, pt2.x, pt2.y)

    def rectangle(self, pt1, pt2):
        pt1 = Pt.of(pt1)
        pt2 = Pt.of(pt2)
        rpc("callm", self.obj_id, "rectangle", pt1.x, pt1.y, pt2.x, pt2.y)

    def path(self, path, centre = Pt.zero, closed = False):
        num_points = len(path)
        if num_points < 2: return False
        centre = Pt.of(centre)
        pt1 = Pt.of(path[0]) + centre
        for i in range(1, num_points):
            pt2 = Pt.of(path[i]) + centre
            self.line(pt1, pt2)
            pt1 = pt2
        if closed:
            pt2 = Pt.of(path[0]) + centre
            self.line(pt1, pt2)
        return True

class Turtle:
    def __init__(self, style = "#fff"):
        self.obj_id = rpc("newTurtle", style)

    def speed(self, speed):
        rpc("callm", self.obj_id, "setSpeed", float(speed))

    def go(self, distance):
        rpc("callm", self.obj_id, "go", distance)
        return self

    def turn(self, angle):
        rpc("callm", self.obj_id, "turn", angle * _degrees_to_radians_)
        return self

    def forward(self, distance):
        return self.go(distance)

    def left(self, angle):
        return self.turn(angle)

    def right(self, angle):
        return self.turn(-angle)

def print(*args, file = None, internal_print = print, **kwargs):
    if file is None:
        s = io.StringIO()
        internal_print(*args, file=s, **kwargs)
        return rpc("output", s.getvalue())
    else:
        return internal_print(*args, file=file, **kwargs)

def input(prompt):
    print(prompt)
    return rpc("input")

def clear(scale_x = 1, scale_y = None):
    if scale_y is None: scale_y = scale_x
    rpc("clearScreen", scale_x, scale_y)

def rgb(red, green, blue):
    red = max(0, min(255, round(red)))
    green = max(0, min(255, round(green)))
    blue = max(0, min(255, round(blue)))
    return f"#{red:02X}{green:02X}{blue:02X}"
`,Yt=`
graph = Graph()
`;var Wt=!1;function mn(Y,y){Sk.builtinFiles||(Sk.builtinFiles={}),Sk.builtinFiles.files||(Sk.builtinFiles.files={}),Sk.builtinFiles.files[`src/lib/${Y}`]=y,Sk.builtinFiles.files[Y]=y}function bn(Y){let y=Sk.builtinFiles?.files;if(!y)throw new Error("No built in files!");let t=y[Y]??null;if(t===null)throw new Error;return t}async function Mt(Y,y=!1){if(await Sk.misceval.asyncToPromise(function(){return Sk.importMainWithBody("<stdin>",!1,Y,!0)}),y)for(let[t,n]of Object.entries(Sk.globals))t.startsWith("_")||(Sk.builtins[t]=n)}async function Xt(Y,y,t,n){Sk.configure({__future__:Sk.python3,async:!0,read:bn,output(a){let i=n("output",Sk.ffi.remapToJs(a));return Sk.misceval.promiseToSuspension(i)},err(a){let i=n("output",Sk.ffi.remapToJs(a));return Sk.misceval.promiseToSuspension(i)}}),Sk.builtins.rpc=new Sk.builtin.func(function(a,...i){a=Sk.ffi.remapToJs(a),i=i.map(o=>Sk.ffi.remapToJs(o));let r=n(a,...i).then(o=>Sk.ffi.remapToPy(o));return Sk.misceval.promiseToSuspension(r)});try{Wt||(mn("io.py",Ot),await Mt(Jt,!0),Wt=!0),await Mt(Yt,!0),await Mt(y,!!t.isPrelude)}catch(a){let i=a.traceback[0],o=i.filename?.startsWith("<stdin>")?Y:i.filename,p=new Me(o,i.lineno);throw new ve(a.toString(),p)}}console.info("Loaded lang worker...");var Ct=new Map,Kt=0;function Qt(Y,...y){Kt+=1;let t=Kt;return new Promise((n,a)=>{Ct.set(t,{resolve:n,reject:a}),self.postMessage({type:"rpc.request",id:t,method:Y,args:y})})}function kn(Y){let y=Y.data.id,t=Ct.get(y);t?(Ct.delete(y),Y.data.error?t.reject(Y.data.error):t.resolve(Y.data.result)):console.info(`Ignored RPC response ${y} (from terminated user code?)`)}async function Sn(Y,y,t){let n=Ft(Y);try{n==="cie"?await Ht(Y,y,t,Qt):n==="python"&&await Xt(Y,y,t,Qt),self.postMessage({type:"complete"})}catch(a){if(a instanceof ve)self.postMessage({type:"error",message:a.message,lineno:a.ref.lineno,filename:a.ref.filename});else throw a}}self.onmessage=function(Y){let y=Y.data.type;y==="rpc.response"?kn(Y):y==="usercode.run"?Sn(Y.data.filepath,Y.data.code,Y.data.workerConfig):y==="usercode.kill"?(Ct.clear(),self.postMessage({type:"complete"})):console.log(`Unknown client message: ${JSON.stringify(e)}`)};export{Sn as runUserCode};
