<template>
  <div>
    <el-row>
      <el-button type="primary" @click="addRow">添加</el-button>
    </el-row>
    <el-row>
      <el-table :data="articles" style="width: 100%" max-height="400px" border>
        <el-table-column fixed label="序号" width="150">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文章" width="120" />
        <el-table-column prop="category" label="标签" width="120" />
        <el-table-column prop="createdTime" label="创建时间" width="180" />
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <span v-if="scope.row.content.length > 20">
              {{ scope.row.content.slice(0, 20) }} ......
            </span>
            <span v-else>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="180">
          <template slot="header" slot-scope="scope">
            <el-input type="hidden" v-model="scope.$index" />
            <el-input
              v-model="queryForm.search"
              size="mini"
              placeholder="输入关键字搜索"
              @keyup.enter.native="fetchArticles"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, articles)"
            >
              移除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="editRow(scope.$index, articles)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="lookContent(scope.$index, articles)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        :current-page="queryForm.currentPage"
        :page-sizes="pageSizes"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <el-row>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="showDialog"
        fullscreen
        :before-close="handleClose"
      >
        <el-form ref="articleForm" :model="articleForm" label-width="80px">
          <el-input v-model="articleForm.id" type="hidden" />
          <el-form-item label="文章名称" prop="name">
            <el-input v-model="articleForm.name" />
          </el-form-item>
          <el-form-item label="文章标签" prop="category">
            <el-autocomplete
              v-model="articleForm.category"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入标签"
              @select="handleSelect"
            />
          </el-form-item>
          <editor
            ref="toastuiEditor"
            :initial-value="articleForm.content"
            initial-edit-type="markdown"
            :options="options"
            height="500px"
            preview-style="vertical"
            @change="onEditorChange"
          />
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">保 存</el-button>
        </span>
      </el-dialog>
    </el-row>
    <el-row>
      <el-dialog title="预览" :visible.sync="lookDialog" fullscreen>
        <viewer
          ref="toastuiViewer"
          :initial-value="articleForm.content"
          height="500px"
          :options="options"
        />
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, Viewer } from "@toast-ui/vue-editor";
import request from "@/utils/request";
export default {
  components: {
    Editor,
    Viewer
  },
  data() {
    return {
      options: {
        minHeight: "200px",
        language: "en-US",
        useCommandShortcut: true,
        useDefaultHTMLSanitizer: true,
        usageStatistics: true,
        hideModeSwitch: false,
        toolbarItems: [
          "heading",
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "task",
          "indent",
          "outdent",
          "divider",
          "table",
          "image",
          "link",
          "divider",
          "code",
          "codeblock"
        ]
      },
      articleForm: {
        name: "",
        category: "",
        content: ""
      },
      queryForm: {
        search: "",
        currentPage: 1,
        pageSize: 5
      },
      pageSizes: [5, 10, 20],
      dialogTitle: "对话框",
      showDialog: false,
      lookDialog: false,
      articles: [],
      total: 0
    };
  },
  created() {
    this.fetchArticles();
  },
  methods: {
    formReset() {
      this.articleForm.name = "";
      this.articleForm.category = "";
      this.articleForm.content = "";
      if (this.$refs.toastuiEditor) {
        this.$refs.toastuiEditor.invoke("setMarkdown", "");
      }
    },
    submitForm() {
      request({
        url: "/article/save",
        method: "post",
        data: this.articleForm
      })
        .then(res => {
          if (res && res.data) {
            this.$message.info("保存文章成功");
            this.fetchArticles();
            this.showDialog = false;
          } else {
            this.$message.error("保存文章失败");
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    onEditorChange() {
      this.articleForm.content = this.$refs.toastuiEditor.invoke("getMarkdown");
    },
    fetchArticles() {
      request({
        url: "/article/search",
        method: "get",
        params: this.parseParams(this.queryForm)
      })
        .then(res => {
          const data = res.data;
          this.articles = data.articles;
          this.total = data.total;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    parseParams(obj) {
      const res = {};
      Object.keys(obj).forEach(key => {
        if (obj[key]) {
          res[key] = obj[key];
        }
      });
      return res;
    },
    deleteRow(index, rows) {
      this.$confirm("确认删除吗", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: "/article/delete/" + rows[index].id,
            method: "delete"
          })
            .then(res => {
              if (res && res.data) {
                this.$message.info("移除成功");
                this.fetchArticles();
              } else {
                this.$message.warning("移除失败");
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    addRow() {
      this.dialogTitle = "添加文章";
      this.formReset();
      this.showDialog = true;
    },
    editRow(index, rows) {
      this.dialogTitle = "编辑文章";
      this.articleForm = rows[index];
      if (this.$refs.toastuiEditor) {
        this.$refs.toastuiEditor.invoke(
          "setMarkdown",
          this.articleForm.content
        );
      }
      this.showDialog = true;
    },
    lookContent(index, rows) {
      this.articleForm = rows[index];
      if (this.$refs.toastuiViewer) {
        this.$refs.toastuiViewer.invoke(
          "setMarkdown",
          this.articleForm.content
        );
      }
      this.lookDialog = true;
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchArticles();
    },
    handleCurrentChange(val) {
      this.queryForm.currentPage = val;
      this.fetchArticles();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    querySearchAsync() {},
    handleSelect() {}
  }
};
</script>
<style scoped>
.el-row {
  margin-top: 20px;
}
</style>
