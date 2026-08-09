---
title: "C语言期末速成11：文件基本操作"
description: "fopen 模式与文件指针、fprintf/fputs 写入、fscanf/fgets 读取、fread/fwrite 二进制读写与 fseek 定位。"
published: 2026-08-09
author: "Myqfeng & DeepSeek"
source: "original"
type: "language-basics/C语言期末速成"
tags: ["C语言", "期末速成"]
--- 

> 本文是《C语言期末速成》系列第 11 篇。前面的输入输出都在"屏幕"上，这章让数据离开程序：把内容写进文件、从文件读回来。文件读写是上机题和期末考的常客，重点是 `fopen` 的模式、`fprintf/fscanf` 与 `fgets/fputs` 的取舍，以及 `fread/fwrite` 的二进制读写。

---

**上一篇**：[C语言期末速成 10：结构体、共用体与链表](/posts/language-basics/c-crash/10-struct)

## 考点清单

- 打开文件用 `fopen(路径, 模式)`，**返回 `FILE*` 指针，失败返回 `NULL`，必须检查**
- 模式三兄弟：`r` 只读（文件必须存在）、`w` 只写（不存在则建、存在则清空）、`a` 追加（从末尾写）
- `r+`/`w+`/`a+` 是"读写"模式；`w` 系列**会清空**原文件，`r` 系列不会
- 用完文件必须 `fclose(fp)`，成功返回 0，失败返回 EOF
- 文本写入：`fprintf(fp, ...)`、`fputs(s, fp)`、`fputc(c, fp)`
- 文本读取：`fscanf(fp, ...)`（**遇空格/换行就停**）、`fgets(buf, n, fp)`（读一行，含 `\n`）、`fgetc(fp)`
- 二进制读写：`fread`/`fwrite`，实际字节数 = size × count，**返回值是块数不是字节数**
- `fseek(fp, offset, whence)` 定位文件指针；`ftell` 返回当前位置；三个基准 `SEEK_SET/CUR/END`
- 二进制模式用 `"rb"`/`"wb"`；Windows 下文本模式会转换换行符，**二进制数据必须加 `b`**

> 文件操作一般不是常考点，但可能会出那么一两个空，有能力的同学尽可能掌握。

---

## 一、打开与关闭文件：fopen 与 fclose

### 1.1 fopen：拿到"文件指针"

所有文件操作的第一步都是 `fopen`：

```c
FILE *fp = fopen("test.txt", "w");
```

- 第一个参数是**文件名（路径）**，第二个参数是**访问模式**；
- 返回 `FILE*`——文件指针，之后的读写都靠它；
- **失败返回 `NULL`**（文件不存在、路径错误、权限不足等），所以必须判空：

```c
FILE *fp = fopen("test.txt", "w");
if (fp == NULL) {          /* 打开失败必须处理 */
    printf("打开失败\n");
    return 1;
}
```

### 1.2 六个模式（必背）

| 模式 | 含义 | 文件不存在 | 文件已存在 |
|---|---|---|---|
| `r` | 只读 | **失败返回 NULL** | 从开头读 |
| `w` | 只写 | 新建 | **清空后从头写** |
| `a` | 追加写 | 新建 | 从末尾追加 |
| `r+` | 读写 | **失败返回 NULL** | 保留内容，从开头读写 |
| `w+` | 读写 | 新建 | **清空后从头读写** |
| `a+` | 读写追加 | 新建 | 读从头开始，写只能追加 |

**记忆口诀**：`r` 要求文件**必须存在**；`w` 是"**先清空再写**"；`a` 是"**永远追加**"。`+` 表示"多给一个读或写权限"。二进制文件加 `b`：`"rb"`、`"wb"`、`"ab"`、`"rb+"`……

### 1.3 fclose：用完关掉

```c
int ret = fclose(fp);   /* 成功返回 0，失败返回 EOF */
```

`fclose` 会**刷新缓冲区、关闭文件、释放相关内存**。不关文件程序也能跑，但缓冲区的数据可能没落盘就丢了——养成习惯：**打开的文件一定要记得关闭**。

---

## 二、文本写入：fprintf / fputs / fputc

三种写文本的方式，`fprintf` 最常用：

```c
FILE *fp = fopen("test.txt", "w+");

fprintf(fp, "This is testing for fprintf...\n");   /* 格式化写：最常用 */
fputs("This is testing for fputs...\n", fp);        /* 写一个字符串（不自动换行） */
fputc('A', fp);                                     /* 写一个字符 */

fclose(fp);
```

