# babel-plugin-aliasdir

## 说明

用于babel编译时，项目设置别名

## 下载

npm install --save-dev babel-plugin-aliasdir

配置

```bash{.line-numbers}
{
    "plugins": [
        [
            "aliasdir",
            {
                "cursdir": {
                    "@lib": "/src/lib"
                }
            }
        ]
    ]
}
```

从项目根目录开始配置

## Example

* 项目目录

```bash
project
│   README.md
└───controller
│   └───demo
│       │   aController.js
│       │   ...
│
└───lib
│   └───utils
│       │   help.js
│       │   extend.js
│       │   ...
└───....
```

* .babelrc

```bash{.line-numbers}
{
    "plugins": [
        [
            "aliasdir",
            {
                "cursdir": {
                    "@lib": "/src/lib",
                    "@Utils": "/src/lib/utils",
                }
            }
        ]
    ]
}
```

* src/contoller/aController.js

```bash{.line-numbers}
const help = require('@Lib/utils/help');
import extend form '@Utils/extend';
```

* 执行编译命令

```bash
babel src/contoller/aController.js
```

* 输出编译dist/aController.js

```bash{.line-numbers}
const help = require('../../lib/utils/help');
import extend form '../../lib/utils/extend';
```