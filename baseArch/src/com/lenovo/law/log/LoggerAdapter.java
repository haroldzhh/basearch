package com.lenovo.law.log;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggerAdapter {
	public static LogBean getLogger(Class<?> clazz){
		LogBean lb = new LogBean();
		Logger logger = LoggerFactory.getLogger(clazz.getName());
		lb.setLogger(logger);
		return lb;
	}
}
