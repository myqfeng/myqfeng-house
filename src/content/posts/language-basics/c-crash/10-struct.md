---
title: "C语言期末速成10：结构体、共用体与链表"
description: "struct 内存对齐、union 共享内存、typedef 别名、链表增删节点与 malloc/free。"
published: 2026-08-09
author: "Myqfeng & DeepSeek"
source: "original"
type: "language-basics/C语言期末速成"
tags: ["C语言", "期末速成"]
--- 

> 本文是《C语言期末速成》系列第 10 篇。前面学的都是"单种数据"，这章开始组合：`struct` 把不同类型打包成一个整体，`union` 让多个成员共享一块内存，`typedef` 给类型起别名，最后用结构体 + 指针拼出**链表**——数据结构的第一课。

---

**上一篇**：[C语言期末速成 9：字符串](/posts/language-basics/c-crash/9-strings)

## 考点清单

- `struct`：把不同类型的成员组合成一个新类型；用 `.` 访问成员（指针用 `->`）
- `union`：所有成员**从同一地址开始，共享内存**，大小取最大成员
- `typedef`：给已有类型**起别名**，不产生新类型；`typedef int QQ;` 后 `QQ x;` 即 `int x;`
- 链表节点通常有**两个域**：数据域 + 指针域
- 链表节点用 `malloc` 动态分配，用完要 `free` 释放，二者**要配对**
- `malloc` 返回类型是 `void*`，通常需要强转
- 链表插入/删除节点的关键是**修改指针的指向顺序**

---

## 一、结构体：把数据打包

### 1.1 定义与使用

```c
struct Student {
    int id;
    char name[20];
    double score;
};          /* 别忘分号 */

int main(void) {
    struct Student s;         /* 声明结构体变量 */
    s.id = 1001;
    strcpy(s.name, "Alice");  /* 字符串成员要用 strcpy 赋值 */
    s.score = 95.5;

    struct Student t = {1002, "Bob", 88.0};   /* 初始化 */

    printf("%d %s %.1f\n", s.id, s.name, s.score);
    return 0;
}
```

**定义语法**：`struct [标签] { 成员 } [变量表];` 三个部分里**至少出现两个**——标签可以省略（匿名结构体，只能用变量表），变量表也可以省略（只定义类型，不建变量）：

```c
struct Point { int x, y; };       /* 有标签、无变量 */
struct { int a, b; } v;           /* 无标签、有变量：只能用 v 访问 */
struct Node { int d; struct Node *next; };  /* 含指向自身的指针（链表） */
```

**成员访问**：

- 普通变量用点 `.`：`s.id`；
- **指针**用箭头 `->`：`p->id` 等价于 `(*p).id`。

```c
struct Student *p = &s;
p->score = 99.0;      /* 等价于 (*p).score = 99.0 */
```

`->` 的本质就是"解引用 + 取成员"，`p->id` 和 `(*p).id` 完全等价。

### 1.2 结构体的复制

结构体变量可以**整体赋值**（不像数组）：

```c
struct Student a = {1, "Alice", 90};
struct Student b;
b = a;            /* 把 a 的内容整体拷给 b（数组成员除外，结构体拷贝没问题） */
```

### 1.3 结构体作函数参数

结构体可以传值也可以传地址。**传值**是整份拷贝，改不动实参；**传地址**能改实参且省内存：

```c
void show(struct Student s) {        /* 传值：整份拷贝 */
    printf("%d\n", s.id);
}

void setScore(struct Student *p, double v) {   /* 传地址 */
    p->score = v;                    /* 修改会影响实参 */
}
```

---

## 二、内存对齐：struct 实际占多大（加深）

```c
struct Box {
    char c;      /* 1 字节 */
    int  n;      /* 4 字节 */
};
printf("%zu\n", sizeof(struct Box));
```

直觉回答是 5，但很多平台上结果是 **8**。原因是**内存对齐**：为了读写效率，硬件要求某些类型从"对齐的地址"开始存放，编译器在成员之间（或末尾）插入**填充字节**。