- `fprintf` 和 `printf` 几乎一样，只是多了第一个参数 `fp`——**"printf 输出到屏幕，fprintf 输出到文件"**；
- `fputs` **不会自动加 `\n`**，要换行得自己写；
- 写模式打开时文件若不存在会自动新建（前提是**路径所在的目录存在**）。

---

## 三、文本读取：fscanf / fgets / fgetc

### 3.1 fscanf：按格式读，遇空格就停

```c
char buff[255];
FILE *fp = fopen("test.txt", "r");
fscanf(fp, "%s", buff);       /* 读到第一个空格/换行就停 */
printf("1: %s\n", buff);
fclose(fp);
```

`fscanf` 和 `scanf` 一样有**"遇空格/换行就停"**的毛病：读单词好用，读整行不行。

### 3.2 fgets：读一整行（含换行）

```c
char buff[255];
FILE *fp = fopen("test.txt", "r");
fgets(buff, 255, fp);   /* 最多读 254 个字符，读到 \n 或 EOF 为止 */
printf("%s", buff);
fclose(fp);
```

`fgets(buf, n, fp)` 读 **n-1** 个字符，遇到换行符或文件末尾提前结束，**读到的结果包含换行符** `\n`，并自动补 `\0`。

### 3.3 fgetc：读一个字符

```c
int ch = fgetc(fp);     /* 读一个字符；到达文件末尾返回 EOF */
```

返回类型是 `int` 而不是 `char`——因为要能表示 `EOF`（-1）。

### 3.4 完整读写示例（菜鸟教程经典例题）

```c
#include <stdio.h>
int main(void) {
    FILE *fp = NULL;
    fp = fopen("/tmp/test.txt", "w+");     /* 写模式：不存在会新建 */
    fprintf(fp, "This is testing for fprintf...\n");
    fputs("This is testing for fputs...\n", fp);
    fclose(fp);

    fp = fopen("/tmp/test.txt", "r");
    char buff[255];
    fscanf(fp, "%s", buff);    /* 读到空格停，只拿到 This */
    printf("1: %s\n", buff);
    fgets(buff, 255, fp);      /* 接着读第一行剩余部分 */
    printf("2: %s\n", buff);
    fgets(buff, 255, fp);      /* 完整读完第二行 */
    printf("3: %s\n", buff);
    fclose(fp);
    return 0;
}
```

输出结果：`fscanf` 只读到了 `This`（遇空格停），两次 `fgets` 分别把第一行剩余和第二行读了出来。

---

## 四、二进制读写：fread 与 fwrite

文本文件是给人看的，二进制文件是给程序看的。`fread`/`fwrite` 直接按内存**原样搬运数据块**，没有格式转换开销，适合**结构体、数组、大文件**：

```c
size_t fread(void *ptr, size_t size, size_t count, FILE *stream);
size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream);
```

**四个参数**：目标/源指针、每块字节数、块数、文件指针。**实际读写字节数 = size × count**，返回值是"成功读写的**块数**"，不是字节数。

### 4.1 读写结构体（最常见考法）

```c
typedef struct {
    int id;
    char name[50];
    float score;
} Student;

Student s = {101, "Alice", 95.5f};
FILE *fp = fopen("student.bin", "wb");

fwrite(&s, sizeof(Student), 1, fp);   /* 整个结构体当一块数据写入 */
fclose(fp);

fp = fopen("student.bin", "rb");      /* 再读回来 */
Student loaded;
fread(&loaded, sizeof(Student), 1, fp);
fclose(fp);
```

**注意：结构体里不能用指针成员**（如 `char *name`）——`fwrite` 只保存"指针的值（地址）"，不保存它指向的字符串内容；读回来时地址早已失效，就是**悬空指针**。要存字符串就用**定长数组** `char name[50]`。

### 4.2 读写数组

```c
int data[] = {1, 2, 3, 4, 5};
FILE *fp = fopen("array.bin", "wb");
fwrite(data, sizeof(int), 5, fp);   /* data 等价于 &data[0]，指向数组首地址 */
fclose(fp);

fp = fopen("array.bin", "rb");
int buf[5] = {0};
fread(buf, sizeof(int), 5, fp);
fclose(fp);
```

数组在内存中连续存放，可以一次读写整个数组。

### 4.3 返回值检查与 feof / ferror

`fread` 返回**块数**，若小于期望值，要么到文件末尾（EOF）、要么出错——要用 `feof`/`ferror` 区分：

