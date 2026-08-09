---
title: "C语言期末速成9：字符串"
description: "字符串的存储与终止符、strlen/strcpy/strcmp 辨析、gets 与 scanf 的输入差异。"
published: 2026-08-09
author: "Myqfeng & DeepSeek"
source: "original"
type: "language-basics/C语言期末速成"
tags: ["C语言", "期末速成"]
--- 

> 本文是《C语言期末速成》系列第 9 篇。C 语言**没有独立的字符串类型**——字符串是"以 `\0` 结尾的字符数组"。正因为缺一个原生类型，字符串相关的函数和坑特别多：`strlen`/`sizeof`、`strcpy`/`strcat`/`strcmp`、`gets`/`scanf`。本篇把它们一次讲透。

---

**上一篇**：[C语言期末速成 8：指针](/posts/language-basics/c-crash/8-pointers)

## 考点清单

- C 语言没有字符串变量，用**字符数组**或**字符指针**存放字符串
- 字符串以 `\0` 结尾；`"1"` 占 2 字节，`'1'` 只占 1 字节
- `strlen` 数到 `\0` 为止（不含 `\0`）；`sizeof` 是"占多少字节"（含 `\0`）
- `strcpy(目标, 源)`：复制；`strcat(目标, 源)`：拼接；`strcmp(a, b)`：比较（返回正/零/负）
- 四个函数的参数都是**地址**
- `scanf("%s", a)` 遇到空格停止；`gets(a)` 能读入空格
- 数组名不能赋值：`ch = "abc"` 非法
- 手写复制：`while (*t++ = *s++);`

---

## 一、字符串是怎么存的

`"abc"` 实际上是 4 个字符：`'a' 'b' 'c' '\0'`。`\0`（ASCII 0）是字符串的**结束标志**，字符串函数都靠它判断"到哪为止"。

```c
char s[] = "abc";
/* 内存：a b c \0   （4 字节，比可见字符多一个） */
```

第 2 章就说过：`'1'` 占 1 字节，`"1"` 占 2 字节——多出来那个就是 `\0`。

### 三种存字符串的合法姿势

```c
char ch1[10] = {"abcdefgh"};   /* 对：数组+花括号 */
char ch2[10] = "abcdefgh";     /* 对：数组直接赋值 */
char ch3[10] = {'a','b','c','d','e','f','g','h'};  /* 对：逐个字符 */
char *p = "abcdefgh";          /* 对：字符指针指向字符串字面量 */
char *q;
q = "abcdefgh";                /* 对：先定义后指向 */
```

两种非法写法：

```c
char ch[10];
ch = "abcdefgh";      /* 错！ch 是数组名（地址常量），不能被赋值 */
char *p = {"abcdefgh"}; /* 错！指针初始化不能带花括号 */
```

**`"abc"` 在内存里是只读的**（字符串字面量通常放在只读区）。所以 `char *p = "abc"; p[0]='x';` 往往崩溃或未定义；而 `char ch[] = "abc"; ch[0]='x';` 安全（是拷贝的普通数组）。

---

## 二、四个核心字符串函数

**前提**：它们的参数都是**地址**（`char*`）。`strcpy` 和 `strcmp` 有两个参数。

| 函数 | 作用 | 返回 |
|---|---|---|
| `strlen(s)` | 求字符串长度（不含 `\0`） | 字符数 |
| `strcpy(dst, src)` | 把 src 复制到 dst（含 `\0`） | dst 地址 |
| `strcat(dst, src)` | 把 src 拼接到 dst 末尾 | dst 地址 |
| `strcmp(a, b)` | 按 ASCII 比较两个字符串 | 正数/0/负数 |

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[20] = "hello";
    char b[20];

    printf("%d\n", strlen(a));      /* 5：不含 '\0' */

    strcpy(b, a);                   /* b = "hello" */
    strcat(b, " world");            /* b = "hello world" */

    int r = strcmp("abc", "abd");   /* 'c'(99) < 'd'(100)，返回负数 */
    printf("%d\n", r);              /* < 0 */

    return 0;
}
```

### 2.1 `strcmp` 的比较规则（加深）

`strcmp(a, b)` **逐字符比较 ASCII 码**：

- 遇到第一个不同的字符就停下来，返回 `a[i] - b[i]`；
- 若某串先到 `\0` 而另一串还有字符，短的更小；
- 全部相同返回 0。

```c
strcmp("abc", "abc")   → 0
strcmp("abc", "abd")   → 负（'c'<'d'）
strcmp("abd", "abc")   → 正
strcmp("ab", "abc")    → 负（"ab" 先到 \0，更短）
```

**注意**：`strcmp` 返回的是正/负/零，**不保证是 ±1**，判断相等要看 `== 0`。

### 2.2 `strcpy` 的目标空间要够（必考点）

`strcpy(dst, src)` 会把 src 的**所有字符连同 `\0`** 拷过去，但**它不检查 dst 空间够不够**——空间不够就写到数组外面（缓冲溢出，轻则数据错乱，重则崩溃或被攻击利用）。

```c
char small[4] = "abc";
strcpy(small, "hello world");   /* 危险！超出 small 的空间 */
```

工程上应保证 `dst` 空间 ≥ `strlen(src) + 1`。

---

## 三、`strlen` vs `sizeof`：两个"长度"别搞混

- `strlen(s)`：**字符串长度**，数到 `\0` 为止，**不含 `\0`**，运行时算；
- `sizeof(s)`：**变量占用的字节数**，含 `\0`、含数组全部容量，**编译期算**。

```c
char a[] = {'a','b','c'};       /* 3 个字符，无 \0 */
char b[5] = {'a','b','c'};      /* 5 个槽，后两个是 0 */