```
偏移：0        1~3    4  5  6  7
     [c][ 填充 ][      n     ]
```

规则不要求背死，但要知道：**`sizeof(struct)` 往往大于各成员字节之和**。这也是为什么"判断 struct 大小"不能简单相加。

---

## 三、共用体：union 共享一块内存

`union` 和 `struct` 语法几乎一样，但内存模型完全不同：

- `struct`：每个成员**各有各的空间**，总大小 ≈ 各成员之和（加上对齐）；
- `union`：所有成员**从同一地址开始**，大小 = **最大成员**的大小，任一时刻只有一个成员有效。

```c
union Data {
    int  a;      /* 4 字节 */
    char ch[2];  /* 2 字节 */
};
printf("%zu\n", sizeof(union Data));   /* 4：取最大成员 */
```

`union` 里改了一个成员，另一个成员（在同一块内存上）的解读就会变——因为它们**共用同一段字节**。**同一时刻只有最后赋值的那个成员有效**，之前赋值的内容会被覆盖损坏：

```c
union Data d;
d.a = 10;                       /* 先把 int 填进 4 字节 */
strcpy(d.ch, "AB");             /* 又写字符：把前面的 int 覆盖了 */
printf("%d\n", d.a);            /* 数值已被破坏，输出什么不确定 */
```

```c
union Data d;
d.a = 0x4142;        /* 低字节 0x42 对应 'B'，次低 0x41 对应 'A'（小端） */
printf("%c%c\n", d.ch[0], d.ch[1]);   /* B A */
```

`sizeof(union Data)` 的考点：**取成员中字节数最大的那个**，不是求和。

---

## 四、typedef：给类型起别名

```c
typedef int QQ;        /* 给 int 起别名 QQ */
QQ x;                  /* 等价于 int x; */

typedef int *IP;       /* 给 int* 起别名 IP */
IP p;                  /* 等价于 int *p; */

typedef struct Student Stu;   /* 给 struct Student 起别名 */
Stu s;                         /* 等价于 struct Student s; */
```

**要点**：

1. `typedef` **不产生新类型**，只是别名；
2. `typedef` 是**关键字**；
3. 结构体 + typedef 组合后，声明变量可以不用写 `struct`。

常见写法是把定义和别名一起写：

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;              /* 以后 Node 就代表 struct Node */
```

注意链表节点内部引用自己时，`struct Node *next` 中的 `struct` **不能省**（此时 `Node` 别名还没定义完）。

### typedef 与 #define 的区别（选择题常考）

两者都能"起别名"，但本质不同，最经典的坑是：

```c
#define PTR_INT int *     /* 宏：纯文本替换 */
PTR_INT p1, p2;           /* 展开成 int *p1, p2; → p2 是普通 int，不是指针！ */

typedef int *IP;          /* typedef：真正的类型别名 */
IP q1, q2;                /* q1、q2 都是 int* */
```

- `typedef` 由**编译器**处理、只给类型起别名；`#define` 由**预处理器**做纯文本替换，还能定义值和宏；
- 用 `#define` 连续声明多个指针变量会踩坑（`p2` 不是指针），用 `typedef` 则全部一致。

---

## 五、动态内存：malloc 与 free

链表节点数量运行时才知道，需要**动态分配内存**：

```c
int *p = (int *)malloc(sizeof(int));   /* 申请 4 字节 */
if (p == NULL) return 1;               /* 申请失败要检查 */
*p = 100;
free(p);                               /* 用完了必须释放 */
```

要点：