```c
size_t n = fread(buf, sizeof(int), 100, fp);
if (n < 100) {
    if (feof(fp))        printf("已到文件末尾，实际读了 %zu 个\n", n);
    else if (ferror(fp)) printf("读取过程中发生错误\n");
}
```

- `feof(fp)`：是否到达文件末尾；
- `ferror(fp)`：是否发生读写错误。

### 4.4 为什么二进制模式必须加 b

Windows 下文本模式会把 `\n` 自动转换成 `\r\n`，**二进制数据被改一个字节就全毁了**。Linux/macOS 下文本模式与二进制模式行为一致，但为了跨平台，**二进制文件一律用 `"rb"`/`"wb"`** 打开。

### 4.5 缓冲区刷新：fflush（加深）

标准库的 I/O 是**带缓冲**的，数据先攒在缓冲区里，缓冲区满或 `fclose` 时才真正写盘。如果程序在关键数据写入后**崩溃**，缓冲区里的内容就丢了：

```c
fflush(fp);    /* 强制把缓冲区内容立刻刷到磁盘 */
```

`fclose` 内部会自动调用 `fflush`，所以关键数据写完后要么 `fflush`，要么尽早 `fclose`。

---

## 五、文件定位：fseek 与 ftell（加深）

```c
fseek(fp, 10, SEEK_SET);   /* 从文件头算起，移到偏移 10 */
fseek(fp, 5, SEEK_CUR);    /* 从当前位置往后移 5 字节 */
fseek(fp, 0, SEEK_END);    /* 移到文件末尾 */

long pos = ftell(fp);      /* 当前位置距文件头的字节数 */
```

- 三个基准：`SEEK_SET` 文件头、`SEEK_CUR` 当前位置、`SEEK_END` 文件尾；偏移可为负（往前移）；
- 经典应用：先 `fseek(fp, 0, SEEK_END)` 再 `ftell(fp)`，就得到了**文件大小**（字节数）；
- 只有 `r+` 等读写模式才能"定位后覆盖写"；**`a` 追加模式无视 `fseek`**，永远写在文件末尾。

---

## 易错点 / 陷阱

1. **fopen 后不判 NULL**：文件不存在/没权限时 `fp` 是 `NULL`，直接读写就崩。
2. **用 `r` 模式打开不存在的文件**：返回 `NULL`；要新建必须用 `w`/`a`。
3. **用 `w` 模式清空了原文件**：不想丢内容就用 `a` 追加或 `r+` 读写。
4. **fscanf 与 fgets 混用**：`fscanf` 读到空格就停，剩余内容会留给下一次读取，容易"错位"。
5. **fread 返回值当字节数**：返回值是**块数**，实际字节数 = 返回值 × size。
6. **结构体含指针成员直接 fwrite**：保存的是地址不是内容，读回变悬空指针。
7. **二进制文件用文本模式打开**：Windows 下 `\n` 变 `\r\n`，数据被改写损坏。
8. **忘记 fclose**：缓冲区数据可能没落盘，文件也可能被占用无法删除/重写。
9. **以为 `a` 模式能定位写**：追加模式永远写末尾，`fseek` 不生效。

---

## 自测小练习

**第 1 题**：`fopen("a.txt", "r")` 打开一个不存在的文件，返回值是什么？

**第 2 题**：`w` 与 `a` 模式打开已存在文件时有什么本质区别？

**第 3 题**：`fgets(buf, 100, fp)` 最多读多少个字符？读到的内容包含换行符吗？

**第 4 题**：`fread(p, sizeof(int), 100, fp)` 的返回值是什么含义？要判断"到末尾还是出错"用哪两个函数？

**第 5 题**：结构体里要存字符串，用 `fwrite` 写文件时应该用指针成员还是定长数组？为什么？

<details>
<summary>参考答案</summary>

1. 返回 `NULL`，必须判空处理。
2. `w` 会**清空**原内容后从头写；`a` **保留**原内容，在末尾追加。
3. 最多 **99** 个字符（n-1），读到换行或 EOF 提前结束；**包含**换行符（读到 `\n` 的话）。
4. 返回成功读写的**块数**（不是字节数）；用 `feof(fp)` 和 `ferror(fp)` 区分。
5. 用**定长数组**。指针成员 `fwrite` 只保存地址值，读回时地址已失效，是悬空指针。

</details>

---

**下一篇**：[C语言期末速成 12：预处理、位运算与杂项](/posts/language-basics/c-crash/12-preprocessor)
