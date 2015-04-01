package com.lenovo.law.log;

import org.slf4j.Logger;

public class LogBean {
	private Logger logger;

	public Logger getLogger() {
		return logger;
	}

	public void setLogger(Logger logger) {
		this.logger = logger;
	}
	
	public void print(int flag ,String str){
		this.print(flag, str, null);
	}
	
	public void print(int flag,String str,Throwable e){
		switch(flag){
		case 0://debug
			this.getLogger().debug(str, e);
			break;
		case 1://info
			this.getLogger().info(str, e);
			break;
		case 2://warn
			this.getLogger().warn(str, e);
			break;
		case 3://error
			this.getLogger().error(str, e);
			break;
		default:
				break;
		}
	}
}
