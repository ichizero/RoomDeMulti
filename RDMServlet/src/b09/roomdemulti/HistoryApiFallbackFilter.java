package b09.roomdemulti;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebFilter;

/**
 * React Routerに対応するため、HTML5 History APIを利用する。
 * 
 * 参考: https://github.com/lookfirst/history-api-fallback
 */
@WebFilter("/*")
public class HistoryApiFallbackFilter implements Filter {

    private static final String REENTRANCY_KEY = HistoryApiFallbackFilter.class.getName();

    protected static String forwardPath = "/";

    /**
     * リクエストがGETであればtrueを返す
     * 
     * @param method リクエストメソッド 
     * @return リクエストがGETか否か
     */
    private boolean isGet(String method) {
        return method.equals("GET");
    }

    /** 
     * ヘッダーの有無を返す
     * 
     * @param header ヘッダー
     * @return ヘッダーがあればtrue
     */
    private boolean hasHeader(String header) {
        return header != null && header.length() > 0;
    }

    /**
     * ヘッダーにapplication/jsonが含まれていればtrueを返す
     * 
     * @param header ヘッダー
     * @return application/jsonを含めばtrue
     */
    private boolean isApplicationJson(String header) {
        return header.contains("application/json");
    }

    /**
     * ヘッダーにtext/htmlか ** が含まれいればtrueを返す
     * 
     * @param header ヘッダー
     * @return text/htmlか ** を含めばtrue
     */
    private boolean acceptsHtml(String header) {
        return header.contains("text/html") || header.contains("*/*");
    }

    /**
     * URLにドットが含まれていればtrueを返す
     * 
     * @param path URL
     * @return URLにドットが含まれていればtrue
     */
    private boolean pathIncludesDot(String path) {
        return path != null && path.indexOf('.') != -1;
    }

    /**
     * doFilter()の実装
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = ((HttpServletRequest) servletRequest);
        HttpServletResponse response = ((HttpServletResponse) servletResponse);

        String method = request.getMethod().toUpperCase();
        String accept = request.getHeader("Accept");
        if (accept != null)
            accept = accept.toLowerCase();
        String requestURI = request.getRequestURI();

        Object reentrancyKey = request.getAttribute(REENTRANCY_KEY);

        boolean doFilter = false;

        if (reentrancyKey != null || !isGet(method) || !hasHeader(accept) || isApplicationJson(accept)
                || !acceptsHtml(accept) || pathIncludesDot(requestURI)) {
            doFilter = true;
        }

        // System.out.println("doFilter: " + doFilter + ", requestURI: " + requestURI);

        if (doFilter) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            // Prevent the next request from hitting this filter
            request.setAttribute(REENTRANCY_KEY, Boolean.TRUE);
            request.getRequestDispatcher(forwardPath).forward(request, response);
        }
    }

    /**
     * destroy()の実装
     */
    @Override
    public void destroy() {
        // 処理なし
    }

    /**
     * init()の実装
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 処理なし
    }
}