- `malloc(n)`：申请 `n` 字节，返回 **`void*`**，通常强转为目标类型指针；
- 等价写法 `malloc(4)` 和 `malloc(sizeof(int))` 一样（都是 4 字节）；
- 分配失败返回 `NULL`，最好检查；
- `free(p)`：释放 `p` 指向的堆内存，**malloc 和 free 要一一配对**；
- 释放后 `p` 成为"悬空指针"，**最好立刻 `p = NULL;`**（第 8 章的指针三态），否则再次解引用 `p` 是未定义行为。

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *newNode(int v) {
    Node *p = (Node *)malloc(sizeof(Node));
    if (p) { p->data = v; p->next = NULL; }
    return p;
}
```

---

## 六、链表：增删节点（重难点）

链表是一串节点，每个节点**数据域存值、指针域存下一个节点的地址**，靠 `next` 串起来，末尾指向 `NULL`。

### 6.1 构造一个简单链表

```c
Node *head = newNode(1);      /* 头节点 */
head->next = newNode(2);
head->next->next = newNode(3);
/* 1 -> 2 -> 3 -> NULL */
```

遍历：

```c
for (Node *p = head; p != NULL; p = p->next)
    printf("%d ", p->data);
```

### 6.2 头插法：新节点插到最前面

```c
void insertHead(Node **head, int v) {
    Node *p = newNode(v);
    p->next = *head;    /* 先让新节点指向旧头 */
    *head = p;          /* 再让头指针指向新节点 */
}
/* 顺序插入 1、2、3 得到 3 -> 2 -> 1 -> NULL */
```

**顺序不能反**：如果先 `*head = p` 再 `p->next = *head`，`*head` 已经变成 p，旧链表就丢了。

### 6.3 尾插法：新节点接到末尾

```c
void insertTail(Node **head, int v) {
    Node *p = newNode(v);
    if (*head == NULL) { *head = p; return; }
    Node *cur = *head;
    while (cur->next != NULL) cur = cur->next;   /* 走到最后一个 */
    cur->next = p;                               /* 接上 */
}
```

### 6.4 删除指定节点

```c
void deleteNode(Node **head, int v) {
    Node *cur = *head, *prev = NULL;
    while (cur && cur->data != v) { prev = cur; cur = cur->next; }
    if (cur == NULL) return;              /* 没找到 */
    if (prev == NULL) *head = cur->next;  /* 删的是头节点 */
    else prev->next = cur->next;          /* 跳过被删节点 */
    free(cur);                            /* 释放 */
}
```

**删除的核心**：让**前一个节点**的 `next` 跳过被删节点，指向它的下一个；然后 `free` 释放。画图理解最直观：

```
删除前： A -> B -> C
删除 B： A.next = C； free(B)
```

---

## 易错点 / 陷阱

1. **`struct` 定义末尾忘分号**：`} ...` 后必须加分号。
2. **`union` 大小当成员和**：union 大小是最大成员（含对齐），不是相加。
3. **指针访问成员用 `.`**：指针必须用 `->` 或 `(*p).成员`。
4. **`typedef` 产生新类型**：它只是别名，不创建新类型。
5. **链表内部引用自己时省 `struct`**：`struct Node *next` 里的 `struct` 不能省。
6. **`malloc` 忘记强转 / 忘记检查 NULL / 忘记 free**：返回 `void*`、失败返回 NULL、用完必须 free。
7. **头插顺序写反**：先改头指针会丢链表。
8. **删头节点没处理**：`prev == NULL` 时要把头指针更新为 `cur->next`。

---

## 自测小练习

**第 1 题**：`typedef int *P; P p;` 中 `p` 的类型是什么？

**第 2 题**：一个 `union` 含 `int a` 和 `char ch[4]`，`sizeof(union)` 是多少（假设 int 4 字节）？

**第 3 题**：写出 `p->data` 用点运算符的等价写法。

**第 4 题**：链表头插法为什么必须先 `p->next = *head`，再 `*head = p`？

**第 5 题**：`malloc(sizeof(Node))` 返回什么类型？使用后必须做什么？

<details>
<summary>参考答案</summary>

1. `int*`（`P` 是 `int*` 的别名）。
2. `4`（取最大成员，int 占 4，char[4] 也是 4）。
3. `(*p).data`。
4. 若先改 `*head = p`，旧链表头就丢了；必须先让新节点指向旧头，再更新头指针。
5. 返回 `void*`（通常强转为 `Node*`）；使用后必须 `free` 释放。

</details>

---

**下一篇**：[C语言期末速成 11：文件基本操作](/posts/language-basics/c-crash/11-file-io)
