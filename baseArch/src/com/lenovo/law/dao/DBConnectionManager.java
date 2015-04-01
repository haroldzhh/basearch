package com.lenovo.law.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import javax.naming.NamingException;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.jdbc.pool.DataSource;

public class DBConnectionManager implements java.io.Serializable {
	private static final long serialVersionUID = -7957626276795874354L;
	private static final String jndi = "java:/comp/env/jdbc/education";
	private static javax.naming.Context ctx = null;
	private static DataSource ds = null;
	private static final DBConnectionManager INSTANCE = new DBConnectionManager();  
	private DBConnectionManager(){};
	public static final DBConnectionManager getInstance() throws NamingException{
		if(ctx == null)
			ctx = new javax.naming.InitialContext();
		if(ds == null)
			ds = (DataSource)ctx.lookup(jndi);
//		System.out.println("========db:==="+ds.getPoolSize());
		return DBConnectionManager.INSTANCE;  
	}  
	
	private Connection getConnection() throws NamingException{
		Connection conn = null;
		try {
			conn = (Connection) ds.getConnection();
			conn.setAutoCommit(true);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	private void closeConn(Connection conn){
		if (conn!=null) 
			try {conn.close();}catch (Exception ignore) {}
	}
	private void closeStmt(PreparedStatement stmt){
		if (stmt!=null) 
			try {stmt.close();}catch (Exception ignore) {}
	}
	private void closeResultSet(ResultSet rs){
		if (rs!=null) 
			try {rs.close();}catch (Exception ignore) {}
	}
	
	public int execute(String sql) throws SQLException{
		return execute(sql, new Object[]{});
	}
	
	//插入并返回主键
	public long executeInsert(String sql) throws SQLException{
		Connection conn=null;
		try {
			conn = DBConnectionManager.getInstance().getConnection();
		} catch (NamingException e1) {
			e1.printStackTrace();
			return -9999;
		}  
        PreparedStatement stmt = null;
        long result = -1;
        ResultSet rs = null;
        try {
        	stmt = createPreparedStatement(conn, sql, new Object[]{});
        	stmt.executeUpdate(sql,PreparedStatement.RETURN_GENERATED_KEYS);
        	rs = stmt.getGeneratedKeys();   
            if (rs!=null&&rs.next()) 
                result = rs.getLong(1);   
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        	this.closeResultSet(rs);
        	this.closeStmt(stmt);
        	this.closeConn(conn); 
        }  
        return result;
	}
	
	public int execute(String sql, Object[] params) throws SQLException {
        Connection conn=null;
		try {
			conn = DBConnectionManager.getInstance().getConnection();
		} catch (NamingException e1) {
			e1.printStackTrace();
			return -9999;
		}  
        PreparedStatement stmt = null;
        int result = -1;
        try {  
            stmt = createPreparedStatement(conn, sql, params);  
            result = stmt.executeUpdate();  
        } catch (Exception e) {
            //conn.rollback();
            e.printStackTrace();
        } finally {  
        	this.closeStmt(stmt);
        	this.closeConn(conn); 
        }  
        return result;  
    } 
	
	private PreparedStatement createPreparedStatement(Connection conn, String sql, Object[] params) 
			throws SQLException {
        PreparedStatement stmt = conn.prepareStatement(sql);
        for (int i = 0; i < params.length; i++)
            stmt.setObject(i + 1, params[i]);
        return stmt;
    }  
	
	public List<Map<String, Object>> executeQuery(String sql){
		return executeQuery(sql, new Object[]{});
	}
	public List<Map<String, Object>> executeQuery(String sql, Object[] params) {  
		Connection conn=null;
		try {
			conn = DBConnectionManager.getInstance().getConnection();
		} catch (NamingException e1) {
			e1.printStackTrace();
			return null;
		}  
		PreparedStatement stmt = null;  
		ResultSet rs = null;  
		try {  
			stmt = createPreparedStatement(conn, sql, params);
			System.out.println("sql------------:"+sql);
			rs = stmt.executeQuery();;  
  
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();  
			Map<String, Object> map = null;  
			ResultSetMetaData rsd = rs.getMetaData();  
			int columnCount = rsd.getColumnCount();  
  
			while (rs.next()) {
				map = new HashMap<String, Object>(columnCount);  
				for (int i = 1; i <= columnCount; i++) {
					map.put(rsd.getColumnLabel(i), rs.getObject(i));  
				}  
				list.add(map);  
			}
  
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			this.closeResultSet(rs);
            this.closeStmt(stmt);
            this.closeConn(conn);
		}
	}  
}
