(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

  var templates = {
    "xquery" : [
      {"name":"xquery","description":"Insert the XQuery version declaration","template":"xquery version \"${ver_string}\" encoding \"${enc_string}\";\n"},
      {"name":"version","description":"Insert the XQuery version declaration","template":"xquery version \"${string_literal}\" encoding \"${string_literal}\";\n"},
      {"name":"module","description":"Insert the module declaration","template":"module namespace ${namespace_name} = \"${URI_literal}\";\n"},
      {"name":"namespace","description":"Insert the module declaration","template":"module namespace ${namespace_name} = \"${URI_literal}\";\n"},
      {"name":"import","description":"Insert a module import","template":"import module namespace ${namespace_name} = \"${URI_literal}\";\n"},
      {"name":"module","description":"Insert a module import","template":"import module namespace ${namespace_name} = \"${URI_literal}\";\n"},
      {"name":"import","description":"Insert a module import with location hints","template":"import module namespace ${namespace_name} = ${URI_and_location_hints};\n"},
      {"name":"module","description":"Insert a module import with location hints","template":"import module namespace ${namespace_name} = ${URI_and_location_hints};\n"},
      {"name":"import","description":"Insert a schema import","template":"import schema ${schema_prefix} \"${schema_URI}\";\n"},
      {"name":"schema","description":"Insert a schema import","template":"import schema ${schema_prefix} \"${schema_URI}\";\n"},
      {"name":"import","description":"Insert a schema import with location hints","template":"import schema ${schema_prefix} ${schema_URI_and_hints};\n"},
      {"name":"schema","description":"Insert a schema import with location hints","template":"import schema ${schema_prefix} ${schema_URI_and_hints};\n"},
      {"name":"namespace","description":"Insert a namespace declaration","template":"declare namespace ${namespace_name} = \"${URI_literal}\";\n"},
      {"name":"boundry-space","description":"Insert the boundary space declaration","template":"declare boundary-space ${boundary_space_type};"},
      {"name":"namespace","description":"Insert the default namespace declaration","template":"declare default ${default_namespace_type} namespace \"${URI_literal}\";\n"},
      {"name":"option","description":"Insert an option declaration","template":"declare option ${option_name} \"${string_literal}\";\n"},
      {"name":"ordering","description":"Insert the ordering mode declaration","template":"declare ordering ${ordering_mode};"},
      {"name":"empty","description":"Insert the default empty sequence order declaration","template":"declare default order empty ${empty_order_mode};"},
      {"name":"order","description":"Insert the default empty sequence order declaration","template":"declare default order empty ${empty_order_mode};"},
      {"name":"copy-namespaces","description":"Insert the copy-namespaces declaration","template":"declare copy-namespaces ${preserve_mode}, ${inherit_mode};"},
      {"name":"collation","description":"Insert the default collation declaration","template":"declare default collation \"${URI_literal}\";\n"},
      {"name":"base-uri","description":"Insert the base-uri declaration","template":"declare base-uri \"${URI_literal}\";\n"},
      {"name":"construction","description":"Insert the construction declaration","template":"declare construction ${construction_mode};"},
      {"name":"variable","description":"Insert a simple variable declaration","template":"declare variable $$${variable} := ${value};\n"},
      {"name":"variable","description":"Insert a typed variable declaration","template":"declare variable $$${variable} as ${type} := ${value};\n"},
      {"name":"variable","description":"Insert an external variable declaration","template":"declare variable $$${variable} external;\n"},
      {"name":"variable","description":"Insert an external typed variable declaration","template":"declare variable $$${variable} as ${type} external;\n"},
      {"name":"function","description":"Insert a function declaration template","template":"declare function ${function_namespace}:${function_name} (${function_params}) as ${sequence_type} {\n\t${insert_an_expression_here}${cursor}\n};\n\n"},
      {"name":"function","description":"Insert an external function declaration template","template":"declare function ${function_namespace}:${function_name} (${function_params}) as ${sequence_type} external;"},
      {"name":"for","description":"Insert a single For Clause ","template":"for $$${iteration_variable} in expression${cursor}\n"},
      {"name":"for","description":"Insert a single For Clause with positional variable ","template":"for $$${iteration_variable} at $$${positional_variable} in expression${cursor}\n"},
      {"name":"let","description":"Insert a single Let Clause ","template":"let $$${variable} := expression\n"},
      {"name":"order by","description":"Insert a single Order By Clause ","template":"${strict_order} expression ${order_modifier}\n"},
      {"name":"flwor","description":"Insert a simple FLWOR Expression ","template":"for $$${iteration_variable} in expression\nlet $$${variable} := expression\nreturn $$${iteration_variable}${cursor}\n"},
      {"name":"flwor","description":"Insert an extended FLWOR Expression ","template":"for $$${iteration_variable} in expression\nlet $$${variable} := expression\nwhere expression\n${strict_order} expression ${order_modifier}\nreturn\n\t$$${iteration_variable}${cursor}\n"},
      {"name":"some","description":"Insert a Quantified Expression ","template":"${quantifier} $$${variable} in expression satisfies test_expression${cursor}\n"},
      {"name":"every","description":"Insert a Quantified Expression ","template":"${quantifier} $$${variable} in expression satisfies test_expression${cursor}\n"},
      {"name":"typeswitch","description":"Insert a Typeswitch Expression ","template":"typeswitch (expression)\n\tcase $$${variable} as ${sequence_type} return expression${cursor}\n\tdefault $$${variable} return expression\n"},
      {"name":"case","description":"Insert a Case Clause ","template":"case $$${variable} as ${sequence_type} return expression"},
      {"name":"if","description":"Insert an If Expression","template":"if (expression)\n\tthen expression${cursor}\n\telse expression\n"},
      {"name":"instance","description":"Insert an \"instance of\" expression","template":"${expression} instance of ${sequence_type}"},
      {"name":"treat","description":"Insert a \"treat as\" expression","template":"${expression} treat as ${sequence_type}"},
      {"name":"castable","description":"Insert a \"castable as\" expression ","template":"${expression} castable as ${type}"},
      {"name":"cast","description":"Insert a \"cast as\" expression ","template":"${expression} cast as ${atomic_type}"},
      {"name":"validate","description":"Insert a Validate Expression ","template":"validate ${validation_mode} { expression }"},
      {"name":"as","description":"Insert an \"as ...\" expression ","template":"as ${sequence_type}"},
      {"name":"updating","description":"Insert an updating function declaration template","template":"declare updating function ${function_namespace}:${function_name} (${function_params}) {\n\t${insert_an_expression_here}${cursor}\n};\n\n"},
      {"name":"function","description":"Insert an updating function declaration template","template":"declare updating function ${function_namespace}:${function_name} (${function_params}) {\n\t${insert_an_expression_here}${cursor}\n};\n\n"},
      {"name":"insert","description":"Insert an Insert Expression","template":"insert ${node_nodes} ${source_expression} ${target_choice} ${target_expression}"},
      {"name":"delete","description":"Insert a Delete Expression","template":"delete ${node_nodes} ${target_expression}"},
      {"name":"replace","description":"Insert a Replace Expression","template":"replace ${value_of}node ${target_expression} with ${expression}"},
      {"name":"rename","description":"Insert a Rename Expression","template":"rename node ${target_expression} as ${new_expression}"},
      {"name":"copy","description":"Insert a Transform Expression","template":"copy $$${variable} := ${expression} modify ${expression} return ${expression}"},
      {"name":"transform","description":"Insert a Transform Expression","template":"copy $$${variable} := ${expression} modify ${expression} return ${expression}"},
      {"name":"ft-option","description":"Insert a simple \"ft-option\" declaration","template":"declare ft-option ${simple_ftoption};"},
      {"name":"sequential","description":"Insert a sequential function declaration template","template":"declare sequential function ${function_namespace}:${function_name} (${function_params}) as ${sequence_type} {\n\t${insert_an_expression_here}${cursor};\n};\n\n"},
      {"name":"function","description":"Insert a sequential function declaration template","template":"declare sequential function ${function_namespace}:${function_name} (${function_params}) as ${sequence_type} {\n\t${insert_an_expression_here}${cursor};\n};\n\n"},
      {"name":"set","description":"Insert an Assign Expression","template":"set $$${variable} := ${expression}"},
      {"name":"while","description":"Insert a While Expression","template":"while (${loop_expression}) {\n\t${expression}\n}"}
    ],
    "javascript": [
      {"name":"for","description":"iterate over array","template":"for (var ${index} = 0; ${index} < ${array}.length; ${index}++) {\n\t${line_selection}${cursor}\n}"},
      {"name":"for","description":"iterate over array with temporary variable","template":"for (var ${index} = 0; ${index} < ${array}.length; ${index}++) {\n\tvar ${array_element} = ${array}[${index}];\n\t${cursor}\n}"},
      {"name":"forin","description":"iterate using for .. in","template":"for (var ${iterable_element} in ${iterable}) {\n\t${cursor}\n}"},
      {"name":"do","description":"do while statement","template":"do {\n\t${line_selection}${cursor}\n} while (${condition});"},
      {"name":"switch","description":"switch case statement","template":"switch (${key}) {\n\tcase ${value}:\n\t\t${cursor}\n\t\tbreak;\n\n\tdefault:\n\t\tbreak;\n}"},
      {"name":"if","description":"if statement","template":"if (${condition}) {\n\t${line_selection}${cursor}\n}"},
      {"name":"ifelse","description":"if else statement","template":"if (${condition}) {\n\t${cursor}\n} else {\n\t\n}"},
      {"name":"elseif","description":"else if block","template":"else if (${condition}) {\n\t${cursor}\n}"},
      {"name":"else","description":"else block","template":"else {\n\t${cursor}\n}"},
      {"name":"try","description":"try catch block","template":"try {\n\t${line_selection}${cursor}\n} catch (e) {\n\t// ${todo}: handle exception\n}"},
      {"name":"catch","description":"catch block","template":"catch (e) {\n\t${cursor}// ${todo}: handle exception\n}"},
      {"name":"function","description":"function","template":"function ${name}(${}) {\n\t${cursor}\n}"},
      {"name":"function","description":"anonymous function","template":"function (${}) {\n\t${cursor}\n}"},
      {"name":"new","description":"create new object","template":"var ${name} = new ${type}(${arguments});"},
      {"name":"lazy","description":"lazy creation","template":"if (${name:var} == null) {\n\t${name} = new ${type}(${arguments});\n\t${cursor}\n}\n\nreturn ${name};"},
      {"name":"<code>","description":"<code></code>","template":"<code>${word_selection}${}</code>${cursor}"},
      {"name":"null","description":"<code>null</code>","template":"<code>null</code>"},
      {"name":"true","description":"<code>true</code>","template":"<code>true</code>"},
      {"name":"false","description":"<code>false</code>","template":"<code>false</code>"},
      {"name":"<pre>","description":"<pre></pre>","template":"<pre>${word_selection}${}</pre>${cursor}"},
      {"name":"<b>","description":"<b></b>","template":"<b>${word_selection}${}</b>${cursor}"},
      {"name":"<i>","description":"<i></i>","template":"<i>${word_selection}${}</i>${cursor}"},
      {"name":"@author","description":"author name","template":"@author ${user}"},
      {"name":"while","description":"while loop with condition","template":"while (${condition}) {\n\t${line_selection}${cursor}\n}"}
    ]
  };

  CodeMirror.defineExtension("marklogicHintTemplates", function() {
      return templates;
  });

});