printf("%d %d\n", sizeof(a), strlen(a));  /* 3 ? */
printf("%d %d\n", sizeof(b), strlen(b));  /* 5 3 */
```

逐个拆解：

- `sizeof(a)` = 3（数组总字节）；`strlen(a)` **未定义**（没有 `\0`，会一直往后数，遇到 0 才停，行为不定）；
- `sizeof(b)` = 5（数组容量）；`strlen(b)` = 3（数到第一个 `\0` 为止，`\0` 就是补出来的 0）。

```c
char s[] = "hello";
sizeof(s)     /* 6：5 个字符 + '\0' */
strlen(s)     /* 5：不含 '\0' */
```

**核心结论**：`sizeof` 是"盒子有多大"，`strlen` 是"盒子里装了多少"，且 `strlen` 依赖 `\0` 存在。

---

## 四、字符串的输入：`scanf` vs `gets`

```c
char a[50];
scanf("%s", a);   /* 输入 "good good study!" → a 里只有 "good" */
gets(a);          /* 输入 "good good study!" → a 里是完整一行 */
```

**区别（必考）**：

- `scanf("%s", ...)` 读到**空白（空格/Tab/换行）就停**，不能读空格；
- `gets` 读**一整行**（直到换行），可以包含空格。

注意 `scanf` 的 `%s` **不需要 `&`**——数组名本身就是地址。而 `scanf("%s", &a)` 反而类型不对。

```c
char name[50];
scanf("%s", name);   /* 正确：name 已是地址 */
gets(name);          /* 正确 */
```

**`gets` 的安全隐患（了解）**：`gets` 不知道目标数组有多大，输入一长串就会**越界写坏内存**（缓冲区溢出）。工程上推荐用 `fgets(buf, sizeof(buf), stdin)` 代替——它最多读 `sizeof(buf)-1` 个字符，再自动补 `\0`。期末考一般只要求你记住 `gets` 能读空格、`scanf("%s")` 不能，知道 `gets` 有溢出风险即可。

---

## 五、手写字符串函数（必背）

理解函数原理的最好方式是自己实现一遍。用第 8 章的"指针移动"套路：

**复制**——把 s 的内容连 `\0` 一起搬到 t：

```c
/* 完整版 */
while ((*t = *s) != '\0') { s++; t++; }

/* 简化版：'\0' 的值就是 0，直接当条件 */
while (*t = *s) { s++; t++; }

/* 终极版：一条语句搞定 */
while (*t++ = *s++);
```

`while (*t++ = *s++)` 的解读：

1. `*t++ = *s++` 是个**赋值表达式**，值为赋进去的那个字符（最后赋入 `\0`，值为 0）；
2. 表达式先复制再让两个指针各前移；
3. 赋入 `\0` 时表达式值为 0，循环结束。

**求长度**——数到 `\0` 为止：

```c
int my_strlen(char *s) {
    int n = 0;
    while (*s != '\0') { n++; s++; }
    return n;
}
```

**比较**——找第一个不同的字符：

```c
int my_strcmp(char *a, char *b) {
    while (*a == *b && *a != '\0') { a++; b++; }
    return *a - *b;   /* 不同字符的差；全相同则 0 - 0 = 0 */
}
```

---

## 易错点 / 陷阱

1. **`strlen` 不含 `\0`，`sizeof` 含 `\0`**：`sizeof("abc")=4`，`strlen("abc")=3`。
2. **`"1"` 当 1 字节**：字符串占 2 字节（字符 + `\0`），`'1'` 才是 1 字节。
3. **`ch = "abc"` 当合法**：数组名是地址常量，不能赋值；`gets`/`strcpy` 才是拷贝手段。
4. **`scanf("%s", &a)` 多写 `&`**：`%s` 本身要地址，`a` 就是地址。
5. **`strcpy` 空间不够**：strcpy 不检查空间，可能越界。
6. **`strcmp` 相等用 `==1` 判断**：相等应判断 `strcmp(...) == 0`。
7. **字符数组无 `\0` 就调 `strlen`**：没有结束标志会一直数到越界，结果未定义。
8. **`char *p = {"abc"}` 带花括号**：指针初始化不能带花括号。

---

## 自测小练习

**第 1 题**：`char s[] = "abc";` 求 `sizeof(s)` 和 `strlen(s)`。

**第 2 题**：`char a[10] = {'a','b','c'};` 求 `sizeof(a)` 和 `strlen(a)`。

**第 3 题**：`strcmp("apple", "apply")` 返回正数还是负数？为什么？

**第 4 题**：解释 `while (*t++ = *s++);` 为什么能完成字符串复制。

**第 5 题**：`scanf("%s", buf)` 输入 "hello world"，buf 里是什么？

<details>
<summary>参考答案</summary>

1. `sizeof(s) = 4`（3 字符 + `\0`）；`strlen(s) = 3`。
2. `sizeof(a) = 10`（数组容量）；`strlen(a) = 3`（数到第一个 `\0`）。
3. 负数。第 4 个字符 `'l'(108)` vs `'y'(121)`，`108 - 121 < 0`。
4. 每次先执行 `*t = *s` 赋值，值为赋入的字符；`\0` 的值是 0 使循环终止；`++` 使指针同步后移。
5. `"hello"`。`%s` 遇到空格停止，`world` 留在输入缓冲区。

</details>

---

**下一篇**：[C语言期末速成 10：结构体、共用体与链表](/posts/language-basics/c-crash/10-struct)
