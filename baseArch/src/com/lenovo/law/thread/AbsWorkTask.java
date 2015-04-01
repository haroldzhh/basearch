package com.lenovo.law.thread;

import com.lenovo.law.log.AbsLogger;

public abstract class AbsWorkTask extends AbsLogger implements IWorkTask{

	protected int id = 0;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@Override
	abstract public Object call();

}
