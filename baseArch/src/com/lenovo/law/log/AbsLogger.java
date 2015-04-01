package com.lenovo.law.log;

public abstract class AbsLogger {

	protected LogBean  getLogger() {
		return LoggerAdapter.getLogger(this.getClass());
	}
}
